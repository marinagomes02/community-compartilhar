<script lang="ts">
	import type { PossibleGroupData } from "@/types";
	import { onMount } from "svelte";
    import Button from "@/components/ui/button/button.svelte";
    import * as Card from "@/components/ui/card";
    import { ButtonGroup, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
	import { ChevronLeft, ChevronRight } from "lucide-svelte";
	import { getResponsibilityFromKey, toTitleCase } from "../../../lib/utils/group-util";

    export let possibleGroupsData: PossibleGroupData[];

    let currentPosition = 0;
  	const itemsPerPage = 8;
  	const showPage = 8;
	let totalPages = 0;
	let pagesToShow: any[] = [];
	let startPage = 0;
	let endPage = 0;

    $: groups = possibleGroupsData
    $: totalItems = possibleGroupsData.length;
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
</script>

<Card.Root class="w-full">
    <Card.Header>
		<Card.Title>Pedidos para encontrar grupos</Card.Title>
		<Card.Description
			>Todos os pedidos feitos por utilizadores para participar em grupos de patrocínio neste momento. Os pedidos são válidos apenas durante o período indicado definido pelo utilizador.
        Nestes pedidos, os utilizadores indicam as <strong>regiões</strong> onde estão dispostos a fazer o patrocínio, a <strong>distância máxima</strong> a que podem estar de outros membros do grupo e as <strong>responsabilidades</strong> que estão dispostos a assumir.
        </Card.Description>
	</Card.Header>  
    <Card.Content class="flex flex-col w-fit pb-0">
        <div class="table-container mx-8 my-8">
            <Table class="w-full">
                <TableHead>
                    <TableHeadCell>Estado</TableHeadCell>
                    <TableHeadCell>Região</TableHeadCell>
                    <TableHeadCell>Data de criação</TableHeadCell>
                    <TableHeadCell>Membros</TableHeadCell>
                    <TableHeadCell></TableHeadCell>
                </TableHead>
                <TableBody tableBodyClass="divide-y">
                    {#if currentPageItems.length === 0}
                        <TableBodyRow>
                            <TableBodyCell class="td-medium" colspan="5">
                                <p class="text-center text-gray-500 dark:text-gray-400">Não existem possíveis grupos de patrocínio.</p>
                            </TableBodyCell>
                        </TableBodyRow>
                    {/if}
                    {#each currentPageItems as possible_group}
                        <TableBodyRow>
                            <TableBodyCell class="td-medium">
                                {#if possible_group.is_validated}
                                    <span class="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded dark:bg-gray-700 dark:text-gray-300 w-fit mt-1">Validado</span>
                                {:else}
                                    <span class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-red-900 dark:text-red-300">Pendente</span>
                                {/if}
                            </TableBodyCell>
                            <TableBodyCell class="td-medium">{toTitleCase(possible_group.region)}</TableBodyCell>
                            <TableBodyCell class="td-medium">{formatDate(possible_group.created_at)}</TableBodyCell>
                            <TableBodyCell class="td-medium">{possible_group.members_count[0].count}</TableBodyCell>
                            <TableBodyCell class="td-medium">
                                <a href="/groups/join/validate/{possible_group.id}" class="underline text-blue-500">
                                    Ver grupo
                                </a>
                            </TableBodyCell>
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