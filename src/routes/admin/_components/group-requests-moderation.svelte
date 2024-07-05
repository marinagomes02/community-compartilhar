<script lang="ts">
	import type { JoinGroupRequestData, Responsibilities } from "@/types";
	import { onMount } from "svelte";
    import Button from "@/components/ui/button/button.svelte";
    import * as Card from "@/components/ui/card";
    import { ButtonGroup, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
	import { ChevronLeft, ChevronRight } from "lucide-svelte";
	import { getResponsibilityFromKey, toTitleCase } from "../../../lib/utils/group-util";

    export let joinRequestsData: JoinGroupRequestData[];

    let currentPosition = 0;
  	const itemsPerPage = 8;
  	const showPage = 8;
	let totalPages = 0;
	let pagesToShow: any[] = [];
	let startPage = 0;
	let endPage = 0;

    $: groups = joinRequestsData
    $: totalItems = joinRequestsData.length;
    $: startRange = currentPosition + 1;
	$: endRange = Math.min(currentPosition + itemsPerPage, totalItems);
	$: currentPageItems = groups.slice(currentPosition, currentPosition + itemsPerPage);
    
    const updateDataAndPagination = () => {
    	const currentPageItems = groups.slice(currentPosition, currentPosition + itemsPerPage);
    	renderPagination();
	}

	const loadNextPage = () => {
		if (currentPosition + itemsPerPage < groups.length) {
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
		totalPages = Math.ceil(groups.length / itemsPerPage);
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

    function formatDate(date: string) {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(date).toLocaleDateString('pt-PT', options);
    }
    function formatRegions(regions: string[]) {
        return regions.map((r: string) => toTitleCase(r)).join(", ");
    }
    function formatResponsibilities(responsibilities: Responsibilities[]) {
        return responsibilities.map((r: string) => getResponsibilityFromKey(r)).join(", ");
    }
</script>

<Card.Root class="w-full">
    <Card.Header>
		<Card.Title>Pedidos para encontrar grupos</Card.Title>
		<Card.Description
			>Todos os pedidos feitos por utilizadores para participar em grupos de patrocínio neste momento. Os pedidos são válidos apenas durante o período indicado definido pelo utilizador.
        Nestes pedidos, os utilizadores indicam as <strong>regiões</strong> onde estão dispostos a fazer o patrocínio, a <strong>distância máxima</strong> a que podem estar de outros membros do grupo e as <strong>responsabilidades</strong> que estão dispostos a assumir.
        </Card.Description>
	</Card.Header>  
    <Card.Content class="flex flex-col w-full pb-0">
        <div class="table-container mx-8 my-8">
            <Table class="w-full">
                <TableHead>
                    <TableHeadCell>Estado</TableHeadCell>
                    <TableHeadCell>Nome</TableHeadCell>
                    <TableHeadCell>Data de criação</TableHeadCell>
                    <TableHeadCell>Validade</TableHeadCell>
                    <TableHeadCell>Distância Máxima</TableHeadCell>
                    <TableHeadCell>Regiões</TableHeadCell>
                    <TableHeadCell>Responsabilidades</TableHeadCell>
                </TableHead>
                <TableBody tableBodyClass="divide-y">
                    {#if currentPageItems.length === 0}
                        <TableBodyRow>
                            <TableBodyCell class="td-medium" colspan="5">
                                <p class="text-center text-gray-500 dark:text-gray-400">Não existem pedidos para participar em grupos de patrocínio.</p>
                            </TableBodyCell>
                        </TableBodyRow>
                    {/if}
                    {#each currentPageItems as request}
                        <TableBodyRow>
                            <TableBodyCell class="td-small">
                                {#if request.possible_group_id}
                                    <span class="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded dark:bg-gray-700 dark:text-gray-300 w-fit mt-1">Atribuído</span>
                                {:else}
                                    <span class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-red-900 dark:text-red-300">Em espera</span>
                                {/if}
                            </TableBodyCell>
                            <TableBodyCell class="td-medium">
                                <a href="/users/{request.user_id}" class="underline">
                                    {request.user_data.display_name}
                                </a>
                            </TableBodyCell>
                            <TableBodyCell class="td-medium">{formatDate(request.created_at)}</TableBodyCell>
                            <TableBodyCell class="td-small">{request.available_period} meses</TableBodyCell>
                            <TableBodyCell class="td-medium">{request.max_dist} km</TableBodyCell>
                            <TableBodyCell class="td-medium">{formatRegions(request.possible_regions)}</TableBodyCell>
                            <TableBodyCell class="td-long-padding">{formatResponsibilities(request.responsibilities)}</TableBodyCell>
                        </TableBodyRow>                    
                    {/each}
                </TableBody>
            </Table>
            <div class="flex flex-row w-full justify-between items-center p-4 mt-2" aria-label="Table navigation">
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Mostrar
                    <span class="font-semibold text-gray-900 dark:text-white">{startRange}-{endRange}</span>
                    de
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
        </div>
    </Card.Content>  
</Card.Root>

<style>
	.table-container {
		display: inline-block;
	}
	:global(td) {
		text-align: center !important;
        white-space: normal !important;
	}
	:global(.btn-pagination) {
		border-radius: 0;
	}
	:global(.align-end) {
		text-align: right;
	}
    :global(.td-medium) {
        width: 12rem;
        padding: 0.8rem 0px 0.8rem 0px !important;
    }
    :global(.td-small) {
        width: 3rem;
        padding: 0.8rem 0px 0.8rem 0px !important;
    }
    :global(.td-long-padding) {
        width: 18rem;
        padding: 0.8rem 1rem 0.8rem 1rem !important;
    }
</style>