<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card/card.svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { CircleDot, CircleUser, Dot, Users } from 'lucide-svelte';
	import AddEditPinButton from './_components/add-edit-pin-button.svelte';
	import Map from './_components/map.svelte';
	import Marker from './_components/marker.svelte';
	import MyPinButton from './_components/my-pin-button.svelte';

	export let data;
</script>

<div class="relative h-screen">
	<Map>
		{#each data.users as user (user.id)}
			{#if user?.pin}
				<Marker lng={user.pin.lng} lat={user.pin.lat}>
					<div
						class="h-10 w-10 overflow-hidden rounded-full border-2 border-foreground bg-foreground"
					>
						<img src="/avatars/user.png" alt="user" class="aspect-square h-full w-full" />
					</div>
					<div slot="popup">
						<Card class="w-52">
							<div class="aspect-video"></div>
							<div class="flex flex-col items-start gap-y-2 px-4 py-3">
								<Button variant="secondary" size="sm" href="/user/0">
									<CircleUser class="mr-2 h-4 w-4" />
									{user.display_name}
								</Button>
								<p>This is just a description</p>
							</div>
						</Card>
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
							<div class="flex flex-col items-stretch gap-y-2 px-5 py-6">
								<Button variant="secondary" size="sm" href="/user/0">
									<Users class="mr-2 h-4 w-4" />
									{group.name}
								</Button>
								<p class="flex flex-row items-center">
									<Dot class="h-4 w-4"/>
									{group.members_count[0].count} participantes
								</p>
								<p class="flex flex-row items-center">
									<Dot class="h-4 w-4"/>
									Localidade: {group.localization}
								</p>
								<p class="flex flex-row items-center">
									<Dot class="h-4 w-4"/>
									{#if group.isCurrentSponsor}
										Família de refugiados atríbuida
									{:else}
										Família de refugiados não atribuída
									{/if}
								</p>
							</div>
						</Card>
					</div>
				</Marker>
			{/if}
		{/each}
		<div class="absolute left-0 right-0 top-10 flex flex-col items-center gap-y-4">
			<div class="flex flex-row gap-x-6">
				<Input placeholder="Search..." class="w-64 bg-background"></Input>
				<Select.Root>
					<Select.Trigger class="w-52 bg-background">
						<Select.Value placeholder="Filter by type" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="People">Pessoas</Select.Item>
						<Select.Item value="Groups">Grupos patrocínio</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-row gap-x-6">
				{#if data.user?.pin}
					<MyPinButton pin={data.user.pin} />
				{/if}
				<AddEditPinButton data={data.form} />
			</div>
		</div>
	</Map>
</div>

<style>
	:global(.group-pin) {
		background-color: lightgray;
	}
</style>