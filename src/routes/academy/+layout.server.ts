import { loadFlash, setFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = loadFlash(async ({ parent }) => {
	const parentData = await parent();
	let languagePreference = 'PT';

	console.log("parentData:", parentData.languagePreference);
	return {
		locale: parentData.languagePreference ?? languagePreference,
	};
});