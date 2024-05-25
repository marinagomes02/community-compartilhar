import { editUserProfileSchema } from "@/schemas/edit-user-profile";
import type { EditUserData } from "@/types";
import { error, fail, redirect } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms/server";

export const load = async (event) => {
	const { supabase, session, user } = await event.parent();
	const id = event.params.id;
	/*if (id === 'me') {
		if (!session || !user) {
			return redirect(302, handleSignInRedirect(event));
		}
		return { userData: user };
	}*/
	async function getEditUserData(): Promise<EditUserData> {
		const { data: editUserData, error: editUserDataError } = await event.locals.supabase
																			.from('profiles')
																			.select('display_name, about_me, motivation, image, region, phone_number, job, birth_date, show_link, completed_course, sponsorship_state')
																			.eq('id', user.id)
																			.single();
		if (editUserDataError) {
			const errorMessage = 'User not found';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		const { image, ...data } = editUserData;
		const image_url = image ? event.locals.supabase.storage.from('users-avatars').getPublicUrl(image).data.publicUrl : null;
		return { ...data, image_url: image_url };
	}

	return {
		editUserData: await getEditUserData(),
	};
};

export const actions = {
	default: async ({ request, cookies, locals: { supabase, safeGetSession } }) => {
		const { session, user } = await safeGetSession();

		if (!session) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, cookies);
			return error(401, errorMessage);
		}

        const form = await superValidate(request, zod(editUserProfileSchema), { id: 'edit-profile' });

        if (!form.valid) {
			const errorMessage = 'Invalid form.';
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

		const {image_url, image, ...data } = form.data
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

		setFlash({ type: 'success', message: 'User profile successfully updated' }, cookies);
		return redirect(303, '/users/me/edit');									
	}
}