<script lang="ts">
	import PageHeader from '$lib/components/page-header.svelte';

	export let data;
</script>

<PageHeader title={data.event.title} subtitle={data.event.description} />
<div class="container mx-auto pb-10"></div>
