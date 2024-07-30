import { loadFlash, setFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = loadFlash(async ({ locals: { safeGetSession }, cookies }) => {
	const { session, user } = await safeGetSession();

	let languagePreference = 'PT';
	const cookieLanguagePreference = cookies.get('languagePreference')
	console.log("cookieLanguagePreference:", cookieLanguagePreference)
	
	if (!cookieLanguagePreference) {
		cookies.set('languagePreference', languagePreference, { path: '/' })
	} else {
		languagePreference = cookieLanguagePreference;
	}

	return {
		session,
		user,
		languagePreference,
	};
});