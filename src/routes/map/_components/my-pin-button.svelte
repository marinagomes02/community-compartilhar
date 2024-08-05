<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { MapPin } from '$lib/types';
	import { LocateFixed } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { key, type MBMapContext } from './mapbox';
	import { translate } from '@/utils/translation/translate-util';

	const { getMap } = getContext<MBMapContext>(key);

	export let pin: MapPin;
	export let locale: string;
</script>

<Button variant="outline"
	on:click={() => {
		const map = getMap();
		map?.flyTo({
			center: [pin.lng, pin.lat],
			zoom: 6,
		});
	}}
>
	<LocateFixed class="mr-2 h-4 w-4" />{translate(locale, "myPin")}
</Button>
