import type { GroupData } from "@/types";
import { handleSignInRedirect } from "@/utils";
import { redirect } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";

export const load = async (event) => {
    const { session, user } = await event.locals.safeGetSession();
	
	if (!session || !user) {
		return redirect(302, handleSignInRedirect(event));
	}

    const { data: userData, error: userDataError } = await event.locals.supabase
        .from('profiles')
        .select('group_id')
        .eq('id', user.id)
        .single();

    if (userDataError) {
        const errorMessage = 'User not found';
        setFlash({ type: 'error', message: errorMessage }, event.cookies);
        return error(500, errorMessage);
    }

    const { data: groupData, error: groupDataError } = await event.locals.supabase
        .from("groups")
        .select('*')
        .eq('id', userData.group_id)
        .single();

    if (groupDataError) {
        const errorMessage = 'User not found';
        setFlash({ type: 'error', message: errorMessage }, event.cookies);
        return error(500, errorMessage);
    }

    const { data: membersData, error: membersDataError } = await event.locals.supabase
        .from('profiles')
        .select('email')
        .eq('group_id', userData.group_id);
    
    if (membersDataError) {
        const errorMessage = 'User not found';
        setFlash({ type: 'error', message: errorMessage }, event.cookies);
        return error(500, errorMessage);
    }

    let editGroupData: GroupData = {members: getMemberString(membersData), ...groupData};

    return {
        editGroupData: editGroupData
    };    
};

function getMemberString(membersData: any[]) {
    let members: string[] = [];
    membersData.forEach(member => {
        members.push(member.email);
    });
    return members.join(', ');
}