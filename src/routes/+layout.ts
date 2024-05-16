import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/supabase';
import type { User } from '$lib/types';
import { createBrowserClient, isBrowser, parse } from '@supabase/ssr';

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

	if (session) {
		const { data: userData } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', session.user.id)
			.single();
			let image_url = null
			
		if (userData) {
			user = userData;
			user_image_url = userData.image ? await supabase.storage
				.from('users-avatars')
				.getPublicUrl(userData.image)
				.data.publicUrl
			: null
		}
	}

	return { supabase, session, user, user_image_url };
};
