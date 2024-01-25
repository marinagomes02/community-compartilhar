import { signInSchema } from '$lib/schemas/sign-in';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async () => {
	return {
		form: await superValidate(signInSchema),
	};
};

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, signInSchema);

		if (!form.valid) {
			return fail(400, { message: 'Invalid form.', success: false, form });
		}

		const { error } = await supabase.auth.signInWithPassword({
			email: form.data.email,
			password: form.data.password,
		});

		if (error) {
			return fail(500, { message: error.message, success: false, form });
		}

		return redirect(302, '/');
	},
};
