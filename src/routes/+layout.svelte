<script lang="ts">
	import { dev } from '$app/environment';
	import { invalidate } from '$app/navigation';
	import Footer from '$lib/components/footer.svelte';
	import Header from '$lib/components/header.svelte';
	import TailwindIndicator from '$lib/components/tailwind-indicator.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import '../app.css';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);
	$: user = session?.user;

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
	<Header {user} />
	<div class="flex-1">
		<slot />
	</div>
	<Footer />
	{#if dev}
		<TailwindIndicator />
	{/if}
</div>
