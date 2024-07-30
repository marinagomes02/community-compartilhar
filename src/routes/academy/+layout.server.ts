import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async ({ parent }) => {
	const parentData = await parent();
	console.log("locale on academy/+layout.server.ts:", parentData.languagePreference)
	return {
		locale: parentData.languagePreference,
	};
};