import type { DocGroup } from '$lib/types';

export async function load({ fetch, data }) {
	const response = await fetch('/api/academy/docs');
	const docs: DocGroup[] = await response.json();
	const docsByLocale = docs.filter((doc) => doc.locale === data.locale);
	console.log("locale on academy/layout.ts", data.locale);
	return { docs: docsByLocale, locale: data.locale };
}
