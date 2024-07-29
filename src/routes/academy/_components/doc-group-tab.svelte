<script lang="ts">
	import { page } from '$app/stores';
	import type { DocGroup } from '$lib/types';
	import DocTab from './doc-tab.svelte';

	export let docGroup: DocGroup;

	$: path = $page.url.pathname;
  	$: isSelected = new RegExp(`^/academy/${docGroup.slug}/`).test(path);

	function getIconForDocGroup(group: string): string {
		return "/academy/" + group + ".png";
	}
</script>

<div>
	<div class="mb-1 flex flex-row space-x-2 items-center px-2 py-1 border-radius {isSelected ? 'bg-gray-200' : ''}">
		<img src={getIconForDocGroup(docGroup.slug)} alt="icon-group" class="h-5 w-5 mt-1"/> 
		<h2 class="text-xl font-medium">{docGroup.title}</h2>
	</div>
	<ul class="flex flex-col gap-y-1 ml-9">
		{#each docGroup.docs as doc}
			<DocTab groupSlug={docGroup.slug} {doc}></DocTab>
		{/each}
	</ul>
</div>

<style>
	:global(.border-radius) {
		border-radius: 4%;
	}
</style>
