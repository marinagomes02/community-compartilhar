<script lang="ts">
	import * as Select from '@/components/ui/select';
	import AddEditPinButton from './_components/add-edit-pin-button.svelte';
	import Map from './_components/map.svelte';
	import Marker from './_components/marker.svelte';
	import MyPinButton from './_components/my-pin-button.svelte';
	import type { PageData } from './$types';
	import PinPopupProfile from './_components/pin-popup-profile.svelte';
	import { Input } from '@/components/ui/input';
	import AddEditGroupPinButton from './_components/add-edit-group-pin-button.svelte';
	import PinPopupGroup from './_components/pin-popup-group.svelte';
	import type { Selected } from 'bits-ui';

	export let data: PageData;

	let searchTerm = '';
	let selectedSponsorshipState: Selected<unknown> = { value: 'all', label: 'Todos' };

	$: filteredSponsorshipState = selectedSponsorshipState.value === 'all' 
								? data.users 
								: data.users.filter(user => user.sponsorship_state === selectedSponsorshipState.value);

	$: filteredUsers = searchTerm === '' 
					? filteredSponsorshipState
					: filteredSponsorshipState.filter(user => user.display_name.toLowerCase().includes(searchTerm.toLowerCase()));

	$: filteredGroups = searchTerm === '' 
					? data.groups
					: data.groups.filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()));

</script>

<div class="relative h-screen">
	<Map>
		{#each filteredUsers as user (user.id)}
			{#if user?.pin}
				<Marker lng={user.pin.lng} lat={user.pin.lat}>
					<div class="h-10 w-10 overflow-hidden rounded-full border-2 border-foreground bg-foreground">
						{#if user.image_url}
							<img
								src={user.image_url}
								alt="user-profile"
								class="aspect-square h-full w-full"
							/>
						{:else}
							<img
								src="/avatars/user.png"
								alt="user"
								class="aspect-square h-full w-full"
							/>
						{/if}
					</div>
					<div slot="popup">
						<PinPopupProfile user={user} />	
					</div>
				</Marker>
			{/if}
		{/each}
		{#each filteredGroups as group (group.id)}
			{#if group?.pin}
				<Marker lng={group.pin.lng} lat={group.pin.lat}>
					<div
						class="h-10 w-10 overflow-hidden rounded-full border-2 border-foreground bg-foreground group-pin"
					>
						<img src="/avatars/group.png" alt="group" class="aspect-square h-full w-full" />
					</div>
					<div slot="popup">
						<PinPopupGroup group={group} />
					</div>
				</Marker>
			{/if}
		{/each}
		<div class="absolute left-0 right-0 top-10 flex flex-col items-center gap-y-4">
			<div class="flex flex-row gap-x-2">
				<Input bind:value={searchTerm} placeholder="Procurar por nome..." class="w-52 bg-background"></Input>
				<div class="w-44">
					<Select.Root
						selected={selectedSponsorshipState}
						onSelectedChange={(v) => {
							if (v) {
								selectedSponsorshipState = v;
							}
						}}
					>
						<Select.Trigger>
							<Select.Value class="align-start" placeholder="Procurar por estado..." />
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="all">Todos</Select.Item>
							<Select.Item value="no_group">Sem grupo de patrocínio</Select.Item>
							<Select.Item value="looking_for_group">À procura de grupo</Select.Item>
							<Select.Item value="has_group">Pertence a um grupo</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				{#if data.user?.pin}
					<MyPinButton pin={data.user.pin} />
				{/if}
				<AddEditPinButton 
					data={data.userPinForm} 
					removeMapPinForm={data.removeMapPinForm} 
				/>
				{#if data.group}
					<AddEditGroupPinButton 
						data={data.groupPinForm} 
						removeMapGroupPinForm={data.removeGroupMapPinForm} 
					/>
				{/if}
			</div>
		</div>
	</Map>
</div>

<style>
	:global(.group-pin) {
		background-color: lightgray;
	}
</style>