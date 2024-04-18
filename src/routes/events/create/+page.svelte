<script lang="ts">
	import PageHeader from '$lib/components/page-header.svelte';
	import EventForm from '../_components/event-form.svelte';

	export let data;
</script>

<PageHeader title="How to" subtitle="Create a new how to and share it with the community" />
<div class="container mx-auto mb-20">
	<EventForm data={data.createForm} />
</div>
