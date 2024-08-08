import { editUserProfileSchema } from "@/schemas/edit-user-profile";
import { BadgeType, NotificationType, SearchType, type EditUserData } from "@/types";
import { translate } from "@/utils/translation/translate-util.js";
import { error, fail, redirect } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms/server";
import { sendBatchNotifications } from "../../../notifications/notifications-api.js";
import { createUserBadgeById, removeUserBadgeById } from "../../../badges/badges-api.js";

export const load = async (event) => {
	const { session, user } = await event.parent();

	if (!session || !user) {
		return redirect(303, "/sign-in?redirectTo=/");
	}
	const locale = event.cookies.get('languagePreference') || 'EN';

	const { data: editUserData, error: editUserDataError } = await event.locals.supabase
																		.from('profiles')
																		.select('display_name, about_me, motivation, image, region,district,  phone_number, job, birth_date, show_link, completed_course, sponsorship_state')
																		.eq('id', user.id)
																		.single();
	if (editUserDataError) {
		const errorMessage = translate(locale, "error.userNotFound");
		setFlash({ type: 'error', message: errorMessage }, event.cookies);
		return error(500, errorMessage);
	}
	const { image, ...data } = editUserData;
	const image_url = image ? event.locals.supabase.storage.from('users-avatars').getPublicUrl(image).data.publicUrl : null;
	const is_profile_filled_before = data.about_me != '' && data.motivation != '' && data.region != '' && data.phone_number != '' && data.job != '' && data.birth_date != '';
	const completed_course_before = data.completed_course;
	const sponsorship_state_old = data.sponsorship_state;

	return {
		editUserData: { 
			...data, 
			image_url: image_url, 
			sponsorship_state_old,
			is_profile_filled_before, 
			completed_course_before 
		},
		sponsorship_state_old,
		completed_course_before, 
		is_profile_filled_before,
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

		const {image_url, image, sponsorship_state_old, is_profile_filled_before, completed_course_before, ...data } = form.data
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

			const { data: nearbyUsers } = await supabase.rpc("get_nearby_users", 
				{ 
					userid: user.id,
					groupid: null,
					search_type: SearchType.User,
					search_radius: 70000
				});
			const ids: string[] = nearbyUsers?.map((user) => (user.id)) ?? [];
			await sendBatchNotifications(ids, translate(locale, "notifications.userLookingForGroup"), NotificationType.UserLookingForGroup, user.id, null, supabase, user.id);
		}

		// if completed course - give badge
		if (!completed_course_before && form.data.completed_course) {
			await createUserBadgeById(user.id, BadgeType.Certified, supabase);
			await sendBatchNotifications([user.id], translate(locale, "notifications.newBadgeCertified"), NotificationType.NewBadgeCertified, null, null, supabase, user.id);
		} 
		else if (completed_course_before && !form.data.completed_course) {
			await removeUserBadgeById(user.id, BadgeType.Certified, supabase);
		}

		// if filled everything on profile - give badge
		if (!is_profile_filled_before && form.data.about_me != "" && form.data.motivation != '' && form.data.region != '' && form.data.phone_number != '' && form.data.job != '' && form.data.birth_date != '') {
			await createUserBadgeById(user.id, BadgeType.ProfileFilled, supabase);
			await sendBatchNotifications([user.id], translate(locale, "notifications.newBadgeProfileFilled"), NotificationType.NewBadgeProfileFilled, null, null, supabase, user.id);
		} 
		else if (is_profile_filled_before && (form.data.about_me == "" || form.data.motivation == '' || form.data.region == '' || form.data.phone_number == '' || form.data.job == '' || form.data.birth_date == '')) {
			await removeUserBadgeById(user.id, BadgeType.ProfileFilled, supabase);
		}

		setFlash({ type: 'success', message: translate(locale, "success.userProfileUpdated") }, cookies);
		return redirect(303, '/users/me/edit');									
	}
}