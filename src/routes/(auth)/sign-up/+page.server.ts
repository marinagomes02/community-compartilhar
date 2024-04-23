import { signUpSchema } from '$lib/schemas/sign-up';
import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (session) {
		return redirect(303, '/');
	}

	return {
		form: await superValidate(zod(signUpSchema)),
	};
};

export const actions = {
	default: async ({ request, cookies, url, locals: { supabase } }) => {
		const form = await superValidate(request, zod(signUpSchema));

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { data: codeInfo } = await supabase.from('profiles')
											.select('validationCode, hasUsedValidationCode')
											.eq('email', form.data.email).single();
		//const codeInfo1 = {validationCode: "12345677", hasUsedValidationCode: false}

		if (!codeInfo || codeInfo.validationCode !== form.data.validationCode || codeInfo.hasUsedValidationCode) {
			setFlash({ type: 'error', message: "User not pre-registered or code invalid" }, cookies);
			return fail(401, { message: "User not pre-registered or code invalid", form });
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
			setFlash({ type: 'error', message: error.message }, cookies);
			return fail(500, { message: error.message, form });
		}

		setFlash(
			{ type: 'success', message: 'Please check your email for a confirmation link.' },
			cookies
		);
		return { form };
	},
};
