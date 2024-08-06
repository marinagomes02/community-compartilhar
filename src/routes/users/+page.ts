import type { ProfilePreviewDataWithImage } from "@/types";
import { redirect } from "@sveltejs/kit";

export const load = async({ parent }) => {
    const { supabase, session, user } = await parent();

	if (!session || !user) {
		return redirect(303, "/sign-in?redirectTo=/users");
	}

    const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, display_name, image, region, sponsorship_state')
        .order('display_name');

    let image_url
    let profileDataWithImage: ProfilePreviewDataWithImage
    let profilesDataWithImage: ProfilePreviewDataWithImage[] = []

    for (let profileData of profilesData) {
        image_url = profileData.image ? supabase.storage.from('users-avatars').getPublicUrl(profileData.image).data.publicUrl : null;
        profileDataWithImage = {...profileData, image_url: image_url}
        profilesDataWithImage.push(profileDataWithImage)
    }

    return {
        profiles: profilesDataWithImage,
    };
};