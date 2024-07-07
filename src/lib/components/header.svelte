<script lang="ts">
	import MainNav from '$lib/components/nav/main-nav.svelte';
	import MobileNav from '$lib/components/nav/mobile-nav.svelte';
	import UserNav from '$lib/components/nav/user-nav.svelte';
	import type { User, UserNotification } from '$lib/types';
	import LocaleToggle from '../../routes/language/language-toggle.svelte';
	import { Button } from './ui/button';
	import { translate } from '../utils/translation/translate-util';
	import Notifications from '../../routes/notifications/notifications.svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { MarkAsReadSchema } from '@/schemas/notifications';

	export let user: User | undefined;
	export let user_image_url: string | null;
	export let user_group_search_request_id: string | null;
	export let languagePreference: any;
	export let markAsReadForm: SuperValidated<Infer<MarkAsReadSchema>>;

</script>

<header
	class="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container flex h-14 items-center">
		<MainNav locale={languagePreference.language} />
		<MobileNav />
		<div class="flex flex-1 items-center justify-between space-x-4 sm:space-x-6 md:justify-end">
			<!--<ModeToggle />-->
			{#if user}
				<LocaleToggle {languagePreference} />
				<Notifications locale={languagePreference.language} {markAsReadForm} />
				<UserNav 
					{user} 
					{user_image_url} 
					{user_group_search_request_id}
					locale={languagePreference.language}  />
			{:else}
				<Button variant="outline" size="sm" href="/sign-in">{translate(languagePreference.language, 'signIn')}</Button>
				<Button size="sm" href="/sign-up">{translate(languagePreference.language, 'signUp')}</Button>
			{/if}
		</div>
	</div>
</header>

<style>
	header{
		background-color: #FFC84E;
	}
</style>
