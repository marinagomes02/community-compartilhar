import { handleSignInRedirect } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}

	async function getCommunityLink(): Promise<string[]> {
		const { data, error: linkError } = await event.locals.supabase
													.from("application")
													.select("link:community_link")
													.single();
		if (linkError) {
			const errorMessage = 'Error fetching community link, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}
		return data.link;
	}

	return {
		link: await getCommunityLink()
	};
}

export const actions = {
	signout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			return fail(500, { message: 'Server error. Try again later.', success: false });
		}

		return;
	},
};
