<script lang="ts">
	import PageHeader from '$lib/components/page-header.svelte';
	import { translate } from '@/utils/translation/translate-util';
	import DocGroupTab from './_components/doc-group-tab.svelte';

	export let data;

	let locale: string;
	$: locale = data.languagePreference.language;
</script>

<PageHeader title={translate(locale, "tutorials")} subtitle={translate(locale, "tutorials.title")} />
<div class="container mx-auto mb-20 flex flex-row space-x-8">
	<div class="flex w-56 flex-col gap-y-4 border-r-2 border-gray-200">
		{#each data.docs as docGroup}
			<DocGroupTab locale={data.locale} {docGroup}></DocGroupTab>
		{/each}
	</div>
	<div class="flex-1 max-w-4xl"><slot /></div>
</div>
