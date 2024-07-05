import { mapGroupPinSchema, mapPinSchema, removeMapPinSchema } from '$lib/schemas/map-pin';
import { translate } from '@/utils/translation/translate-util.js';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

export const actions = {
	map: async ({ request, cookies, locals: { supabase, safeGetSession } }) => {
		const { session, user } = await safeGetSession();
		const locale = cookies.get("languagePreference") || "EN";

		if (!session || !user) {
			const errorMessage = translate(locale, 'error.unauthorized');
			setFlash({ type: 'error', message: errorMessage }, cookies);
			return fail(401, { message: errorMessage });
		}

		const form = await superValidate(request, zod(mapPinSchema));

		if (!form.valid) {
			const errorMessage = translate(locale, 'error.invalidForm')
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

		setFlash({ type: 'success', message: translate(locale, "success.editPin") }, cookies);
		return { form };
	},
	remove_map_pin: async ({ request, cookies, locals: { supabase, safeGetSession } }) => {
		const { session, user } = await safeGetSession();
		const locale = cookies.get("languagePreference") || "EN";

		if (!session || !user) {
			const errorMessage = translate(locale, 'error.unauthorized');
			setFlash({ type: 'error', message: errorMessage }, cookies);
			return fail(401, { message: errorMessage });
		}
		const form = await superValidate(request, zod(removeMapPinSchema));

		if (!form.valid) {
			const errorMessage = translate(locale, 'error.invalidForm')
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

		setFlash({ type: 'success', message: translate(locale, "success.removePin") }, cookies);
		return { form };
	},
	add_group_pin: async ({ request, cookies, locals: { supabase, safeGetSession } }) => {
		const { session, user } = await safeGetSession();
		const locale = cookies.get("languagePreference") || "EN";

		if (!session || !user) {
			const errorMessage = translate(locale, 'error.unauthorized');
			setFlash({ type: 'error', message: errorMessage }, cookies);
			return fail(401, { message: errorMessage });
		}

		const form = await superValidate(request, zod(mapGroupPinSchema));

		if (!form.valid) {
			const errorMessage = translate(locale, "error.invalidForm")
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

		setFlash({ type: 'success', message: translate(locale, "success.editGroupPin") }, cookies);
		return { form };
	},
};
