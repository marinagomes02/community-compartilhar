import type { NearbyUser } from "@/types.js";
import { handleSignInRedirect } from "@/utils";
import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
    const { session, user } = await event.locals.safeGetSession();
	
	if (!session || !user) {
		return redirect(302, handleSignInRedirect(event));
	}

    const { data: userData } = await event.locals.supabase
                                .from("profiles")
                                .select('group_id')
                                .eq('id', user.id)
                                .single()

    const { data: nearbyUsersLookingForGroup } = await event.locals.supabase
        .rpc("get_nearby_users_looking_for_group", 
            { userid: user.id, search_radius: 70000}
        )
    
    let nearbyUsersWithImage: NearbyUser[] = []
    let image_url, userDataWithImage;
    
    for (let nearbyUser of nearbyUsersLookingForGroup) {
        image_url = nearbyUser.image ? event.locals.supabase.storage
            .from('users-avatars')
            .getPublicUrl(nearbyUser.image).data.publicUrl 
            : null;
        userDataWithImage = {...nearbyUser, image_url: image_url}
        nearbyUsersWithImage.push(userDataWithImage)
    };

    return {
        group_id: userData?.group_id ?? null,
        near_by_users: nearbyUsersWithImage ?? []
    }
}