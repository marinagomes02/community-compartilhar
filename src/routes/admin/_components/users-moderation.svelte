<script lang="ts">
    import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-svelte';
	import { registerUsersSchema, unregisterUserSchema } from '@/schemas/register-users';
	import { fileProxy, superForm } from 'sveltekit-superforms';
	import { TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch, ButtonGroup  } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import type { PageData } from '../$types';

	export let data : PageData;

	const form = superForm(data.registerForm, {
		validators: zodClient(registerUsersSchema),
		dataType: 'json',
		resetForm: true
	});

	const { form: formData, enhance, submitting } = form;

	const { form: unregisterForm, enhance:unregisterEnhance} = superForm(data.unregisterForm, {
		validators: zodClient(unregisterUserSchema),
		dataType: 'json',
		resetForm: true
	});

	const file = fileProxy(form, 'file');

	$: authorizedEmails = data.authorizedEmails;
	$: totalItems = authorizedEmails.length;

	let searchTerm = '';
	let currentPosition = 0;
  	const itemsPerPage = 10;
  	const showPage = 10;
	let totalPages = 0;
	let pagesToShow: any[] = [];
	let startPage = 0;
	let endPage = 0;

	const updateDataAndPagination = () => {
    	const currentPageItems = authorizedEmails.slice(currentPosition, currentPosition + itemsPerPage);
    	renderPagination();
	}

	const loadNextPage = () => {
		console.log(currentPosition, itemsPerPage, authorizedEmails.length)
		if (currentPosition + itemsPerPage < authorizedEmails.length) {
			currentPosition += itemsPerPage;
			updateDataAndPagination();
		}
	}

	const loadPreviousPage = () => {
		if (currentPosition - itemsPerPage >= 0) {
			currentPosition -= itemsPerPage;
			updateDataAndPagination();
		}
	}

	const renderPagination = () => {
		totalPages = Math.ceil(authorizedEmails.length / itemsPerPage);
		const currentPage = Math.ceil((currentPosition + 1) / itemsPerPage);

		startPage = currentPage - Math.floor(showPage / 2);
		startPage = Math.max(1, startPage);
		endPage = Math.min(startPage + showPage - 1, totalPages);

		pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
	}

	const goToPage = (pageNumber: number) => {
		currentPosition = (pageNumber - 1) * itemsPerPage;
		updateDataAndPagination();
	}

	onMount(() => {
		renderPagination();
	});
	
	const unregisterEmail = (email: string) => {
		$unregisterForm.email = email;
	}

	$: startRange = currentPosition + 1;
	$: endRange = Math.min(currentPosition + itemsPerPage, totalItems);

	$: currentPageItems = authorizedEmails.slice(currentPosition, currentPosition + itemsPerPage);
	$: filteredItems = authorizedEmails.filter((item) => item.email.indexOf(searchTerm.toLowerCase()) !== -1);

</script>


<Card.Root class="w-full">
	<Card.Header>
		<Card.Title>Register new users</Card.Title>
		<Card.Description
			>Upload a .csv file with one column, corresponding to the list of 
			e-mails of the new users you want to register
		</Card.Description>
	</Card.Header>
	<Card.Content class="flex flex-col pb-2 w-full">
		<form method="POST" action="?/register" enctype="multipart/form-data" use:enhance class="container mx-auto flex flex-row justify-between">
			<Form.Field {form} name="file">
				<Form.Control let:attrs>
					<input {...attrs} type="file" accept="text/csv" bind:files={$file} class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Button variant="secondary" type="submit" disabled={$submitting} class="w-fit">
				{#if $submitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Submit
			</Button>
		</form>
		<div class="table-container">
			<TableSearch hoverable={true} bind:inputValue={searchTerm} placeholder="Procurar..." svgClass="display: none" shadow="true">
				<TableHead>
					<TableHeadCell>Email</TableHeadCell>
					<TableHeadCell></TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
					{#if searchTerm !== ''}
						{#each filteredItems as authorized}
							<TableBodyRow>
								<TableBodyCell>{authorized.email}</TableBodyCell>
								<TableBodyCell align="end" class="align-end">
									<form method="POST" action="?/unregister" enctype="multipart/form-data" use:unregisterEnhance>
										<Button variant="ghost" size="sm" class="btn-delete"><X class="mr-2 h-4 w-4" color="#DA2727" /></Button>
									</form>
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					{:else}
						{#each currentPageItems as authorized}
							<TableBodyRow>
								<TableBodyCell>{authorized.email}</TableBodyCell>
								<TableBodyCell class="align-end">
									<form method="POST" action="?/unregister" enctype="multipart/form-data" use:unregisterEnhance on:submit={() => unregisterEmail(authorized.email)}>
										<input type="hidden" name="email" bind:value={$unregisterForm.email}>
										<Button type="submit" on:click={() => unregisterEmail(authorized.email)} variant="ghost" size="sm" class="btn-delete"><X class="mr-2 h-4 w-4" color="#DA2727" /></Button>
									</form>
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					{/if}
				</TableBody>
				<div slot="footer" class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
					<span class="text-sm font-normal text-gray-500 dark:text-gray-400">
						Showing
						<span class="font-semibold text-gray-900 dark:text-white">{startRange}-{endRange}</span>
						of
						<span class="font-semibold text-gray-900 dark:text-white">{totalItems}</span>
					</span>
						<ButtonGroup>
						<Button on:click={loadPreviousPage} disabled={currentPosition === 0} variant="secondary" class="btn-pagination"><ChevronLeft class="mr-2 h-4 w-4" /></Button>
						{#each pagesToShow as pageNumber}
							<Button on:click={() => goToPage(pageNumber)} variant="secondary" class="btn-pagination">{pageNumber}</Button>
						{/each}
						<Button on:click={loadNextPage} disabled={ (currentPosition / itemsPerPage) + 1 === endPage } variant="secondary" class="btn-pagination"><ChevronRight class="mr-2 h-4 w-4"/></Button>
						</ButtonGroup>
					</div>
			</TableSearch>
		</div>
	</Card.Content>
</Card.Root>


<style>
	.table-container {
		display: inline-block;
		margin: 40px 8rem 20px 8rem
	}
	:global(td) {
		text-align: left;
		padding-top: 0.1rem !important;
		padding-bottom: 0.1rem !important;
	}
	:global(.btn-pagination) {
		border-radius: 0;
	}
	:global(.align-end) {
		text-align: right;
	}
</style>
