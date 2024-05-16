<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Card from '$lib/components/ui/card/card.svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { CalendarDays, ChevronRight, MapPin, UserRound, Users, LockKeyhole, Hammer, BadgeInfo, MessageCircleMore, Info } from 'lucide-svelte';
	import AddEditPinButton from './_components/add-edit-pin-button.svelte';
	import Map from './_components/map.svelte';
	import Marker from './_components/marker.svelte';
	import MyPinButton from './_components/my-pin-button.svelte';
	import Time from 'svelte-time/Time.svelte';

	export let data;

	function getAgeFromBirthDate(dateString: string): number {
		var today = new Date();
		var birthDate = new Date(dateString);
		var age = today.getFullYear() - birthDate.getFullYear();
		var m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	}

	function buildWhatsAppLink(phoneNumber: string): string {
		return 'https://wa.me/' + phoneNumber
	}
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
						<Card class="w-60">
							<div class="flex flex-col items-start gap-y-4 px-4 py-5">
								<Button variant="secondary" size="sm" href="/user/0" class="flex flex-row w-full justify-evenly h-12">
									<!-- svelte-ignore a11y-img-redundant-alt -->
									<img
										src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png"
										alt="user-profile-photo"
										class="h-10 w-10"
									/>
									<div class="flex flex-col items-center justify-evenly px-2 h-full">
										<p class="text-sm">{user.display_name}</p>
										<p class="flex flex-row items-center text-xs">
											<MapPin class="mr-2 w-3 h-3"/>
											{user.region}
										</p>
									</div>
								</Button>
								<div class="flex flex-col items-start px-3">
									{#if user.about_me}
										<p class="flex flex-row items-center">
											<Info class="mr-2 w-3 h-3"/>
											{user.about_me}
										</p>										
									{/if}
									{#if user.birth_date}
										<p class="flex flex-row items-center">
											<ChevronRight class="mr-2 w-3 h-3"/>
											{getAgeFromBirthDate(user.birth_date)} anos
										</p>										
									{/if}
									{#if user.job}
										<p class="flex flex-row items-center">
											<Hammer class="mr-2 w-3 h-3"/>
											{user.job}
										</p>										
									{/if}
									{#if user.phone_number}
										<p class="flex flex-row items-center">
											<MessageCircleMore class="mr-2 w-3 h-3"/>
											<a rel="external" href={buildWhatsAppLink(user.phone_number)} target="_blank" class="underline">
												{buildWhatsAppLink(user.phone_number)}
											</a>
										</p>										
									{/if}
									{#if user.sponsorship_state === 'looking_for_group'}
										<p class="flex flex-row items-center font-bold">
											<Users class="mr-2 w-3 h-3"/>
											À procura de grupo
										</p>
									{:else if user.sponsorship_state === 'has_group'}
										<p class="flex flex-row items-center">
											<Users class="mr-2 w-3 h-3"/>
											Pertence a um grupo
										</p>
									{:else if user.sponsorship_state ==='no_group'}
										<p class="flex flex-row items-center">
											<BadgeInfo class="mr-2 w-3 h-3"/>
											Não tem grupo
										</p>
									{/if}
								</div>
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
							<div class="flex flex-col items-stretch gap-y-2 px-5 py-3">
								<Button class="mt-2 mb-2" variant="secondary" size="sm" href="/user/0">
									<Users class="mr-2 h-4 w-4" />
									{group.name}
								</Button>
								<div class="flex flex-col itens-center px-2">
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
								</div>
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