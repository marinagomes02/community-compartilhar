<script lang="ts">
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import { Card } from '$lib/components/ui/card';
	import type { HowTo } from '$lib/types';

	export let howTo: HowTo;
</script>

<a href="/how-to/{howTo.id}">
	<Card class="overflow-hidden">
		<AspectRatio ratio={4 / 3}>
			<img
				src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png"
				class="h-full w-full object-cover"
			/>
		</AspectRatio>
		<div class=" flex flex-col px-4 py-2">
			<div class="mb-5">
				<h2 class="text-lg font-medium">{howTo.title}</h2>
				<p>more</p>
			</div>
			<div class="flex gap-x-1">
				{#each howTo.tags as tag}
					<span>#{tag}</span>
				{/each}
			</div>
		</div>
	</Card>
</a>
