import { error, redirect } from '@sveltejs/kit';

export async function load({ parent }) {
	const { docs, locale } = await parent();

	if (docs.length === 0) {
		error(404, 'Not found');
	} else {
		redirect(307, '/academy/' + locale + '/' + docs[0].slug + '/' + docs[0].docs[0].slug + '/');
	}
}
