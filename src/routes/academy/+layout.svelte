<script lang="ts">
	import PageHeader from '$lib/components/page-header.svelte';
	import DocGroupTab from './_components/doc-group-tab.svelte';

	export let data;
</script>

<PageHeader title="Academy" subtitle="Learn how to use this community" />
<div class="container mx-auto mb-20 flex flex-row space-x-6">
	<div class="flex w-56 flex-col gap-y-4 border-r-2 border-gray-200">
		{#each data.docs as docGroup}
			<DocGroupTab locale={data.locale} {docGroup}></DocGroupTab>
		{/each}
	</div>
	<div class="flex-1"><slot /></div>
</div>
