import type { AvailableGroupData, NearbyUser } from "@/types.js";
import { handleSignInRedirect } from "@/utils";
import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
    const { session, user } = await event.locals.safeGetSession();
	
	if (!session || !user) {
		return redirect(302, handleSignInRedirect(event));
	}

    const { data: userGroupData } = await event.locals.supabase
                                .from("groups")
                                .select('id, name, region, members: profiles!inner(id), tmp_members: profiles!inner(id)')
                                .in('tmp_members.id', [user.id])
                                .maybeSingle()
                                
    const { data: groupsData } = await event.locals.supabase
                                .from('groups')
                                .select('id, name, region, leader, members: profiles!inner(id)')
                                .eq('is_complete', false)
                                .eq('is_authorized', true)
    
    let available_groups: AvailableGroupData[] = groupsData ?? []


    return {
        user_group: userGroupData ?? null,
        available_groups
    }
}