<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { MapPin } from '$lib/types';
	import { LocateFixed } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { key, type MBMapContext } from './mapbox';

	const { getMap } = getContext<MBMapContext>(key);

	export let pin: MapPin;
</script>

<Button style="background-color:#2A9D8F"
	on:click={() => {
		const map = getMap();
		map?.flyTo({
			center: [pin.lng, pin.lat],
			zoom: 6,
		});
	}}
>
	<LocateFixed class="mr-2 h-4 w-4" />Meu pin
</Button>
