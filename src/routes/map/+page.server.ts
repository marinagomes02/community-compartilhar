import { mapGroupPinSchema, mapPinSchema, removeMapPinSchema } from '$lib/schemas/map-pin';
import { translate } from '@/utils/translation/translate-util.js';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { sendBatchNotifications } from '../notifications/notifications-api.js';
import { BadgeType, NotificationType } from '@/types.js';
import { createUserBadgeById, removeUserBadgeById } from '../badges/badges-api.js';

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
	
		const { has_pin, ...pin_data } = form.data;	
		const { error } = await supabase
			.from('map_pins')
			.upsert({ user_id: user.id, ...pin_data }, { onConflict: 'user_id'})

		if (error) {
			setFlash({ type: 'error', message: error.message }, cookies);
			return fail(500, { message: error.message, form });
		}

		const { error: update_location_error } = await supabase
			.rpc('update_pin_location', 
				{ pin_user_id: user.id, ...pin_data, pin_group_id: null }
			);

		if (update_location_error) {
			setFlash({ type: 'error', message: update_location_error.message }, cookies);
			return fail(500, { message: update_location_error.message, form });
		}
	
		if (!has_pin) {
			const { data: users_ids } = await supabase
				.from('profiles')
				.select('id')
				.neq('id', user.id);

			const ids: string[] = users_ids?.map((user) => (user.id)) ?? [];
			await sendBatchNotifications(ids, 'Novo utilizador na sua região', NotificationType.NewUserInRegion, user.id, null, supabase);
			await createUserBadgeById(user.id, BadgeType.MapPin, supabase);
			await sendBatchNotifications([user.id], translate(locale, "notifications.newBadgeMapPin"), NotificationType.NewBadgeMapPin, null, null, supabase);
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

		await removeUserBadgeById(user.id, BadgeType.MapPin, supabase);

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
		
		const { has_pin, ...pin_data } = form.data;	
		const { error } = await supabase
			.from('map_pins')
			.upsert({
				owner_type: 'group', 
				...pin_data
			}, { onConflict: 'group_id'});

		if (error) {
			setFlash({ type: 'error', message: error.message }, cookies);
			return fail(500, { message: error.message, form });
		}

		const {group_id, ...pin_data_without_group_id} = pin_data;
		const { error: update_location_error } = await supabase
			.rpc('update_pin_location', { 
				pin_user_id: null, 
				...pin_data_without_group_id, 
				pin_group_id: group_id,
				owner_type: 'group'
			});

		if (update_location_error) {
			setFlash({ type: 'error', message: update_location_error.message }, cookies);
			return fail(500, { message: update_location_error.message, form });
		}

		if (!has_pin) {
			const { data: users_ids } = await supabase
				.from('profiles')
				.select('id')
				.neq('id', user.id);

			const ids: string[] = users_ids?.map((user) => (user.id)) ?? [];
			await sendBatchNotifications(ids, 'Novo grupo na sua região', NotificationType.NewGroupInRegion, null, pin_data.group_id, supabase);
		}

		setFlash({ type: 'success', message: translate(locale, "success.editGroupPin") }, cookies);
		return { form };
	},
};
