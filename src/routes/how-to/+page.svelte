<script lang="ts">
	import PageHeader from '$lib/components/page-header.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import type { HowTo } from '$lib/types';
	import { PlusCircle } from 'lucide-svelte';
	import HowToItem from './_components/how-to-item.svelte';

	const howTos: HowTo[] = [
		{
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
		},
		{
			id: '2',
			title: 'How to make a cup of coffee',
			description: 'A simple guide to making a cup of coffee',
			image: '/images/how-to/2/1.jpg',
			tags: ['coffee', 'hot', 'drink'],
			difficulty: 'easy',
			duration: 300,
			steps: [
				{
					title: 'Boil the kettle',
					description: 'Fill the kettle with water and boil it',
					image: '/images/how-to/2/1.jpg',
				},
				{
					title: 'Put the coffee in the cup',
					description: 'Put the coffee in the cup',
					image: '/images/how-to/2/2.jpg',
				},
				{
					title: 'Pour the water into the cup',
					description: 'Pour the water into the cup',
					image: '/images/how-to/2/3.jpg',
				},
				{
					title: 'Stir the coffee',
					description: 'Stir the coffee',
					image: '/images/how-to/2/4.jpg',
				},
				{
					title: 'Add milk',
					description: 'Add milk',
					image: '/images/how-to/2/5.jpg',
				},
				{
					title: 'Enjoy your coffee',
					description: 'Enjoy your coffee',
					image: '/images/how-to/2/6.jpg',
				},
			],
		},
	];
</script>

<PageHeader title="How to" subtitle="Learn & share how to solve your problems" />
<div class="container mx-auto flex flex-row justify-between">
	<div class="flex flex-row gap-x-4">
		<Select.Root>
			<Select.Trigger class="w-52">
				<Select.Value placeholder="Filter by tag" />
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="lorem">Lorem</Select.Item>
				<Select.Item value="lorem">Lorem</Select.Item>
				<Select.Item value="lorem">Lorem</Select.Item>
			</Select.Content>
		</Select.Root>
		<Select.Root>
			<Select.Trigger class="w-52">
				<Select.Value placeholder="Sort by" />
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="lorem">Lorem</Select.Item>
				<Select.Item value="lorem">Lorem</Select.Item>
				<Select.Item value="lorem">Lorem</Select.Item>
			</Select.Content>
		</Select.Root>
		<Input placeholder="Search..." class="w-64"></Input>
	</div>
	<Button><PlusCircle class="mr-2 h-4 w-4" />Create a How-to</Button>
</div>
<div class="container mx-auto grid grid-cols-4 gap-x-6 py-10">
	{#each howTos as howTo}
		<HowToItem {howTo} />
	{/each}
</div>
