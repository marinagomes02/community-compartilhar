<script lang="ts">
	import Button from "@/components/ui/button/button.svelte";
    import * as Card from "@/components/ui/card";
	import { acceptGroupRequestSchema, rejectGroupRequestSchema, type AcceptGroupRequestForm, type RejectGroupRequestForm } from "@/schemas/groups-moderation";
	import type { GroupRequestData } from "@/types";
	import { translate } from "@/utils/translation/translate-util";
	import { ButtonGroup, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
	import { ChevronLeft, ChevronRight, Circle, CircleCheck, CircleX } from "lucide-svelte";
	import { onMount } from "svelte";
	import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";

    export let acceptForm: SuperValidated<Infer<AcceptGroupRequestForm>>;
    export let rejectForm: SuperValidated<Infer<RejectGroupRequestForm>>;
    export let groupsData: GroupRequestData[];
    export let locale: string;

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
</script>

<Card.Root class="w-full">
    <Card.Header>
		<Card.Title>{translate(locale, "groupsModeration.title")}</Card.Title>
		<Card.Description
			>{translate(locale, "groupsModeration.description")}
		</Card.Description>
	</Card.Header>  
    <Card.Content class="flex flex-col w-full pb-0">
        <div class="table-container mx-8 my-8">
            <Table class="w-full">
                <TableHead>
                    <TableHeadCell>{translate(locale, "name")}</TableHeadCell>
                    <TableHeadCell>{translate(locale, "Members")}</TableHeadCell>
                    <TableHeadCell>{translate(locale, "non-certified")}</TableHeadCell>
                    <TableHeadCell>{translate(locale, "region")}</TableHeadCell>
                    <TableHeadCell>{translate(locale, "state")}</TableHeadCell>
                    <TableHeadCell></TableHeadCell>
                    <TableHeadCell></TableHeadCell>
                </TableHead>
                <TableBody tableBodyClass="divide-y">
                    {#if currentPageItems.length === 0}
                        <TableBodyRow>
                            <TableBodyCell class="td-medium" colspan="5">
                                <p class="text-center text-gray-500 dark:text-gray-400">
                                    {translate(locale, "groupsModeration.emptyState")}
                                </p>
                            </TableBodyCell>
                        </TableBodyRow>
                    {/if}
                    {#each currentPageItems as group}
                        <TableBodyRow class="h-fit">
                            <TableBodyCell class="td-medium">{group.name}</TableBodyCell>
                            <TableBodyCell class="td-long">{group.members.map(m => m.email).join(", ")}</TableBodyCell>
                            <TableBodyCell class="td-long">{group.members.filter(m => !m.completed_course).map(m => m.email).join(", ")}</TableBodyCell>
                            <TableBodyCell class="td-medium">{group.region}</TableBodyCell>
                            <TableBodyCell class="td-medium">
                                {#if group.is_authorized}
                                    <span class="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded dark:bg-gray-700 dark:text-gray-300 w-fit mt-1">{translate(locale, "authorized")}</span>
                                {:else}
                                    <span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-blue-900 dark:text-blue-300">{translate(locale, "pendent")}</span>
                                {/if}
                            </TableBodyCell>
                            <TableBodyCell class="td-small">
                                {#if !group.is_authorized}
                                    <form method="POST" action="?/accept_group_request" use:acceptEnhance>
                                        <input type="hidden" name="group_id" value={group.id} />
                                        <Button type="submit" variant="link" size="sm" class="hover:decoration-turquoise-800">
                                            <span class="text-turquoise-800">Autorizar</span>
                                        </Button>
                                    </form>                                    
                                {/if}
                            </TableBodyCell>
                            <TableBodyCell class="pr-2 td-small">
                                <form method="POST" action="?/reject_group_request" use:rejectEnhance>
                                    <input type="hidden" name="group_id" value={group.id} />
                                    <Button type="submit" variant="link" size="sm" class="hover:decoration-red-600">
                                        <span class="text-red-600">Eliminar</span>
                                    </Button>
                                </form>
                            </TableBodyCell>
                        </TableBodyRow>                    
                    {/each}
                </TableBody>
            </Table>
            <div class="flex flex-row w-full justify-between items-center p-4 mt-2" aria-label="Table navigation">
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {translate(locale, "show")}
                    <span class="font-semibold text-gray-900 dark:text-white">{startRange}-{endRange}</span>
                    {translate(locale, "of")}
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
        max-width: 10rem;
        padding: 0.8rem 0px 0.8rem 0px !important;
    }
    :global(.td-small) {
        max-width: 7rem;
        padding: 0.8rem 0px 0.8rem 0px !important;
    }
    :global(.td-long) {
        max-width: 25rem;
        padding: 0.8rem 0px 0.8rem 0px !important;
    }
</style>
