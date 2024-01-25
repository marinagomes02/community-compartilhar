import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const path = `../../../../docs/${params.groupSlug}/${params.slug}.md`;
		const post = await import(path);

		return {
			content: post.default,
			meta: post.metadata,
		};
	} catch (e) {
		throw error(404, `Could not find ${params.slug}`);
	}
}
