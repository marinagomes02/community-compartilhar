<script lang="ts">
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { setContext } from 'svelte';
	import { key, mapboxgl, type MBMapContext } from './mapbox';

	let map: mapboxgl.Map | undefined;

	setContext<MBMapContext>(key, {
		getMap: () => map,
	});

	function initialize(node: HTMLElement) {
		map = new mapboxgl.Map({
			container: node,
			style: 'mapbox://styles/mapbox/light-v11',
			center: [-9.469218750000001, 39.56827914916011],
			zoom: 6.1,
			minZoom: 5.5,
			maxZoom: 11,
		});
		map.dragRotate.disable();
		map.touchZoomRotate.disableRotation();
		map.addControl(new mapboxgl.NavigationControl());

		return {
			destroy() {
				map?.remove();
				map = undefined;
			},
		};
	}
</script>

<div class="h-full w-full" use:initialize>
	{#if map}
		<slot />
	{/if}
</div>
