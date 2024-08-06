import { error, redirect } from '@sveltejs/kit';

export async function load({ parent }) {
	const { docs, locale, session, user } = await parent();

	if (!session || !user) {
		return redirect(303, "/sign-in?redirectTo=/academy");
	}

	if (docs.length === 0) {
		error(404, 'Not found');
	} else {
		redirect(307, '/academy/' + locale + '/' + docs[0].slug + '/' + docs[0].docs[0].slug + '/');
	}
}
