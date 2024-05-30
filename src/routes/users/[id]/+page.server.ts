import type { ProfileDataWithImage } from "@/types";
import { error } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";

export const load = async(event) => {   
    const { supabase, session, user } = await event.parent();
	
	async function getProfileData(id: string): Promise<ProfileDataWithImage> {
		const { data: profileData, error: profileDatatError } = await event.locals.supabase
																			.from('profiles')
																			.select('*')
																			.eq('id', id)
																			.single();
		if (profileDatatError) {
			const errorMessage = 'User not found';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		const { image, ...data } = profileData;
		const image_url = image ? event.locals.supabase.storage.from('users-avatars').getPublicUrl(image).data.publicUrl : null;
		return { ...data, image_url: image_url };
	}

	return {
		profileData: await getProfileData(event.params.id),
	};
}