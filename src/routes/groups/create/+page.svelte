<script lang="ts">
	import * as Card from '$lib/components/ui/card';
    import * as Form from '$lib/components/ui/form';
    import * as RadioGroup  from '@/components/ui/radio-group';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
    import { createGroupSchema } from "@/schemas/group";
	import { Loader2 } from 'lucide-svelte';
	import SuperDebug, { fieldProxy, superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import type { PageData } from './$types';
	import { Heading } from 'flowbite-svelte';
	import { translate } from '@/utils/translation/translate-util';
	import type { UserListData } from '@/types';

    export let data: PageData;
    
    let locale: string;
    $: locale = data.languagePreference.language;

    const form = superForm(data.createGroupForm, {
        validators: zodClient(createGroupSchema),
        dataType: 'json',
    })
    const { form: formData, enhance, submitting } = form;

    let selectedIsComplete: string;
    let selectedIsCurrentSponsor: string;
    let search_member_term = '';
    let filtered_users: UserListData[] = [];

    $: filtered_users = data.users_list.filter(user => user.display_name.toLowerCase().includes(search_member_term.toLowerCase()));

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
                <Form.Field {form} name="members" class="flex flex-col">
                    <Form.Control let:attrs>
                        <Form.Label>{translate(locale, "Members")} ({$formData.members.length})</Form.Label>
                        <div class="flex items-center h-10 w-full rounded-md border border-input bg-background px-2 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            {#each $formData.members as member_id}
                                <span class="h-fit bg-gray-200 text-gray-800 text-xs font-medium me-1 px-2.5 py-1 rounded dark:bg-gray-700 dark:text-gray-300">
                                    {data.users_list.find(user => user.id === member_id)?.display_name}
                                </span>
                            {/each}
                        </div>
                        <div class="space-y-2">
                            <Input 
                                bind:value={search_member_term} 
                                placeholder="Search for users..."
                                class="w-56 py-2 focus:ring-0"
                            />
                            {#if filtered_users.length > 0}
                                <div class="flex flex-col max-h-44 overflow-y-auto max-w-56 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white {search_member_term.length < 1 ? "hidden" : ""}">
                                    {#each data.users_list as user}
                                        <div class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600 {filtered_users.includes(user) ? "" : "hidden"}">
                                            <div class="flex items-center ps-3 ">
                                                <input
                                                    type="checkbox"
                                                    name="users"
                                                    value={user.id}
                                                    bind:group={$formData.members}
                                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-0 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <label 
                                                    for={user.id}
                                                    class="w-full py-2 ms-2 text-xs text-gray-900 dark:text-gray-300"
                                                >{user.display_name}
                                                </label>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            {/if}                        
                        </div>
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
                                    onValueChange={() => {
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
                                    onValueChange={() => {
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
    <SuperDebug data={formData}></SuperDebug>
</form>