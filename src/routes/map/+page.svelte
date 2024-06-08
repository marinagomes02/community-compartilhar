<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card/card.svelte';
	import { ChevronRight, MapPin, Users, LockKeyhole, Hammer, BadgeInfo, MessageCircleMore, Info } from 'lucide-svelte';
	import AddEditPinButton from './_components/add-edit-pin-button.svelte';
	import Map from './_components/map.svelte';
	import Marker from './_components/marker.svelte';
	import MyPinButton from './_components/my-pin-button.svelte';
	import type { PageData } from './$types';
	import PinPopupProfile from './_components/pin-popup-profile.svelte';
	import { Input } from '@/components/ui/input';
	import AddEditGroupPinButton from './_components/add-edit-group-pin-button.svelte';

	export let data: PageData;

	let searchTerm = '';
	$: filteredUsers = searchTerm === '' ? data.users: data.users.filter(user => user.display_name.toLowerCase().includes(searchTerm.toLowerCase()));
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
		{#each data.groups as group (group.id)}
			{#if group?.pin}
				<Marker lng={group.pin.lng} lat={group.pin.lat}>
					<div
						class="h-10 w-10 overflow-hidden rounded-full border-2 border-foreground bg-foreground group-pin"
					>
						<img src="/avatars/group.png" alt="group" class="aspect-square h-full w-full" />
					</div>
					<div slot="popup">
						<Card class="w-52">
							<div class="flex flex-col items-stretch gap-y-2 px-5 py-3">
								<Button class="mt-2" variant="secondary" size="sm" href="/user/0">
									<Users class="mr-2 h-4 w-4" />
									{group.name}
								</Button>
								<!--<div class="flex flex-col itens-center px-2">
									<p class="flex flex-row items-center">
										<UserRound class="mr-2 w-3 h-3"/>
										{group.members_count[0].count} participantes
									</p>
									<p class="flex flex-row items-center">
										<MapPin class="mr-2 w-3 h-3"/>
										{group.localization}
									</p>
									<p class="flex flex-row items-center">
										<CalendarDays class="mr-2 w-3 h-3"/>
										Criado a <Time timestamp={group.created_at} format=": DD/MM/YYYY"/>
									</p>
								</div>-->
								{#if group.isComplete}
									<div class="flex flex-row items-center self-center font-medium text-sm mt-2 mb-1">
										<LockKeyhole class="mr-2 w-4 h-4"/>
										<p class="font-medium">Completo</p>
									</div>
								{:else}
									<Button variant="link_underlined" size="sm" href="/user/0">
										Aceita novos membros
									</Button>
								{/if}
							</div>
						</Card>
					</div>
				</Marker>
			{/if}
		{/each}
		<div class="absolute left-0 right-0 top-10 flex flex-col items-center gap-y-4">
			<div class="flex flex-row gap-x-2">
				<Input bind:value={searchTerm} placeholder="Procurar por nome..." class="w-64 bg-background"></Input>
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