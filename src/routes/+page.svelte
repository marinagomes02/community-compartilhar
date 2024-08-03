<script lang="ts">
	import { translate } from "@/utils/translation/translate-util";
	import type { PageData } from "./$types";

	export let data : PageData

	let locale: string = data.languagePreference.language;
	$: locale = data.languagePreference.language;
</script>

<div class="container mx-auto mb-20 mt-32 flex flex-col items-center justify-center">
	<h1 class="mb-2 text-6xl font-medium title">{translate(locale, "compartilharCommunity")}</h1>
	{#if data.link}
		<p class="text-xl text-muted-foreground mt-5 w-fit subtitle">{translate(locale, "communityLink")}: 
			<a rel="external" href={data.link} target="_blank" class="underline">
				{data.link}
			</a>
		</p>
	{:else}
		<p class="text-xl text-muted-foreground">{translate(locale, "communityText")}</p>
	{/if}
</div>

<style>
	@media (max-width: 900px) {
		:global(.title) {
			font-size: xx-large;
			align-self: baseline;
		}
		:global(.subtitle) {
			font-size: medium;
			margin-top: 24px;
		}
	}
</style>
