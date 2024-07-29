import { loadFlash, setFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = loadFlash(async ({ cookies }) => {
	let languagePreference = 'EN';
	const cookieLanguagePreference = cookies.get('languagePreference')

	return {
		locale: cookieLanguagePreference ?? languagePreference,
	};
});