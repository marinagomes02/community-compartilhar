<script lang="ts">
	import { dev } from '$app/environment';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Footer from '$lib/components/footer.svelte';
	import Header from '$lib/components/header.svelte';
	import TailwindIndicator from '$lib/components/tailwind-indicator.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';
	import '../app.css';
	import { setLanguagePreferenceSchema } from '@/schemas/language';


	export let data;

	$: ({ supabase, session, user, user_image_url, user_group_search_request_id, languagePreference } = data);

	const flash = getFlash(page);
	$: if ($flash) {
		if ($flash.type === 'error') {
			toast.error($flash.message);
		} else {
			toast.success($flash.message);
		}
		// Clear the flash message to avoid double-toasting.
		$flash = undefined;
	}

	onMount(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<ModeWatcher />
<Toaster />

<div class="relative flex min-h-screen flex-col">
	<Header 
		{user} 
		{user_image_url} 
		{user_group_search_request_id} 
		{languagePreference}
	/>
	<div class="flex-1 gray-background">
		<slot />
	</div>
	<Footer />
	{#if dev}
		<TailwindIndicator />
	{/if}
</div>

<style>
    .gray-background {
        background-color: rgb(249, 250, 251);
    }
</style>