import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { handleSignInRedirect } from '$lib/utils';
import { registerUsersSchema } from '@/schemas/admin-users';

export const load = async (event) => {
    const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}

	return {
		registerForm: await superValidate(zod(registerUsersSchema), {
			id: 'users-register',
		}),
	};
};

export const actions = {
    default: async (event) => {
		console.log("está nas actions!!!!!!!!!!!");
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}

		const form = await superValidate(event.request, zod(registerUsersSchema), { id: 'user-register' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

        // read file to list
        // for each in list 
            // generate code 
            // insert in future users

		const { error: supabaseError } = await event.locals.supabase.from('future_users').insert(form.data);

		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		return redirect(303, '/how-to');
	},
}