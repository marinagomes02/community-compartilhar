<script lang="ts">
	import PageHeader from '$lib/components/page-header.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { translate } from '@/utils/translation/translate-util';
	import EventsModeration from './_components/events-moderation.svelte';
	import GeneralModeration from './_components/general-moderation.svelte';
	import GroupsModeration from './_components/groups-moderation.svelte';
	import HowToModeration from './_components/how-to-moderation.svelte';
	import MapModeration from './_components/map-moderation.svelte';
	import UsersModeration from './_components/users-moderation.svelte';

	export let data;

	let locale: string;
    $: locale = data.languagePreference.language;
</script>

<PageHeader title="Admin" subtitle="Moderate user content" />
<div class="container mx-auto mb-20">
	<Tabs.Root value="users">
		<Tabs.List>
			<!--<Tabs.Trigger value="how-to">How To</Tabs.Trigger>
			<Tabs.Trigger value="events">Events</Tabs.Trigger>
			<Tabs.Trigger value="map">Map</Tabs.Trigger> -->
			<Tabs.Trigger value="users">{translate(locale, "users")}</Tabs.Trigger>
			<Tabs.Trigger value="general">{translate(locale, "general")}</Tabs.Trigger>
			<Tabs.Trigger value="groups-register">{translate(locale, "groupsModeration.title")}</Tabs.Trigger>				
		</Tabs.List>
		<Tabs.Content value="how-to">
			<HowToModeration />
		</Tabs.Content>
		<Tabs.Content value="events">
			<EventsModeration />
		</Tabs.Content>
		<Tabs.Content value="map">
			<MapModeration />
		</Tabs.Content>
		<Tabs.Content value="users">
			<UsersModeration data={data} />
		</Tabs.Content>
		<Tabs.Content value="general">
			<GeneralModeration data={data.communityLink} {locale} />
		</Tabs.Content>
		<Tabs.Content value="groups-register">
			<GroupsModeration 
				acceptForm={data.acceptGroupRequestForm}
				rejectForm={data.rejectGroupRequestForm}
				groupsData={data.groupRequests}
				{locale}/>
		</Tabs.Content>
	</Tabs.Root>
</div>
