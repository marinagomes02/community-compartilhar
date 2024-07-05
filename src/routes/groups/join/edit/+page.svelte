<script lang="ts">
	import SuperDebug, { superForm } from "sveltekit-superforms";
	import type { PageData } from "./$types";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { deleteGroupSearchRequestSchema, editGroupSearchRequestSchema } from "@/schemas/group";
	import { Button } from "@/components/ui/button";
	import { Loader2 } from "lucide-svelte";
    import * as Card from '$lib/components/ui/card';
    import * as Form from '$lib/components/ui/form';
	import { Input } from "@/components/ui/input";
	import { Label } from "@/components/ui/label";
	import { Heading } from "flowbite-svelte";
	import { Responsibilities } from "@/types";
	import { getResponsibilityFromKey } from "../../../../lib/utils/group-util";

    export let data: PageData;

    const editForm = superForm(data.editGroupSearchRequestData, {
        validators: zodClient(editGroupSearchRequestSchema),
    })
    const form = superForm(data.deleteGroupSearchRequestForm, {
        validators: zodClient(deleteGroupSearchRequestSchema),
    })
    const { form: editFormData, enhance: editEnhance, submitting: editSubmitting } = editForm;
    const { form: deleteFormData, enhance: deleteEnhance, submitting: deleteSubmitting } = form;
</script>

<div class="flex flex-col px-40 pt-4 pb-5 w-full">
    {#if data.possible_group_id}
        <div class="w-fit p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
            <span class="font-medium">Estado:</span>
            Já temos um grupo de patrocínio para si! Aguarde o contacto do CPR para os próximos passos. Pode consultar os detalhes do grupo
            <a href="/groups/join/{data.possible_group_id}" class="underline text-blue-500">aqui.</a>
        </div>
    {:else}
        <div class="w-fit p-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
            <span class="font-medium">Pedido para juntar a grupo:</span>
            O seu pedido para encontrar um grupo de patrocínio foi submetido com sucesso! Estamos à procura de mais membros na sua região para formar um grupo de patrocínio comunitário :)
        </div>
    {/if}
    <form method="POST" action="?/edit" use:editEnhance class="flex flex-col pt-7 w-full">
        <input hidden name="possible_group_id" value={data.possible_group_id}>
        <input hidden name="id" value={data.request_id}>
        <div class="flex flex-row mb-4 px-2 justify-between">
            <Heading tag="h4">Editar pedido para encontrar grupo de patrocínio</Heading>
            <Button 
                class="w-fit" 
                type="submit" 
                disabled={$editSubmitting} 
                style="background-color:#2A9D8F">
                {#if $editSubmitting}
                    <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                {/if}
                Submeter
            </Button>
        </div>
        <Card.Root> 
            <Card.Content class="space-y-8 py-4"> 
                <Form.Field form={editForm} name="region">
                    <Form.Control let:attrs>
                        <Form.Label>Regiões onde pretende participar *</Form.Label>
                        <Input {...attrs} bind:value={$editFormData.region} placeholder="ex: Benfica, Carnide, Lisboa, Alvalade" />
                        <Label class="font-normal text-xs">Escreva todas as regiões onde estaria disposto a fazer o patrocínio (presencial)</Label>
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <div class="flex flex-row space-x-10">
                    <Form.Field form={editForm} name="available_period" class="w-fit">
                        <Form.Control let:attrs>
                            <Form.Label>Período de validade (meses) *</Form.Label>
                            <Input {...attrs} bind:value={$editFormData.available_period} placeholder="ex: 24" />
                            <Label class="font-normal text-xs">Indique o tempo de validade deste pedido para se juntar a um grupo de patrocínio. Após este período o seu pedido será eliminado.</Label>
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>
                    <Form.Field form={editForm} name="max_dist">
                        <Form.Control let:attrs>
                            <Form.Label>Distância máxima (km) *</Form.Label>
                            <Input {...attrs} bind:value={$editFormData.max_dist} placeholder="ex: 100" />
                            <Label class="font-normal text-xs">Indique a distância máxima a que podem estar outros membros do seu grupo.</Label>
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>
                </div>
                <Form.Field form={editForm} name="responsibilities">
                    <Form.Control let:attrs>
                        <Form.Label>Responsabilidades*</Form.Label>
                        <div class="grid grid-cols-3">
                            {#each Object.keys(Responsibilities) as resp}
                                <div class="items-center mb-2">
                                    <input
                                        type="checkbox"
                                        name="responsibilities"
                                        value={resp}
                                        bind:group={$editFormData.responsibilities}
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-0 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label 
                                        for={resp}
                                        class="ms-2 text-sm text-gray-900 dark:text-gray-300"
                                    >{getResponsibilityFromKey(resp)}
                                    </label>
                                </div>
                            {/each}
                        </div>
                        <Label class="font-normal text-xs">Indique todas as responsabilidades que está disposto a assumir no grupo de patrocínio</Label>
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </Card.Content>
        </Card.Root>
    </form>
    <form method="POST" action="?/delete" use:deleteEnhance class="mt-4 w-full">
        <div class="flex flex-row mb-4 w-full">
            <input type="hidden" name="request_id" value={data.request_id}>
            <input type="hidden" name="possible_group_id" value={data.possible_group_id}>
            <Button 
                class="w-fit mr-0 ml-auto" 
                type="submit" 
                disabled={$deleteSubmitting} 
                variant="destructive">
                {#if $deleteSubmitting}
                    <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                {/if}
                Eliminar pedido
            </Button>
        </div>
    </form>
</div>