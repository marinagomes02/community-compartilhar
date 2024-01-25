<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { LocateFixed } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { key, type MBMapContext } from './mapbox';

	const { getMap } = getContext<MBMapContext>(key);
</script>

<Button
	on:click={() => {
		console.log('hey');
		const map = getMap();
		map?.flyTo({
			center: [-9.469218750000001, 39.56827914916011],
			zoom: 6,
		});
	}}><LocateFixed class="mr-2 h-4 w-4" />My pin</Button
>
