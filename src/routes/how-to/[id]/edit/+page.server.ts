import { createHowToSchema } from '@/schemas/how-to';
import { handleSignInRedirect } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const session = await event.locals.getSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}

	async function getHowTo(id: string) {
		const { data: howTo, error: howToError } = await event.locals.supabase
			.from('howtos')
			.select('*')
			.eq('id', id)
			.single();

		if (howToError) {
			const errorMessage = 'Error fetching how to, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}
		return howTo;
	}

	const howTo = await getHowTo(event.params.id);

	return {
		updateForm: await superValidate(howTo, zod(createHowToSchema), {
			id: 'update',
		}),
	};
};

export const actions = {
	default: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}

		const form = await superValidate(event.request, zod(createHowToSchema), { id: 'update' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('howtos')
			.update(form.data)
			.eq('id', event.params.id);

		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		return redirect(303, `/how-to/${event.params.id}`);
	},
};
