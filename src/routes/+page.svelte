<script lang="ts">
	import type { PageData } from "./$types";

	export let data : PageData
</script>

<div class="container mx-auto mb-20 mt-40 flex flex-col items-center justify-center">
	<h1 class="mb-2 text-6xl font-medium">Comunidade ComPartilhar</h1>
	{#if data.link}
		<p class="text-xl text-muted-foreground mt-5 w-fit">Link para comunidade no WhatsApp: 
			<a rel="external" href={data.link} target="_blank" class="underline">
				{data.link}
			</a>
		</p>
	{:else}
		<p class="text-xl text-muted-foreground">Uma comunidade para impulsionar o patrocínio comunitário</p>
	{/if}
</div>
