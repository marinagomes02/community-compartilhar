import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/supabase';
import type { User, UserNotification } from '$lib/types';
import { createBrowserClient, isBrowser, parse } from '@supabase/ssr';
import { fetchNotifications } from './notifications/notifications-api.js';
import { markAsReadSchema } from '@/schemas/notifications.js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: {
			fetch,
		},
		cookies: {
			get(key) {
				if (!isBrowser()) {
					return JSON.stringify(data.session);
				}

				const cookie = parse(document.cookie);
				return cookie[key];
			},
		},
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	let user: User | undefined;
	let user_image_url: string | null = null;
	let user_group_search_request_id: string | null = null;

	if (session) {
		const { data: userData } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', session.user.id)
			.single();
			
		if (userData) {
			user = userData;
			user_image_url = userData.image ? await supabase.storage
				.from('users-avatars')
				.getPublicUrl(userData.image)
				.data.publicUrl
			: null

			const { data: userGroupSearchRequestData } = await supabase
				.from('group_search_requests')
				.select('id')
				.eq('user_id', session.user.id)
				.single();
			user_group_search_request_id = userGroupSearchRequestData?.id ?? null;

			await fetchNotifications(session.user.id, supabase);
		}
	}

	return { 
		supabase, 
		session, 
		user, 
		user_image_url, 
		user_group_search_request_id,
		languagePreference: {language: data.languagePreference},
		markAsReadForm: await superValidate(zod(markAsReadSchema)),
	};
};
