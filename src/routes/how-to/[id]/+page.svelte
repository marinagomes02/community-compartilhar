<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import type { HowTo } from '$lib/types';

	export let howTo: HowTo = {
		id: '1',
		title: 'How to make a cup of tea',
		description: 'A simple guide to making a cup of tea',
		image: '/images/how-to/1/1.jpg',
		tags: ['tea', 'hot', 'drink'],
		difficulty: 'easy',
		duration: 300,
		steps: [
			{
				title: 'Boil the kettle',
				description: 'Fill the kettle with water and boil it',
				image: '/images/how-to/1/1.jpg',
			},
			{
				title: 'Put the teabag in the cup',
				description: 'Put the teabag in the cup',
				image: '/images/how-to/1/2.jpg',
			},
			{
				title: 'Pour the water into the cup',
				description: 'Pour the water into the cup',
				image: '/images/how-to/1/3.jpg',
			},
			{
				title: 'Stir the tea',
				description: 'Stir the tea',
				image: '/images/how-to/1/4.jpg',
			},
			{
				title: 'Add milk',
				description: 'Add milk',
				image: '/images/how-to/1/5.jpg',
			},
			{
				title: 'Enjoy your tea',
				description: 'Enjoy your tea',
				image: '/images/how-to/1/6.jpg',
			},
		],
	};
</script>

<div class="container mx-auto mb-20 mt-10">
	<Card class="h-96 w-full">
		<h1>
			{howTo.title}
		</h1>
		<p>
			{howTo.description}
		</p>
		<div>
			<div>steps</div>
			<div>duration</div>
			<div>difficulty</div>
		</div>
		<div>
			{#each howTo.tags as tag}
				<span>#{tag}</span>
			{/each}
		</div>
	</Card>
</div>
<div class="flex flex-col gap-y-10">
	{#each howTo.steps as step, i}
		<div class="container mx-auto flex flex-row gap-x-6">
			<Card class="flex h-fit w-32 items-center justify-center py-4">
				<span class="text-2xl font-medium">{i + 1}</span>
			</Card>
			<Card class="grid w-full grid-cols-2">
				<div class="px-6 py-5">
					<h2 class="mb-2 text-2xl font-medium">{step.title}</h2>
					<p>{step.description}</p>
				</div>
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png"
				/>
			</Card>
		</div>
	{/each}
</div>
