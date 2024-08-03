import type { DocGroup } from '$lib/types';

export async function load({ fetch, parent }) {
	const parentData = await parent();
	let languagePreference = 'PT';
	const locale = parentData.languagePreference.language ?? languagePreference;

	const response = await fetch('/api/academy/docs');
	const docs: DocGroup[] = await response.json();
	const docsByLocale = docs.filter((doc) => doc.locale === locale);
	
	return { 
		docs: docsByLocale, 
		locale
	};
}
