<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { mapGroupPinSchema, mapPinSchema, removeMapGroupPinSchema, removeMapPinSchema, type MapGroupPinSchema, type RemoveMapGroupPinSchema } from '$lib/schemas/map-pin';
	import { Check, MapPin, XCircle } from 'lucide-svelte';
	import { getContext, onDestroy } from 'svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { key, mapboxgl, type MBMapContext } from './mapbox';

	const { getMap } = getContext<MBMapContext>(key);

	export let data: SuperValidated<Infer<MapGroupPinSchema>>;
	export let removeMapGroupPinForm: SuperValidated<Infer<RemoveMapGroupPinSchema>>;

	const form = superForm(data, {
		validators: zodClient(mapGroupPinSchema),
		dataType: 'json',
		resetForm: true
	});
	const { form: formData, enhance } = form;

	const { form: removePinForm, enhance:removePinEnhance } = superForm(removeMapGroupPinForm, {
		validators: zodClient(removeMapGroupPinSchema),
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
			Drag the pin to the group's location
		</div>
		<div
			class="mb-8 h-10 w-10 overflow-hidden rounded-full border-2 border-foreground bg-foreground"
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
		<div class="flex flex-row gap-x-2">
			<Button on:click={cancelPin} style="background-color:#2A9D8F">
				<XCircle class="mr-2 h-4 w-4" />
				Cancelar
			</Button>
			<Button type="submit" style="background-color:#2A9D8F">
				<Check class="mr-2 h-4 w-4" />
				Confirmar
			</Button>
		</div>
	</form>
	<form method="POST" use:removePinEnhance action="?/remove_group_pin" on:submit={removePin}>
		<input type="hidden" name="group_id" bind:value={$removePinForm.group_id} />
		<Button type="submit" variant="destructive" >
			<XCircle class="mr-2 h-4 w-4" />
			Remover pin de grupo
		</Button>
	</form>
{:else}
	<Button on:click={initializePin} style="background-color:#2A9D8F">
		<MapPin class="mr-2 h-4 w-4" />
		Editar pin de grupo
	</Button>
{/if}

