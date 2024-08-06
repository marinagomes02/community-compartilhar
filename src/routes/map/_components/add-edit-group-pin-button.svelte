<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { mapGroupPinSchema, type MapGroupPinSchema, type RemoveMapPinSchema, removeMapPinSchema } from '$lib/schemas/map-pin';
	import { Check, MapPin, XCircle } from 'lucide-svelte';
	import { getContext, onDestroy } from 'svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { key, mapboxgl, type MBMapContext } from './mapbox';
	import { translate } from '@/utils/translation/translate-util';

	const { getMap } = getContext<MBMapContext>(key);

	export let data: SuperValidated<Infer<MapGroupPinSchema>>;
	export let removeMapPinForm: SuperValidated<Infer<RemoveMapPinSchema>>;
	export let locale: string;
	export let isEditing: boolean = false;

	const form = superForm(data, {
		validators: zodClient(mapGroupPinSchema),
		dataType: 'json',
		resetForm: true
	});
	const { form: formData, enhance } = form;

	const { form: removePinForm, enhance:removePinEnhance } = superForm(removeMapPinForm, {
		validators: zodClient(removeMapPinSchema),
		dataType: 'json',
		resetForm: true
	}) 
	let lngLat = {lng: data.data.lng, lat: data.data.lat};

	$: $formData.lat = lngLat.lat;
	$: $formData.lng = lngLat.lng;
	$: isEditing = marker ? true : false;

	let markerElement: HTMLElement;
	let marker: mapboxgl.Marker | undefined;

	function onDragEnd() {
		if (marker) {
			lngLat = marker.getLngLat();
			$formData.lng = lngLat.lng;
			$formData.lat = lngLat.lat;
			$formData.has_pin = marker ? true : false;
		}
	}

	function initializePin() {
		const map = getMap();
		if (map) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					let lngLat = 
						data.data.lat != 0 && data.data.lat != 0 
						? data.data 
						: {lng: longitude, lat: latitude};
					console.log(lngLat);
					marker = new mapboxgl.Marker(markerElement, {
						draggable: true,
					})
						.setLngLat(lngLat)
						.addTo(map);
					marker.on('dragend', onDragEnd);
					map?.flyTo({
						center: lngLat,
						zoom: 12,
					});
				},
				(error) => {
					let lngLat = data.data ?? map.getCenter();
					marker = new mapboxgl.Marker(markerElement, {
						draggable: true,
					})
						.setLngLat(lngLat)
						.addTo(map);
					marker.on('dragend', onDragEnd);
					map?.flyTo({
						center: lngLat,
						zoom: 6,
					});
				}
			);
		}
	}

	function confirmPin() {
		marker?.remove();
		marker = undefined;
	}

	function cancelPin() {
		marker?.remove();
		marker = undefined;
	}

	function removePin() {
		marker?.remove();
		marker = undefined;
	}

	onDestroy(() => {
		marker?.remove();
		marker = undefined;
	});
</script>

<div bind:this={markerElement} class="flex flex-col items-center">
	{#if marker}
		<div class="mb-2 rounded-sm bg-primary px-2 py-1 text-primary-foreground">
			{translate(locale, "addEditGroupPinButton.text")}
		</div>
		<div
			class="mb-8 p-1 h-10 w-10 overflow-hidden rounded-full border-2 border-gray-600 bg-gray-300"
		>
			<img src="/avatars/group.png" alt="group" class="aspect-square h-full w-full" />
		</div>
	{/if}
</div>

{#if marker}
	<form method="POST" use:enhance action="?/add_group_pin" on:submit={confirmPin}>
		<input type="hidden" name="lng" bind:value={$formData.lng} />
		<input type="hidden" name="lat" bind:value={$formData.lat} />
		<input type="hidden" name="group_id" bind:value={$formData.group_id} />
		<input type="hidden" name="has_pin" bind:value={$formData.has_pin} />
		<div class="flex flex-row gap-x-2">
			<Button on:click={cancelPin} style="background-color:#2A9D8F">
				<XCircle class="mr-2 h-4 w-4" />
				{translate(locale,"cancel")}
			</Button>
			<Button type="submit" style="background-color:#2A9D8F">
				<Check class="mr-2 h-4 w-4" />
				{translate(locale, "confirm")}
			</Button>
		</div>
	</form>
	<form method="POST" use:removePinEnhance action="?/remove_map_pin" on:submit={removePin}>
		<input type="hidden" name="owner_type" bind:value={$removePinForm.owner_id} />
		<input type="hidden" name="own" bind:value={$removePinForm.owner_type} />
		<Button type="submit" variant="destructive" >
			<XCircle class="mr-2 h-4 w-4" />
			{translate(locale, "addEditGroupPinButton.removePin")}
		</Button>
	</form>
{:else}
	<Button on:click={initializePin} variant="outline">
		<MapPin class="mr-2 h-4 w-4" />
		{#if $formData.has_pin}
			{translate(locale, "addEditGroupPinButton.editPin")}
		{:else}
			{translate(locale, "addEditGroupPinButton.addPin")}
		{/if}
	</Button>
{/if}

