import { loadFlash, setFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = loadFlash(async ({ cookies }) => {
	let languagePreference = 'PT';
	const cookieLanguagePreference = cookies.get('languagePreference')
	console.log(cookies)

	return {
		locale: cookieLanguagePreference ?? languagePreference,
	};
});