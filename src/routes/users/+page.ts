import type { ProfileDataWithImage } from "@/types";

export const load = async({ parent }) => {
    const { supabase, session, user } = await parent();

    const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, display_name, image, region');

    let image_url
    let profileDataWithImage: ProfileDataWithImage
    let profilesDataWithImage: ProfileDataWithImage[] = []

    for (let profileData of profilesData) {
        image_url = profileData.image ? supabase.storage.from('users-avatars').getPublicUrl(profileData.image).data.publicUrl : null;
        profileDataWithImage = {...profileData, image_url: image_url}
        profilesDataWithImage.push(profileDataWithImage)
    }

    return {
        profiles: profilesDataWithImage,
    };
};