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
	import { translate } from '@/utils/translation/translate-util';

	export let data: PageData;

	let locale: string = data.languagePreference.language;
    $: locale = data.languagePreference.language;
	
	let searchTerm = '';
	let selectedSponsorshipState: Selected<unknown>;
	$: selectedSponsorshipState  = { value: 'all', label: translate(locale, "sponsorshipState.all") };

	$: filteredSponsorshipState = selectedSponsorshipState.value === 'all' 
								? data.users 
								: data.users.filter(user => user.sponsorship_state === selectedSponsorshipState.value);

	$: filteredUsers = searchTerm === '' 
					? filteredSponsorshipState
					: filteredSponsorshipState.filter(user => user.display_name.toLowerCase().includes(searchTerm.toLowerCase()));

	$: filteredGroups = searchTerm === '' 
					? data.groups
					: data.groups.filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()));

	function computeMarkerBorderColor(state: string): string {
		switch (state) {
			case 'no_group':
				return 'border-gray-500';
			case 'looking_for_group':
				return 'border-cien-600';
			case 'has_group':
				return 'border-samon-600';
			default:
				return 'border-black';
		}
	}

</script>

<div class="relative h-screen">
	<Map>
		{#each filteredUsers as user (user.id)}
			{#if user?.pin}
				<Marker lng={user.pin.lng} lat={user.pin.lat}>
					<div class="h-10 w-10 overflow-hidden rounded-full border-2 bg-foreground {computeMarkerBorderColor(user.sponsorship_state)}">
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
						<PinPopupProfile {user} {locale} />	
					</div>
				</Marker>
			{/if}
		{/each}
		{#if selectedSponsorshipState.value === 'all' }
			{#each filteredGroups as group (group.id)}
				{#if group?.pin}
					<Marker lng={group.pin.lng} lat={group.pin.lat}>
						<div class="h-10 w-10 p-1 overflow-hidden rounded-full border-2 border-gray-400 bg-gray-300">
							<img src="/avatars/group.png" alt="group" class="aspect-square h-full w-full" />
						</div>
						<div slot="popup">
							<PinPopupGroup {group} {locale} />
						</div>
					</Marker>
				{/if}
			{/each}
		{/if}
		<div class="absolute left-0 right-0 top-10 flex flex-col items-center gap-y-4">
			<div class="flex flex-row gap-x-2">
				<Input bind:value={searchTerm} placeholder={translate(locale, "search.name")} class="w-52 bg-background"></Input>
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
							<Select.Value class="align-start" placeholder={translate(locale, "search.state")} />
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="all">{translate(locale, "sponsorshipState.all")}</Select.Item>
							<Select.Item value="no_group">{translate(locale, "sponsorshipState.noGroup")}</Select.Item>
							<Select.Item value="looking_for_group">{translate(locale, "sponsorshipState.lookingForGroup")}</Select.Item>
							<Select.Item value="has_group">{translate(locale, "sponsorshipState.hasGroup")}</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				{#if data.user?.pin}
					<MyPinButton pin={data.user.pin} {locale} />
				{/if}
				<AddEditPinButton 
					data={data.userPinForm} 
					removeMapPinForm={data.removeUserMapPinForm} 
					{locale}
				/>
				{#if data.group}
					<AddEditGroupPinButton 
						data={data.groupPinForm} 
						removeMapPinForm={data.removeGroupMapPinForm} 
						{locale}
					/>
				{/if}
			</div>
		</div>
	</Map>
</div>