<script lang="ts">
	import type { PageData } from "./$types";
    import * as Card from '$lib/components/ui/card';
	import { getResponsibilityFromKey, toTitleCase } from "../../../../utils/group-util";
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
	import type { Responsibilities } from "@/types";

    export let data: PageData;
    const { possibleGroupData, joinGroupRequestsData } = data;
    
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

<div class="flex flex-col px-40 py-10 gray-background root-div-responsive">
    <div class="flex flex-row mb-4 px-2 justify-between">
        <p class="content-center text-lg font-bold">Grupo de patrocínio</p>
    </div>
    <div class="flex flex-col w-full gap-x-8 responsive-div"></div>
    <Card.Root>
        <Card.Content>
            <div class="flex flex-row space-x-32 pl-8 mt-8">
                <div class="flex flex-row space-x-3 items-center">
                    <p class="text-gray-500">Estado: </p>
                    {#if possibleGroupData.is_validated}
                        <span class="bg-green-100 text-green-800 text-sm px-2.5 py-1 rounded dark:bg-gray-700 dark:text-gray-300 h-fit">Validado</span>
                    {:else}
                        <span class="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-1 rounded dark:bg-red-900 dark:text-red-300 h-fit">Pendente</span>
                    {/if}
                </div>
                <div class="flex flex-row space-x-2 items-center">
                    <p class="text-gray-500">Região: </p>
                    <p class="text-md">{toTitleCase(possibleGroupData.region)}</p>
                </div>
                <div class="flex flex-row space-x-2 items-center">
                    <p class="text-gray-500">Data de criação: </p>
                    <p class="text-md">{formatDate(possibleGroupData.created_at)}</p>
                </div>
            </div>
            <div class="inline-block px-8 mt-14 w-full">
                <Table class="w-full">
                    <TableHead>
                        <TableHeadCell>Nome</TableHeadCell>
                        <TableHeadCell>Data de criação</TableHeadCell>
                        <TableHeadCell>Regiões</TableHeadCell>
                        <TableHeadCell>Responsabilidades</TableHeadCell>
                    </TableHead>
                    <TableBody tableBodyClass="divide-y">
                        {#each joinGroupRequestsData as request}
                            <TableBodyRow>
                                <TableBodyCell class="td-small">
                                    <a href="/users/{request.user_id}" class="underline">
                                        {request.user_data.display_name}
                                    </a>
                                </TableBodyCell>
                                <TableBodyCell class="td-medium">{formatDate(request.created_at)}</TableBodyCell>
                                <TableBodyCell class="td-medium">{formatRegions(request.possible_regions)}</TableBodyCell>
                                <TableBodyCell class="td-long-padding">{formatResponsibilities(request.responsibilities)}</TableBodyCell>
                            </TableBodyRow>                    
                        {/each}
                    </TableBody>
                </Table>
            </div>
        </Card.Content>
    </Card.Root>
</div>

<style>
    .table-container {
		display: inline-block;
	}
	:global(td) {
		text-align: center !important;
        white-space: normal !important;
        font-size: small;
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
    @media (max-width: 900px) {
        :global(.responsive-div) {
            flex-direction: column !important;
        }
        :global(.responsive-card) {
            width: 100% !important;
            margin-bottom: 20px;
        }
        :global(.root-div-responsive) {
            padding: 40px !important;
        }
    }
</style>