<script lang="ts">
	import type { PageData } from "./$types";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { editGroupSchema } from "@/schemas/group";
	import { Heading } from "flowbite-svelte";
	import { Button } from "@/components/ui/button";
	import { Loader2 } from "lucide-svelte";
	import * as Card from "@/components/ui/card";
    import * as Form from "@/components/ui/form";
    import * as RadioGroup  from "@/components/ui/radio-group";
	import { Input } from "@/components/ui/input";
	import { Label } from "@/components/ui/label";

    export let data: PageData;

    const form = superForm(data.editGroupData, {
        validators: zodClient(editGroupSchema),
    })

    const { form: formData, enhance, submitting } = form;

    let selectedIsComplete: string = String($formData.is_complete);
    let selectedIsCurrentSponsor: string = String($formData.is_current_sponsor);

    function getNumberOfMembers(members: string) {
        return members.replace(" ", "").split(',').filter((el) => el !== " " && el !== "").length;
    }
</script>

<form method="POST" use:enhance class="flex flex-col">
    <div class="flex flex-col px-40 py-10">
        <div class="flex flex-row mb-4 px-2 justify-between">
            <Heading tag="h4">Definições grupo de patrocínio</Heading>
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
            <Card.Content class="space-y-4 py-4"> 
                <Form.Field {form} name="name">
                    <Form.Control let:attrs>
                        <Form.Label>Nome</Form.Label>
                        <Input {...attrs} bind:value={$formData.name} placeholder="ex: Grupo de Benfica" />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="region">
                    <Form.Control let:attrs>
                        <Form.Label>Localidade</Form.Label>
                        <Input {...attrs} bind:value={$formData.region} placeholder="ex: Benfica" />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <!--Add a button to create more input fields one for each member)-->
                <Form.Field {form} name="members">
                    <Form.Control let:attrs>
                        <Form.Label>Membros ({getNumberOfMembers($formData.members)})</Form.Label>
                        <Input 
                            {...attrs} 
                            bind:value={$formData.members} 
                            placeholder="ex: exemplo@mail.com, exemplo2@mail.com" />
                        <Label class="font-normal text-xs">Os emails devem ser separados por vírgulas e corresponder aos dos utilizadores</Label>
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="leader">
                    <Form.Control let:attrs>
                        <Form.Label>Líder</Form.Label>
                        <Input 
                            {...attrs} 
                            bind:value={$formData.leader} 
                            placeholder="ex: exemplo@mail.com" />
                        <Label class="font-normal text-xs">O emails deve corresponder ao de um membro dado no campo acima</Label>
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <!--Add a dynamic list with all the entered emails to choose one from to be the leader-->
                <div class="flex flex-row space-x-40 pb-2">
                    <Form.Field {form} name="is_complete">
                        <Form.Control let:attrs> 
                            <Form.Label>Estado do grupo</Form.Label>
                                <RadioGroup.Root 
                                    bind:value={selectedIsComplete}
                                    onValueChange={(v) => {
                                        $formData.is_complete = Boolean(selectedIsComplete);
                                    }}>
                                    <div class="flex items-center space-x-2">
                                        <RadioGroup.Item value="false" id="r1" />
                                        <Label class="font-normal" for="r1">À procura de membros</Label>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <RadioGroup.Item value="true" id="r2" />
                                        <Label class="font-normal" for="r2">Está completo</Label>
                                    </div>
                                    <RadioGroup.Input name="isComplete" />
                                </RadioGroup.Root>
                        </Form.Control>
                    </Form.Field>
                    <Form.Field {form} name="is_current_sponsor">
                        <Form.Control let:attrs> 
                            <Form.Label>Patrocínio</Form.Label>
                                <RadioGroup.Root 
                                    bind:value={selectedIsCurrentSponsor}
                                    onValueChange={(v) => {
                                        $formData.is_complete = Boolean(selectedIsCurrentSponsor);
                                    }}>
                                    <div class="flex items-center space-x-2">
                                        <RadioGroup.Item value="false" id="r1" />
                                        <Label class="font-normal" for="r1">Não tem grupo de refugiados atribuído</Label>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <RadioGroup.Item value="true" id="r2" />
                                        <Label class="font-normal" for="r2">Está a patrocinar um grupo de refugiados</Label>
                                    </div>
                                    <RadioGroup.Input name="isCurrentSponsor" />
                                </RadioGroup.Root>
                        </Form.Control>
                    </Form.Field>
                </div>
            </Card.Content>
        </Card.Root>
    </div>
</form>
