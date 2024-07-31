import { loadFlash, setFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({parent}) => {
	const parentData = await parent();
	let languagePreference = 'PT';

	console.log("parentData.languagePreference:", parentData.languagePreference);
	return {
		locale: parentData.languagePreference ?? languagePreference,
	};
};