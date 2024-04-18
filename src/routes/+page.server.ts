import { fail } from '@sveltejs/kit';

export const actions = {
	signout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			return fail(500, { message: 'Server error. Try again later.', success: false });
		}

		return;
	},
};
