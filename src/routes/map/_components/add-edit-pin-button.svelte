<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { mapPinSchema, removeMapPinSchema, type MapPinSchema, type RemoveMapPinSchema } from '$lib/schemas/map-pin';
	import { Check, MapPin, XCircle } from 'lucide-svelte';
	import { getContext, onDestroy } from 'svelte';
	import { fieldProxy, superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { key, mapboxgl, type MBMapContext } from './mapbox';
	import { translate } from '@/utils/translation/translate-util';

	const { getMap } = getContext<MBMapContext>(key);

	export let data: SuperValidated<Infer<MapPinSchema>>;
	export let removeMapPinForm: SuperValidated<Infer<RemoveMapPinSchema>>;
	export let locale: string;

	const form = superForm(data, {
		validators: zodClient(mapPinSchema),
		dataType: 'json',
		resetForm: true
	});
	const { form: formData, enhance } = form;

	const { form: removePinForm, enhance:removePinEnhance } = superForm(removeMapPinForm, {
		validators: zodClient(removeMapPinSchema),
		dataType: 'json',
		resetForm: true
	}) 

	$: lng = data.data.lng;
	$: lat = data.data.lat;

	let markerElement: HTMLElement;
	let marker: mapboxgl.Marker | undefined;

	function onDragEnd() {
		if (marker) {
			const lngLat = marker.getLngLat();
			$formData.lng = lngLat.lng;
			$formData.lat = lngLat.lat;
			$formData.owner_type = 'user';
		}
	}

	function initializePin() {
		const map = getMap();
		if (map) {
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
			{translate(locale, "addEditPinButton.text")}
		</div>
		<div
			class="mb-8 h-10 w-10 overflow-hidden rounded-full border-2 border-foreground bg-foreground"
		>
			<img src="/avatars/user.png" alt="user" class="aspect-square h-full w-full" />
		</div>
	{/if}
</div>

{#if marker}
	<form method="POST" use:enhance action="?/map" on:submit={confirmPin}>
		<input type="hidden" name="lng" bind:value={$formData.lng} />
		<input type="hidden" name="lat" bind:value={$formData.lat} />
		<input type="hidden" name="owner_type" bind:value={$formData.owner_type} />
		<input type="hidden" name="has_pin" bind:value={$formData.has_pin} />
		<div class="flex flex-row gap-x-2">
			<Button on:click={cancelPin} style="background-color:#2A9D8F">
				<XCircle class="mr-2 h-4 w-4" />
				{translate(locale, "cancel")}
			</Button>
			<Button type="submit" style="background-color:#2A9D8F">
				<Check class="mr-2 h-4 w-4" />
				{translate(locale, "confirm")}
			</Button>
		</div>
	</form>
	<form method="POST" use:removePinEnhance action="?/remove_map_pin" on:submit={removePin}>
		<input type="hidden" name="owner_type" bind:value={$removePinForm.owner_type} />
		<input type="hidden" name="owner_id" bind:value={$removePinForm.owner_id} />
		<Button type="submit" variant="destructive" >
			<XCircle class="mr-2 h-4 w-4" />
			{translate(locale, "addEditPinButton.removePin")}
		</Button>
	</form>
{:else}
	<Button on:click={initializePin} variant="outline">
		<MapPin class="mr-2 h-4 w-4" />
		{#if $formData.has_pin}
			{translate(locale, "addEditPinButton.editPin")}
		{:else}
			{translate(locale, "addEditPinButton.addPin")}
		{/if}
	</Button>
{/if}

