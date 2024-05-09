<script lang="ts">
	import type { PageData } from "./$types";

	export let data : PageData
</script>

<div class="container mx-auto mb-20 mt-40 flex flex-col items-center justify-center">
	<div class="h-48 w-48 rounded-full bg-foreground"></div>
	<h1 class="mb-2 text-9xl font-medium">community</h1>
	{#if data.link}
		<p class="text-xl text-muted-foreground mt-5">Link for WhatsApp community: 
			<a rel="external" href={data.link} target="_blank" class="underline">
				{data.link}
			</a>
		</p>
	{:else}
		<p class="text-xl text-muted-foreground">One of us, one of us...</p>
	{/if}
</div>
