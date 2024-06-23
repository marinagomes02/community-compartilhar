<script lang="ts">
	import Button from "@/components/ui/button/button.svelte";
    import * as Card from "@/components/ui/card";
	import { acceptGroupRequestSchema, rejectGroupRequestSchema, type AcceptGroupRequestForm, type RejectGroupRequestForm } from "@/schemas/groups-moderation";
	import type { GroupRequestData } from "@/types";
	import { ButtonGroup, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
	import { ChevronLeft, ChevronRight, Circle, CircleCheck, CircleX } from "lucide-svelte";
	import { onMount } from "svelte";
	import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";

    export let acceptForm: SuperValidated<Infer<AcceptGroupRequestForm>>;
    export let rejectForm: SuperValidated<Infer<RejectGroupRequestForm>>;
    export let groupsData: GroupRequestData[];

    const acceptGroupForm = superForm(acceptForm, {
        validators: zodClient(acceptGroupRequestSchema),
        resetForm: true
    });
    const { form: acceptFormData, enhance: acceptEnhance, submitting: acceptSubmitting } = acceptGroupForm;

    const rejectGroupForm = superForm(rejectForm, {
        validators: zodClient(rejectGroupRequestSchema),
        resetForm: true
    });
    const { form: rejectFormData, enhance: rejectEnhance, submitting: rejectSubmitting } = rejectGroupForm;

    let currentPosition = 0;
  	const itemsPerPage = 8;
  	const showPage = 8;
	let totalPages = 0;
	let pagesToShow: any[] = [];
	let startPage = 0;
	let endPage = 0;

    $: groups = groupsData
    $: totalItems = groupsData.length;
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

    function buildMembersString(group: GroupRequestData) {
        return group.members.map(member => member.email).join(", ");
    }

</script>

<Card.Root class="w-full">
    <Card.Header>
		<Card.Title>Registo de grupos</Card.Title>
		<Card.Description
			>Verifique todos os registos de grupos de patrocínio e aprove ou rejeite os pedidos. Estes grupos já devem existir no CPR antes de serem criados na plataforma.
		</Card.Description>
	</Card.Header>  
    <Card.Content class="flex flex-col w-full pb-0">
        <div class="table-container mx-8 my-8">
            <Table class="w-full">
                <TableHead>
                    <TableHeadCell>Nome</TableHeadCell>
                    <TableHeadCell>Membros</TableHeadCell>
                    <TableHeadCell>Região</TableHeadCell>
                    <TableHeadCell>Estado</TableHeadCell>
                    <TableHeadCell></TableHeadCell>
                    <TableHeadCell></TableHeadCell>
                </TableHead>
                <TableBody tableBodyClass="divide-y">
                    {#each currentPageItems as group}
                        <TableBodyRow>
                            <TableBodyCell class="td-medium">{group.name}</TableBodyCell>
                            <TableBodyCell class="td-long">{buildMembersString(group)}</TableBodyCell>
                            <TableBodyCell class="td-medium">{group.region}</TableBodyCell>
                            <TableBodyCell class="td-medium">
                                {#if group.is_authorized}
                                    <span class="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded dark:bg-gray-700 dark:text-gray-300 w-fit mt-1">Autorizado</span>
                                {:else}
                                    <span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-blue-900 dark:text-blue-300">Pendente</span>
                                {/if}
                            </TableBodyCell>
                            <TableBodyCell class="td-small">
                                {#if !group.is_authorized}
                                    <form method="POST" action="?/accept_group_request" use:acceptEnhance>
                                        <input type="hidden" name="group_id" value={group.id} />
                                        <Button type="submit" variant="ghost" size="sm">
                                            <CircleCheck class="h-5 w-5 text-green-500" />
                                        </Button>
                                    </form>                                    
                                {/if}
                            </TableBodyCell>
                            <TableBodyCell class="pr-2 td-small">
                                <form method="POST" action="?/reject_group_request" use:rejectEnhance>
                                    <input type="hidden" name="group_id" value={group.id} />
                                    <Button type="submit" variant="ghost" size="sm">
                                        <CircleX class="h-5 w-5 text-red-500" />
                                    </Button>
                                </form>
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
    :global(.td-long) {
        width: 30rem;
        padding: 0.8rem 0px 0.8rem 0px !important;
    }
</style>
