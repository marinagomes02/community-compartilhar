<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { Button } from '@/components/ui/button';
	import Card from '@/components/ui/card/card.svelte';
	import { BarChart2, Bookmark, CircleUser, Clock, Footprints, Pen, Trash } from 'lucide-svelte';
	import HowToDeleteDialog from './_components/how-to-delete-dialog.svelte';

	export let data;

	let openDeleteDialog = false;
</script>

<PageHeader title={data.howTo.title} subtitle={data.howTo.description} />
<div class="container mx-auto pb-10">
	<div class="mb-10 flex flex-col items-center gap-y-4">
		<span class="text-sm text-muted-foreground">Updated on 01/01/2001</span>
		<Button variant="secondary" size="sm" href="/user/0">
			<CircleUser class="mr-2 h-4 w-4" />
			João Nogueira
		</Button>
		<div class="flex flex-row items-center justify-center gap-x-4">
			<div class="flex flex-row gap-x-2">
				<Footprints />
				steps
			</div>
			<div class="flex flex-row gap-x-2">
				<Clock />
				duration
			</div>
			<div class="flex flex-row gap-x-2">
				<BarChart2 />
				difficulty
			</div>
		</div>
		<Button variant="outline" size="sm" href="/how-to/create">
			<Bookmark class="mr-2 h-4 w-4" />
			Mark as useful
			<span class="ml-4 font-mono text-xs">24</span>
		</Button>
	</div>

	<div class="flex flex-col gap-y-10">
		{#each data.howTo.steps as step, i}
			<div class="flex flex-row gap-x-6">
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
	{#if data.howTo.user_id === data.user?.id}
		<div
			class="sticky bottom-0 flex w-full flex-row items-center justify-center gap-x-10 border-t bg-background/95 py-8 backdrop-blur supports-[backdrop-filter]:bg-background/60"
		>
			<Button variant="outline" href="/how-to/{data.howTo.id}/edit">
				<Pen class="mr-2 h-4 w-4" />
				Edit
			</Button>
			<form></form>
			<Button variant="destructive" on:click={() => (openDeleteDialog = true)}>
				<Trash class="mr-2 h-4 w-4" />
				Delete
			</Button>
		</div>
	{/if}
</div>

<HowToDeleteDialog howToId={data.howTo.id} data={data.deleteForm} bind:open={openDeleteDialog} />
