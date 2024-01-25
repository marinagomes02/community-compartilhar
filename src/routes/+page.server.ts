import { fail } from '@sveltejs/kit';

export const actions = {
	signout: async ({ locals: { supabase } }) => {
		console.log('signout');
		const { error } = await supabase.auth.signOut();

		if (error) {
			return fail(500, { message: 'Server error. Try again later.', success: false });
		}

		return {
			message: 'Goodbye!',
			success: true,
		};
	},
};
