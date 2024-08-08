import type { NearbyUser, ProfilePreviewDataWithImage } from "@/types";
import { redirect } from "@sveltejs/kit";

export const load = async({ parent }) => {
    const { supabase, session, user } = await parent();

	if (!session || !user) {
		return redirect(303, "/sign-in?redirectTo=/users");
	}

    const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, display_name, image, region, district, sponsorship_state')
        .order('display_name')
        .limit(100);

    const { data: nearbyUsersLookingForGroup } = await supabase.rpc("get_nearby_users_looking_for_group", 
            { userid: user.id, search_radius: 70000}
        )

    let user_image_url;
    let profileDataWithImage: ProfilePreviewDataWithImage
    let profilesDataWithImage: ProfilePreviewDataWithImage[] = []
    let image_url, userDataWithImage;
    let nearbyUsersWithImage: NearbyUser[] = []

    for (let profileData of profilesData) {
        user_image_url = profileData.image ? supabase.storage.from('users-avatars').getPublicUrl(profileData.image).data.publicUrl : null;
        profileDataWithImage = {...profileData, image_url: user_image_url}
        profilesDataWithImage.push(profileDataWithImage)
    }

    for (let nearbyUser of nearbyUsersLookingForGroup) {
        image_url = profilesDataWithImage.filter((el) => el.id === nearbyUser.id)[0].image_url ?? null;
        userDataWithImage = {...nearbyUser, image_url: image_url}
        nearbyUsersWithImage.push(userDataWithImage)
    };

    return {
        profiles: profilesDataWithImage,
        nearby_users: nearbyUsersWithImage
    };
};