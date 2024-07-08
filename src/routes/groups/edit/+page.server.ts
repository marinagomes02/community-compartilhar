import { editGroupSchema } from "@/schemas/group.js";
import { type GroupData, type EditGroupDataForm, type GroupMemberData, NotificationType } from "@/types";
import { handleSignInRedirect } from "@/utils";
import { translate } from "@/utils/translation/translate-util";
import { redirect } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { sendBatchNotifications } from "../../notifications/notifications-api";

export const load = async (event) => {
    const { session, user } = await event.locals.safeGetSession();
	
	if (!session || !user) {
		return redirect(302, handleSignInRedirect(event));
	}

    const { data: groupDataResult, error: groupDataError } = await event.locals.supabase
        .from('groups_view')
        .select('*, members: profiles!inner(id, email), tmp_members:profiles!inner(id, email)')
        .in('tmp_members.id', [user.id])
        .single();

    if (groupDataError) {
        setFlash({ type: 'error', message: "User not found" }, event.cookies);
        return redirect(303, '/groups');
    }
    let memberString = getMemberString(groupDataResult.members);
    const { members, is_authorized, tmp_members, ...groupData } = groupDataResult
    
    return {
        editGroupData: {
            members: memberString, 
            ...groupData, 
            current_members: groupDataResult.members
        },
        is_authorized: is_authorized,
        completed_state_old: groupData.is_complete,
        current_members: groupDataResult.members
    };    
};

export const actions = {
    default: async (event) => {
        const { session, user } = await event.locals.safeGetSession();
        const locale = event.cookies.get("languagePreference") || "EN";

        if (!session || !user) {
            const errorMessage = translate(locale, "error.unauthorized");
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            return error(401, errorMessage);
        }

        const form = await superValidate(event.request, zod(editGroupSchema));

        if (!form.valid) {
            const errorMessage = translate(locale, "error.invalidForm");
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            return fail(400, { message: errorMessage, form });
        }

        const { members, current_members, completed_state_old, ...groupDataRequest } = form.data;
        let membersCleaned: string = cleanMembersString(members);
        let users_ids: any[] = [];

        // Remove remianing users to check differences between current and new members list
        const { current_members: old_members, new_members } = removeRemainingUsers(
            current_members.map(member => member.email),
            getEmailListFromString(membersCleaned)
        );

        if (new_members.length > 0) {
            const queryEmailList = buildQueryToValidateEmails(new_members);        
            const { data: users, error: getUserIdsFromEmailsError} = await event.locals.supabase
                .from('profiles')
                .select('id')
                .filter('email', 'in', queryEmailList);

            if (getUserIdsFromEmailsError) {
                setFlash({ type: 'error', message: getUserIdsFromEmailsError.message }, event.cookies);
                return fail(500, { message: getUserIdsFromEmailsError.message, form });
            }

            if (users.length !== new_members.length) {
                const errorMessage = translate(locale, "error.emailsNotRegistered");
                setFlash({ type: 'error', message: errorMessage }, event.cookies);
                return fail(400, { message: errorMessage, form });
            }
            users_ids = users.map((user) => (user.id));
        }

        const { data: group, error: editGroupError } = await event.locals.supabase
            .from('groups')
            .update(groupDataRequest)
            .eq('id', groupDataRequest.id)
            .select()
            .single();
        
        if (editGroupError) {
            setFlash({ type: 'error', message: editGroupError.message }, event.cookies);
            return fail(500, { message: editGroupError.message, form });
        }
        
        // Add new members to group
        if (users_ids.length > 0) {
            await Promise.all(users_ids.map(async (user_id) => {
                const { error: updateUsersWithGroupId } = await event.locals.supabase
                    .from('profiles')
                    .update({group_id: group.id})
                    .eq('id', user_id)
    
                if (updateUsersWithGroupId) {
                    setFlash({ type: 'error', message: updateUsersWithGroupId.message }, event.cookies);
                    return fail(500, { message: updateUsersWithGroupId.message, form });
                }
            }));
        }

        // Remove old members from group
        if (old_members.length > 0) {
            await Promise.all(old_members.map(async (email) => {
                const { error: removeUsersGroupId } = await event.locals.supabase
                    .from('profiles')
                    .update({group_id: null})
                    .eq('email', email)
    
                if (removeUsersGroupId) {
                    setFlash({ type: 'error', message: removeUsersGroupId.message }, event.cookies);
                    return fail(500, { message: removeUsersGroupId.message, form });
                }
            }));
        }

        if (completed_state_old !== groupDataRequest.is_complete && !groupDataRequest.is_complete) {
            const { data: users_ids } = await event.locals.supabase
				.from('profiles')
				.select('id')
				.neq('id', user.id);

			const ids: string[] = users_ids?.map((user) => (user.id)) ?? [];
			await sendBatchNotifications(ids, 'Há um grupo à procura de grupo', NotificationType.GroupLookingForMember, null, groupDataRequest.id, event.locals.supabase)
        }

        setFlash({ type: 'success', message: translate(locale, "success.editGroup") }, event.cookies);
		return redirect(303, '/groups/edit');
    }
};


function getMemberString(membersData: GroupMemberData[]) {
    let members: string[] = [];
    membersData.forEach(member => {
        members.push(member.email);
    });
    return members.join(', ');
}

function getEmailListFromString(emails: string): string[] {
    return emails.replaceAll(" ", "").split(",")
}

function buildQueryToValidateEmails(emails: string[]): string {
    return '(' + emails.map(email => email + ",") + ')'
}

function cleanMembersString(members: string): string {
    return members.replaceAll(" ", "").replace(/, $/, "").replace(/,$/, "")
}

function removeRemainingUsers(current_members_field: string[], new_members_field: string[]) {
    const set1 = new Set(current_members_field);
    const set2 = new Set(new_members_field);
    let remainingUser = [...set1].filter(x => set2.has(x));

    let current_members = current_members_field.filter(item => !remainingUser.includes(item));
    let new_members = new_members_field.filter(item => !remainingUser.includes(item));

    return { current_members, new_members };
}