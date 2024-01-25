import { signUpSchema } from '$lib/schemas/sign-up';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async () => {
	return {
		form: await superValidate(signUpSchema),
	};
};

export const actions = {
	default: async ({ request, url, locals: { supabase } }) => {
		const form = await superValidate(request, signUpSchema);

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error } = await supabase.auth.signUp({
			email: form.data.email,
			password: form.data.password,
			options: {
				data: {
					display_name: form.data.displayName,
				},
				emailRedirectTo: `${url.origin}/auth/callback`,
			},
		});

		if (error) {
			return fail(500, { message: error.message, success: false, form });
		}

		return {
			success: true,
			form,
		};
	},
};
