import { mapPinSchema } from '$lib/schemas/map-pin';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

export const actions = {
	default: async ({ request, cookies, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session) {
			setFlash({ type: 'error', message: 'Unauthorized' }, cookies);
			return fail(401, { message: 'Unauthorized' });
		}

		const form = await superValidate(request, zod(mapPinSchema));

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error } = await supabase.from('map_pins').upsert({
			id: session.user.id,
			...form.data,
		});

		if (error) {
			setFlash({ type: 'error', message: error.message }, cookies);
			return fail(500, { message: error.message, form });
		}

		setFlash({ type: 'success', message: 'Your pin has been updated.' }, cookies);
		return { form };
	},
};
