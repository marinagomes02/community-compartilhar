import { editGroupSchema, searchUserSchema } from "@/schemas/group.js";
import { type GroupData, type EditGroupDataForm, type GroupMemberData, NotificationType, type UserListData } from "@/types";
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
        .select('*, members: profiles!inner(id), tmp_members:profiles!inner(id, email)')
        .in('tmp_members.id', [user.id])
        .single();

    if (groupDataError) {
        setFlash({ type: 'error', message: "User not found" }, event.cookies);
        return redirect(303, '/groups');
    }

    const { data: users, error: getUsersError } = await event.locals.supabase
        .from('profiles')
        .select('id, email, display_name')
        .order('display_name', { ascending: true });

    let users_list: UserListData[] = users ?? [];
    const { members, is_authorized, tmp_members, ...groupData } = groupDataResult;
    const members_ids = members.map((m: any) => m.id);
    
    return {
        editGroupData: {
            members: members_ids,
            ...groupData, 
            current_members: members_ids
        },
        is_authorized: is_authorized,
        completed_state_old: groupData.is_complete,
        current_members: members_ids,
        searchUsersForm: await superValidate(event.request, zod(searchUserSchema)),
        users_list
    };    
};

export const actions = {
    edit: async (event) => {
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

        // Remove remaining users to check differences between current and new members list
        const { current_members: old_members, new_members } = removeRemainingUsers(current_members, members);
        
        // Add new members to group
        if (new_members.length > 0) {
            await Promise.all(new_members.map(async (user_id) => {
                const { error: updateUsersWithGroupId } = await event.locals.supabase
                    .from('profiles')
                    .update({group_id: form.data.id})
                    .eq('id', user_id)
    
                if (updateUsersWithGroupId) {
                    setFlash({ type: 'error', message: updateUsersWithGroupId.message }, event.cookies);
                    return fail(500, { message: updateUsersWithGroupId.message, form });
                }
            }));
        }

        // Remove old members from group
        if (old_members.length > 0) {
            await Promise.all(old_members.map(async (user_id) => {
                const { error: removeUsersGroupId } = await event.locals.supabase
                    .from('profiles')
                    .update({group_id: null})
                    .eq('id', user_id)
    
                if (removeUsersGroupId) {
                    setFlash({ type: 'error', message: removeUsersGroupId.message }, event.cookies);
                    return fail(500, { message: removeUsersGroupId.message, form });
                }
            }));
        }

        // if group is lloking for members - send notifications
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
    },
    searchUsers: async (event) => {
        const { session, user } = await event.locals.safeGetSession();
        const locale = event.cookies.get("languagePreference") || "EN";
        
        if (!session || !user) {
            const errorMessage = translate(locale, "error.unauthorized");
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            return error(401, errorMessage);
        }
        
        const form = await superValidate(event.request, zod(searchUserSchema));
        
        if (!form.valid) {
            const errorMessage = translate(locale, "error.invalidForm");
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            return fail(400, { message: errorMessage, form });
        }
        
        const { filter } = form.data;
        const { data: users, error: getUsersError } = await event.locals.supabase
            .from('profiles')
            .select('id, email, display_name')
            .ilike('email', `%${filter}%`);

        if (getUsersError) {
            setFlash({ type: 'error', message: getUsersError.message }, event.cookies);
            return fail(500, { message: getUsersError.message, form });
        }
        console.log(users);

        return users;
    }
};

function getEmailListFromString(emails: string): string[] {
    return emails.replaceAll(" ", "").split(",")
}

function buildQueryToValidateEmails(emails: string[]): string {
    return '(' + emails.map(email => email + ",") + ')'
}

function removeRemainingUsers(current_members_field: string[], new_members_field: string[]) {
    const set1 = new Set(current_members_field);
    const set2 = new Set(new_members_field);
    let remainingUser = [...set1].filter(x => set2.has(x));

    let current_members = current_members_field.filter(item => !remainingUser.includes(item));
    let new_members = new_members_field.filter(item => !remainingUser.includes(item));

    return { current_members, new_members };
}