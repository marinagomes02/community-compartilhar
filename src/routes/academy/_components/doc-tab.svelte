<script lang="ts">
	import { page } from '$app/stores';
	import type { Doc } from '$lib/types';
	import { cn } from '$lib/utils';

	export let groupSlug: string;
	export let doc: Doc;
	export let locale: string;
	$: path = `/academy/${locale}/${groupSlug}/${doc.slug}`;
	$: isSelected = path === $page.url.pathname;
</script>

<li>
	<a
		href={path}
		class={cn(
			'transition-colors hover:text-foreground/80',
			isSelected ? 'text-foreground font-semibold' : 'text-foreground/60',
			'text-sm'
		)}>{doc.title}</a
	>
</li>
