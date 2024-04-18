import type { DocGroup } from '$lib/types';

export async function load({ fetch }) {
	const response = await fetch('/api/academy/docs');
	const docs: DocGroup[] = await response.json();
	return { docs };
}
