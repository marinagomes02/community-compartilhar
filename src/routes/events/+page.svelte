<script lang="ts">
	import PageHeader from '$lib/components/page-header.svelte';
	import type { Event } from '$lib/types';
	import EventItem from './_components/event-item.svelte';

	const events: Event[] = [
		{
			id: '1',
			title: 'How to make a cup of tea',
			description: 'A simple guide to making a cup of tea',
			image: '/images/how-to/1/1.jpg',
			date: '2021-10-10',
		},
		{
			id: '1',
			title: 'How to make a cup of tea',
			description: 'A simple guide to making a cup of tea',
			image: '/images/how-to/1/1.jpg',
			date: '2021-10-10',
		},
		{
			id: '1',
			title: 'How to make a cup of tea',
			description: 'A simple guide to making a cup of tea',
			image: '/images/how-to/1/1.jpg',
			date: '2021-10-10',
		},
	];
</script>

<PageHeader title="Events" subtitle="Find & share events" />

<div class="container flex flex-col gap-y-5">
	{#each events as event}
		<EventItem {event}></EventItem>
	{/each}
</div>
