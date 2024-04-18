import { handleSignInRedirect } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const { supabase, session, user } = await event.parent();
	const id = event.params.id;
	if (id === 'me') {
		if (!session || !user) {
			return redirect(302, handleSignInRedirect(event));
		}
		return { userData: user };
	}

	const { data: userData } = await supabase.from('profiles').select('*').eq('id', id).single();

	if (!userData) {
		return error(404, 'User not found');
	}

	return {
		userData,
	};
};
