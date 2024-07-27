import { editGroupSchema, searchUserSchema } from "@/schemas/group.js";
import { type GroupData, type EditGroupDataForm, type GroupMemberData, NotificationType, type UserListData, BadgeType, SearchType } from "@/types";
import { handleSignInRedirect } from "@/utils";
import { translate } from "@/utils/translation/translate-util";
import { redirect } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { sendBatchNotifications } from "../../notifications/notifications-api";
import { createUserBadgeById, removeUserBadgeByEmail, removeUserBadgeById } from "../../badges/badges-api";


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
            current_members: members_ids,
            leader_old: groupData.leader,
            is_current_sponsor: groupData.is_current_sponsor
        },
        is_authorized: is_authorized,
        completed_state_old: groupData.is_complete,
        leader_old: groupData.leader,
        is_current_sponsor_old: groupData.is_current_sponsor,
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

        const { members, current_members, completed_state_old, leader_old, is_current_sponsor_old, ...groupDataRequest } = form.data;

        // Update group
        const { error: updateGroupError } = await event.locals.supabase
            .from('groups')
            .update(groupDataRequest)
            .eq('id', groupDataRequest.id);
        
        if (updateGroupError) {
            setFlash({ type: 'error', message: updateGroupError.message }, event.cookies);
            return fail(500, { message: updateGroupError.message, form });
        }

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
                await createUserBadgeById(user_id, BadgeType.GroupMember, event.locals.supabase);
            }));
            await sendBatchNotifications(new_members, translate(locale, "notifications.newBadgeGroupMember"), NotificationType.NewBadgeGroupMember, null, null, event.locals.supabase, user.id)
        }

        // Remove old members from group
        if (old_members.length > 0) {
            await Promise.all(old_members.map(async (user_id) => {
                const { error: removeUsersGroupIdError } = await event.locals.supabase
                    .from('profiles')
                    .update({group_id: null})
                    .eq('id', user_id)
    
                if (removeUsersGroupIdError) {
                    setFlash({ type: 'error', message: removeUsersGroupIdError.message }, event.cookies);
                    return fail(500, { message: removeUsersGroupIdError.message, form });
                }
                await removeUserBadgeById(user_id, BadgeType.GroupMember, event.locals.supabase);
                await removeUserBadgeById(user_id, BadgeType.Sponsor, event.locals.supabase);
            }));
        }

        // if group is looking for members - send notifications
        if (completed_state_old !== groupDataRequest.is_complete && !groupDataRequest.is_complete) {
            const { data: nearbyUsers, error } = await event.locals.supabase.rpc("get_nearby_users", 
                { 
                    userid: null,
                    groupid: groupDataRequest.id,
                    search_type: SearchType.Group,
                    search_radius: 70000
                });
			const ids: string[] = nearbyUsers?.map((user) => (user.id)) ?? [];
			await sendBatchNotifications(ids, translate(locale, "notifications.groupLookingForMember"), NotificationType.GroupLookingForMember, null, groupDataRequest.id, event.locals.supabase, user.id)
        }

        // if leader changed - update badges
        if (groupDataRequest.leader !== leader_old) {
            // get leader id from email to check it exists
            const { data: leader, error: getLeaderError } = await event.locals.supabase
                .from("profiles")
                .select('id')
                .eq('email', groupDataRequest.leader)
                .single();
            
            if (getLeaderError) {
                setFlash({ type: 'error', message: "Leader's email not valid" }, event.cookies);
                return fail(500, { message: getLeaderError.message, form });
            }
            await removeUserBadgeByEmail(leader_old, BadgeType.GroupLeader, event.locals.supabase);
            await createUserBadgeById(leader.id, BadgeType.GroupLeader, event.locals.supabase);
            await sendBatchNotifications([leader.id], translate(locale, "notifications.newBadgeGroupLeader"), NotificationType.NewBadgeGroupLeader, null, null, event.locals.supabase, user.id);
        }  

        // if is_current_sponsor changed to true - give badge
        if (groupDataRequest.is_current_sponsor && !is_current_sponsor_old) {
            await Promise.all(members.map(async (user_id) =>
                await createUserBadgeById(user_id, BadgeType.Sponsor, event.locals.supabase)
            ));
            await sendBatchNotifications(members, translate(locale, "notifications.newBadgeSponsor"), NotificationType.NewBadgeSponsor, null, null, event.locals.supabase, user.id);

        } else if (!groupDataRequest.is_current_sponsor && is_current_sponsor_old) {
            await Promise.all(members.map(async (user_id) =>
                await removeUserBadgeById(user_id, BadgeType.Sponsor, event.locals.supabase)
            ));
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

        return users;
    }
};

function removeRemainingUsers(current_members_field: string[], new_members_field: string[]) {
    const set1 = new Set(current_members_field);
    const set2 = new Set(new_members_field);
    let remainingUser = [...set1].filter(x => set2.has(x));

    let current_members = current_members_field.filter(item => !remainingUser.includes(item));
    let new_members = new_members_field.filter(item => !remainingUser.includes(item));

    return { current_members, new_members };
}