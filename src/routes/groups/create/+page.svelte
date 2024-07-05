<script lang="ts">
	import * as Card from '$lib/components/ui/card';
    import * as Form from '$lib/components/ui/form';
    import * as RadioGroup  from '@/components/ui/radio-group';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
    import { createGroupSchema } from "@/schemas/group";
	import { Loader2 } from 'lucide-svelte';
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import type { PageData } from './$types';
	import { Heading } from 'flowbite-svelte';
	import { translate } from '@/utils/translation/translate-util';

    export let data: PageData;
    
    let locale: string;
    $: locale = data.languagePreference.language;

    const form = superForm(data.createGroupForm, {
        validators: zodClient(createGroupSchema),
    })
    const { form: formData, enhance, submitting } = form;

    let selectedIsComplete: string;
    let selectedIsCurrentSponsor: string;

</script>

<form method="POST" use:enhance class="flex flex-col items-center">
    <div class="flex flex-col px-40 py-10 w-[calc(100%-50vh)]">
        <div class="flex flex-row mb-4 px-2 justify-between">
            <Heading tag="h4">{translate(locale, "createGroupForm.title")}</Heading>
            <Button 
                class="w-fit" 
                type="submit" 
                disabled={$submitting} 
                style="background-color:#2A9D8F">
                {#if $submitting}
                    <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                {/if}
                {translate(locale, "submit")}
            </Button>
        </div>
        <Card.Root> 
            <Card.Content class="space-y-4 py-4"> 
                <Form.Field {form} name="name">
                    <Form.Control let:attrs>
                        <Form.Label>{translate(locale, "name")}*</Form.Label>
                        <Input {...attrs} bind:value={$formData.name} placeholder="ex: Grupo de Benfica" />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="region">
                    <Form.Control let:attrs>
                        <Form.Label>{translate(locale, "region")}*</Form.Label>
                        <Input {...attrs} bind:value={$formData.region} placeholder="ex: Benfica" />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <!--Add a button to create more input fields one for each member)-->
                <Form.Field {form} name="members">
                    <Form.Control let:attrs>
                        <Form.Label>{translate(locale, "Members")}*</Form.Label>
                        <Input 
                            {...attrs} 
                            bind:value={$formData.members} 
                            placeholder="ex: exemplo@mail.com, exemplo2@mail.com" />
                        <Label class="font-normal text-xs">{translate(locale, "createGroupForm.emailDisclaimer")}</Label>
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="leader">
                    <Form.Control let:attrs>
                        <Form.Label>{translate(locale, "leader")}*</Form.Label>
                        <Input 
                            {...attrs} 
                            bind:value={$formData.leader} 
                            placeholder="ex: exemplo@mail.com" />
                        <Label class="font-normal text-xs">{translate(locale, "createGroupForm.leaderDisclaimer")}</Label>
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <!--Add a dynamic list with all the entered emails to choose one from to be the leader-->
                <div class="flex flex-row space-x-40 pb-2">
                    <Form.Field {form} name="is_complete">
                        <Form.Control let:attrs> 
                            <Form.Label>{translate(locale, "group.state")}*</Form.Label>
                                <RadioGroup.Root 
                                    bind:value={selectedIsComplete}
                                    onValueChange={(v) => {
                                        $formData.is_complete = Boolean(selectedIsComplete);
                                    }}>
                                    <div class="flex items-center space-x-2">
                                        <RadioGroup.Item value="false" id="r1" />
                                        <Label class="font-normal" for="r1">{translate(locale, "group.lookingForMembers")}</Label>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <RadioGroup.Item value="true" id="r2" />
                                        <Label class="font-normal" for="r2">{translate(locale, "group.complete")}</Label>
                                    </div>
                                    <RadioGroup.Input name="isComplete" />
                                </RadioGroup.Root>
                        </Form.Control>
                    </Form.Field>
                    <Form.Field {form} name="is_current_sponsor">
                        <Form.Control let:attrs> 
                            <Form.Label>{translate(locale, "sponsorship")}*</Form.Label>
                                <RadioGroup.Root 
                                    bind:value={selectedIsCurrentSponsor}
                                    onValueChange={(v) => {
                                        $formData.is_complete = Boolean(selectedIsCurrentSponsor);
                                    }}>
                                    <div class="flex items-center space-x-2">
                                        <RadioGroup.Item value="false" id="r1" />
                                        <Label class="font-normal" for="r1">{translate(locale, "group.state.notSponsoring")}</Label>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <RadioGroup.Item value="true" id="r2" />
                                        <Label class="font-normal" for="r2">{translate(locale, "group.state.sponsoring")}</Label>
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