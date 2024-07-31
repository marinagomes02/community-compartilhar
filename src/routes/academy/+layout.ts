import type { DocGroup } from '$lib/types';

export async function load({ fetch, parent }) {
	const parentData = await parent();
	let languagePreference = 'PT';
	const locale = parentData.languagePreference.language ?? languagePreference;

	console.log("parentData:", parentData);

	const response = await fetch('/api/academy/docs');
	const docs: DocGroup[] = await response.json();
	const docsByLocale = docs.filter((doc) => doc.locale === locale);
	
	console.log("locale on academy/layout.ts", locale);
	return { 
		docs: docsByLocale, 
		locale
	};
}
