export const prerender = true;

import type { Doc, DocGroup } from '$lib/types';
import { json } from '@sveltejs/kit';

async function getDocs() {
	const groups: DocGroup[] = [];

	const paths = import.meta.glob('/src/docs/*/*/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Doc, 'slug'>;
			const doc = { ...metadata, slug } satisfies Doc;

			const groupSlug = path.split('/').at(-2);
			const groupTitle = groupSlug?.replace(/-/g, ' ');
			const locale = path.split('/').at(-3);
			if (groupSlug && groupTitle && locale) {
				const group = groups.find((group) => group.slug === groupSlug && group.locale === locale);
				if (group) {
					group.docs.push(doc);
				} else {
					groups.push({
						slug: groupSlug,
						title: groupTitle,
						docs: [doc],
						locale: locale
					});
				}
			}
		}
	}

	return groups;
}

export async function GET() {
	const docs = await getDocs();
	return json(docs);
}
