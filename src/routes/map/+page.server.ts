import { mapGroupPinSchema, mapPinSchema, removeMapPinSchema } from '$lib/schemas/map-pin';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

export const actions = {
	map: async ({ request, cookies, locals: { supabase, safeGetSession } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			setFlash({ type: 'error', message: 'Unauthorized' }, cookies);
			return fail(401, { message: 'Unauthorized' });
		}

		const form = await superValidate(request, zod(mapPinSchema));

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, cookies);
			return fail(400, { message: errorMessage, form });
		}
		
		const { error } = await supabase
			.from('map_pins')
			.upsert({ user_id: user.id, ...form.data}, 
					{ onConflict: 'user_id'});

		if (error) {
			setFlash({ type: 'error', message: error.message }, cookies);
			return fail(500, { message: error.message, form });
		}

		setFlash({ type: 'success', message: 'Your pin has been updated.' }, cookies);
		return { form };
	},
	remove_map_pin: async ({ request, cookies, locals: { supabase, safeGetSession } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			setFlash({ type: 'error', message: 'Unauthorized' }, cookies);
			return fail(401, { message: 'Unauthorized' });
		}

		const form = await superValidate(request, zod(removeMapPinSchema));

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error } = await supabase
							.from('map_pins')
							.delete()
							.eq('user_id', user.id);
							//.or('user_id.eq.{$form.data.owner_id},group_id.eq.{$form.data.owner_id}');

		if (error) {
			setFlash({ type: 'error', message: error.message }, cookies);
			return fail(500, { message: error.message, form });
		}

		setFlash({ type: 'success', message: 'Your pin has been removed.' }, cookies);
		return { form };
	},
	add_group_pin: async ({ request, cookies, locals: { supabase, safeGetSession } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			setFlash({ type: 'error', message: 'Unauthorized' }, cookies);
			return fail(401, { message: 'Unauthorized' });
		}

		const form = await superValidate(request, zod(mapGroupPinSchema));

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, cookies);
			return fail(400, { message: errorMessage, form });
		}
		
		const { error } = await supabase
			.from('map_pins')
			.upsert({ owner_type: 'group', ...form.data}, 
					{ onConflict: 'group_id'});

		if (error) {
			setFlash({ type: 'error', message: error.message }, cookies);
			return fail(500, { message: error.message, form });
		}

		setFlash({ type: 'success', message: 'Your group pin has been updated.' }, cookies);
		return { form };
	},
};
