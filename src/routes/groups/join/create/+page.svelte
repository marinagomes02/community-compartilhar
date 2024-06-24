<script lang="ts">
	import SuperDebug, { superForm } from "sveltekit-superforms";
	import type { PageData } from "./$types";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { groupSearchRequestSchema } from "@/schemas/group";
	import { Button } from "@/components/ui/button";
	import { Loader2 } from "lucide-svelte";
    import * as Card from '$lib/components/ui/card';
    import * as Form from '$lib/components/ui/form';
	import { Input } from "@/components/ui/input";
	import { Label } from "@/components/ui/label";
	import { Heading } from "flowbite-svelte";
	import { Responsibilities } from "@/types";
	import { getResponsibilityFromKey } from "../../../../utils/group-util";

    export let data: PageData;

    const form = superForm(data.groupSearchRequestForm, {
        validators: zodClient(groupSearchRequestSchema),
    })
    const { form: formData, enhance, submitting } = form;
</script>

<form method="POST" use:enhance class="flex flex-col items-center">
    <div class="flex flex-col px-40 py-10">
        <div class="flex flex-row mb-4 px-2 justify-between">
            <Heading tag="h4">Procurar grupo de patrocínio</Heading>
            <Button 
                class="w-fit" 
                type="submit" 
                disabled={$submitting} 
                style="background-color:#2A9D8F">
                {#if $submitting}
                    <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                {/if}
                Submeter
            </Button>
        </div>
        <Card.Root> 
            <Card.Content class="space-y-8 py-4"> 
                <Form.Field {form} name="region">
                    <Form.Control let:attrs>
                        <Form.Label>Regiões onde pretende participar *</Form.Label>
                        <Input {...attrs} bind:value={$formData.region} placeholder="ex: Benfica, Carnide, Lisboa, Alvalade" />
                        <Label class="font-normal text-xs">Escreva todas as regiões onde estaria disposto a fazer o patrocínio (presencial)</Label>
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <div class="flex flex-row space-x-10">
                    <Form.Field {form} name="available_period">
                        <Form.Control let:attrs>
                            <Form.Label>Período de validade (meses) *</Form.Label>
                            <Input {...attrs} bind:value={$formData.available_period} placeholder="ex: 24" />
                            <Label class="font-normal text-xs">Indique o tempo de validade deste pedido para se juntar a um grupo de patrocínio. Após este período o seu pedido será eliminado.</Label>
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>
                    <Form.Field {form} name="max_dist">
                        <Form.Control let:attrs>
                            <Form.Label>Distância máxima (km) *</Form.Label>
                            <Input {...attrs} bind:value={$formData.max_dist} placeholder="ex: 100" />
                            <Label class="font-normal text-xs">Indique a distância máxima a que podem estar outros membros do seu grupo.</Label>
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>
                </div>
                <Form.Field {form} name="responsibilities">
                    <Form.Control let:attrs>
                        <Form.Label>Responsabilidades*</Form.Label>
                        <div class="grid grid-cols-3">
                            {#each Object.keys(Responsibilities) as resp}
                                <div class="items-center mb-2">
                                    <input
                                        type="checkbox"
                                        name="responsibilities"
                                        value={resp}
                                        bind:group={$formData.responsibilities}
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
    </div>
</form>