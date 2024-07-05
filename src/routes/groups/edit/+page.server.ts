import { editGroupSchema } from "@/schemas/group.js";
import type { GroupData, EditGroupDataForm, GroupMemberData } from "@/types";
import { handleSignInRedirect } from "@/utils";
import { translate } from "@/utils/translation/translate-util";
import { redirect } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

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
            current_members: memberString
        },
        is_authorized: is_authorized,
    };    
};

export const actions = {
    default: async (event) => {
        const { session } = await event.locals.safeGetSession();
        const locale = event.cookies.get("languagePreference") || "EN";

        if (!session) {
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
        const { members, current_members, ...groupDataRequest } = form.data;
        let membersCleaned: string = cleanMembersString(members);
        let users: any[] = [];

        if (membersCleaned !== current_members) {
            const queryEmailList = buildQueryToValidateEmails(membersCleaned);        
            const { data: users, error: getUserIdsFromEmailsError} = await event.locals.supabase
                .from('profiles')
                .select('id')
                .filter('email', 'in', queryEmailList);

            if (getUserIdsFromEmailsError) {
                setFlash({ type: 'error', message: getUserIdsFromEmailsError.message }, event.cookies);
                return fail(500, { message: getUserIdsFromEmailsError.message, form });
            }

            if (users.length !== getEmailListFromString(membersCleaned).length) {
                const errorMessage = translate(locale, "error.emailsNotRegistered");
                setFlash({ type: 'error', message: errorMessage }, event.cookies);
                return fail(400, { message: errorMessage, form });
            }

            if (!membersCleaned.includes(groupDataRequest.leader)) {
                const errorMessage = translate(locale, "error.leaderNotInMembers");
                setFlash({ type: 'error', message: errorMessage }, event.cookies);
                return fail(400, { message: errorMessage, form });
            }
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

        if (users.length > 0) {
            await Promise.all(users.map(async (user) => {
                const { error: updateUsersWithGroupId } = await event.locals.supabase
                    .from('profiles')
                    .update({group_id: group.id})
                    .eq('id', user.id)
    
                if (updateUsersWithGroupId) {
                    setFlash({ type: 'error', message: updateUsersWithGroupId.message }, event.cookies);
                    return fail(500, { message: updateUsersWithGroupId.message, form });
                }
            }));
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

function buildQueryToValidateEmails(emails: string): string {
    return '(' + emails.replaceAll(" ", "") + ')'
}

function cleanMembersString(members: string): string {
    return members.replaceAll(" ", "").replace(/, $/, "").replace(/,$/, "")
}