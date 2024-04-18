<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import type { Event } from '$lib/types';

	export let event: Event;
</script>

<a href="/events/{event.id}">
	<Card class="flex flex-row items-center gap-x-4 px-4 py-4">
		<p class="px-8 text-center text-2xl font-bold">
			18
			<br />
			Oct
		</p>
		<div>
			<h2 class="pb-1 text-lg font-medium">{event.title}</h2>
			<p>by João Nogueira</p>
		</div>
	</Card>
</a>
