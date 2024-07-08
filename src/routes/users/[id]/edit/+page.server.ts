import { editUserProfileSchema } from "@/schemas/edit-user-profile";
import { NotificationType, type EditUserData } from "@/types";
import { translate } from "@/utils/translation/translate-util.js";
import { error, fail, redirect } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms/server";
import { sendBatchNotifications } from "../../../notifications/notifications-api.js";

export const load = async (event) => {
	const { supabase, session, user } = await event.parent();
	const id = event.params.id;
	const locale = event.cookies.get('languagePreference') || 'EN';

	const { data: editUserData, error: editUserDataError } = await event.locals.supabase
																		.from('profiles')
																		.select('display_name, about_me, motivation, image, region, phone_number, job, birth_date, show_link, completed_course, sponsorship_state')
																		.eq('id', user.id)
																		.single();
	if (editUserDataError) {
		const errorMessage = translate(locale, "error.userNotFound");
		setFlash({ type: 'error', message: errorMessage }, event.cookies);
		return error(500, errorMessage);
	}
	const { image, ...data } = editUserData;
	const image_url = image ? event.locals.supabase.storage.from('users-avatars').getPublicUrl(image).data.publicUrl : null;


	return {
		editUserData: { ...data, image_url: image_url, sponsorship_state_old: data.sponsorship_state },
		sponsorship_state_old: data.sponsorship_state
	};
};

export const actions = {
	default: async ({ request, cookies, locals: { supabase, safeGetSession } }) => {
		const { session, user } = await safeGetSession();
		const locale = cookies.get("languagePreference") || "EN";

		if (!session || !user) {
			const errorMessage = translate(locale, 'error.unauthorized');
			setFlash({ type: 'error', message: errorMessage }, cookies);
			return error(401, errorMessage);
		}

        const form = await superValidate(request, zod(editUserProfileSchema), { id: 'edit-profile' });

        if (!form.valid) {
			const errorMessage = translate(locale, 'error.invalidForm');
			setFlash({ type: 'error', message: errorMessage }, cookies);
			return fail(400, { message: errorMessage, form });
		}

		let imagePath = '';
		if (form.data.image) {
			const imageFile = form.data.image;
			const fileExt = imageFile.name.split('.').pop();
			const filePath = `${Math.random()}.${fileExt}`;

			const { data: imageFileData, error: imageFileError } = await supabase.storage
																	.from('users-avatars')
																	.upload(filePath, imageFile)

			if (imageFileError) {
				setFlash({ type: 'error', message: imageFileError.message }, cookies);
				return fail(500, { message: imageFileError.message, form });
			}

			imagePath = imageFileData.path;
		} else if (form.data.image_url) {
			imagePath = form.data.image_url.split('/').pop() ?? '';
		}

		const {image_url, image, sponsorship_state_old, ...data } = form.data
		const { error: supabaseError } = await supabase
											.from('profiles')
											.upsert({ 
												id: user.id,
												email: user.email,
												image: imagePath,
												...data});
		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		// Send notifications if user is looking for group
		if (form.data.sponsorship_state !== sponsorship_state_old 
			&& form.data.sponsorship_state === 'looking_for_group') {

			const { data: users_ids } = await supabase
				.from('profiles')
				.select('id')
				.neq('id', user.id);

			const ids: string[] = users_ids?.map((user) => (user.id)) ?? [];
			await sendBatchNotifications(ids, 'Novo user à procura de grupo', NotificationType.UserLookingForGroup, user.id, null, supabase)
		}

		setFlash({ type: 'success', message: translate(locale, "success.userProfileUpdated") }, cookies);
		return redirect(303, '/users/me/edit');									
	}
}