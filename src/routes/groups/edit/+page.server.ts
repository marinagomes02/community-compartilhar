import { editGroupSchema } from "@/schemas/group.js";
import type { GroupData, EditGroupDataForm, GroupMemberData } from "@/types";
import { handleSignInRedirect } from "@/utils";
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
        .select('*, members: profiles!inner(id, email)')
        .single();

    if (groupDataError) {
        const errorMessage = 'User not found';
        setFlash({ type: 'error', message: "User not found" }, event.cookies);
        return redirect(303, '/groups');
    }
    let memberString = getMemberString(groupDataResult.members);
    const { members, ...groupData } = groupDataResult
    
    return {
        editGroupData: {
            members: memberString, 
            ...groupData, 
            current_members: memberString
        },
    };    
};

export const actions = {
    default: async (event) => {
        const { session } = await event.locals.safeGetSession();
        if (!session) {
            const errorMessage = 'Unauthorized.';
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            return error(401, errorMessage);
        }

        const form = await superValidate(event.request, zod(editGroupSchema));

        if (!form.valid) {
            const errorMessage = 'Invalid form.';
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
                setFlash({ type: 'error', message: 'Some emails are not registered' }, event.cookies);
                return fail(400, { message: 'Some emails are not registered', form });
            }

            if (!membersCleaned.includes(groupDataRequest.leader)) {
                setFlash({ type: 'error', message: 'Leader email is not in the members list' }, event.cookies);
                return fail(400, { message: 'Leader email is not in the members list', form });
            }
        }

        const { data: group, error: editGroupError } = await event.locals.supabase
            .from('groups')
            .upsert(groupDataRequest)
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

        setFlash({ type: 'success', message: 'Group was successfully updated' }, event.cookies);
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
    return emails.replace(" ", "").split(",")
}

function buildQueryToValidateEmails(emails: string): string {
    return '(' + emails.replace(" ", "") + ')'
}

function cleanMembersString(members: string): string {
    return members.replace(" ", "").replace(/, $/, "").replace(/,$/, "")
}