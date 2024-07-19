import type { ProfileDataWithImage } from "@/types";
import { translate } from "@/utils/translation/translate-util";
import { error } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { getUserBadgesById } from "../../badges/badges-api.js";

export const load = async(event) => {   
    const { session, user } = await event.parent();
	const locale = event.cookies.get('languagePreference') || 'EN';
	
	async function getProfileData(id: string): Promise<ProfileDataWithImage> {
		const { data: profileData, error: profileDatatError } = await event.locals.supabase
																			.from('profiles')
																			.select('*')
																			.eq('id', id)
																			.single();
		if (profileDatatError) {
			const errorMessage = translate(locale, 'error.userNotFound');
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		let user_badges = await getUserBadgesById(event.params.id, event.locals.supabase);

		const { image, ...data } = profileData;
		const image_url = image ? event.locals.supabase.storage.from('users-avatars').getPublicUrl(image).data.publicUrl : null;
		return { ...data, image_url: image_url, user_badges };
	}

	return {
		profileData: await getProfileData(event.params.id),
	};
}