<script lang="ts">
	import SuperDebug, { fieldProxy, superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { editGroupSchema, searchUserSchema } from "@/schemas/group";
	import { Heading } from "flowbite-svelte";
	import { Button } from "@/components/ui/button";
	import { Loader2, Search, SearchIcon } from "lucide-svelte";
	import * as Card from "@/components/ui/card";
    import * as Form from "@/components/ui/form";
    import * as RadioGroup  from "@/components/ui/radio-group";
	import { Input } from "@/components/ui/input";
	import { Label } from "@/components/ui/label";
	import { translate } from "@/utils/translation/translate-util";
	import type { PageData } from "./$types";
	import type { UserListData } from "@/types";

    export let data: PageData;
    
    const form = superForm(data.editGroupData, {
        validators: zodClient(editGroupSchema),
        dataType: 'json',
    })

    const { form: formData, enhance, submitting } = form;

    let locale: string;
    let selectedIsComplete: string = String(!$formData.is_complete);
    let selectedIsCurrentSponsor: string = String(!$formData.is_current_sponsor);
    let completed_state_old = fieldProxy(formData, 'completed_state_old');
    let current_members = data.current_members;
    let current_members_field = fieldProxy(formData, 'current_members');
    let leader_old = fieldProxy(formData, 'leader_old');
    let is_current_sponsor_old = fieldProxy(formData, 'is_current_sponsor_old');
    let search_member_term = '';
    let filtered_users: UserListData[] = [];

    $: current_members = data.current_members;
    $: $current_members_field = current_members;
    $: $completed_state_old = data.completed_state_old;
    $: $leader_old = data.leader_old;
    $: $is_current_sponsor_old = data.is_current_sponsor_old;
    $: locale = data.languagePreference.language;
    $: filtered_users = data.users_list.filter(user => user.display_name.toLowerCase().includes(search_member_term.toLowerCase()));
</script>


<form method="POST" action="?/edit" use:enhance class="container flex flex-col items-center pt-5 pb-10">
    <input type="hidden" name="id" bind:value={$formData.id}>
    <input type="hidden" name="current_members" bind:value={$formData.current_members}>
    <input type="hidden" name="completed_state_old" bind:value={$formData.completed_state_old}>
    <input type="hidden" name="leader_old" bind:value={$formData.leader_old}>
    <input type="hidden" name="is_current_sponsor_old" bind:value={$formData.is_current_sponsor_old}>
    {#if !data.is_authorized}
        <div class="p-3 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 mb-4" role="alert">
            <span>{translate(locale, "state")}:</span> {translate(locale, "createGroupForm.request.pendent")}
        </div>
    {/if}
    <div class="flex flex-col">
        <div class="flex flex-row mb-4 px-2 justify-between">
            <div class="flex flex-row space-x-3 items-center">
                <Heading tag="h4">{translate(locale, "editGroupForm.title")}</Heading>
                {#if data.is_authorized}
                    <span class="h-fit mt-1.5 bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-gray-700 dark:text-gray-300">{translate(locale, "authorized")}</span>
                {:else}
                    <span class="h-fit mt-1.5 bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-blue-900 dark:text-blue-300">{translate(locale, "pendent")}</span>
                {/if}
            </div>
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
                        <Form.Label>{translate(locale, "name")}</Form.Label>
                        <Input {...attrs} bind:value={$formData.name} placeholder="ex: Grupo de Benfica" />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="region">
                    <Form.Control let:attrs>
                        <Form.Label>{translate(locale, "region")}</Form.Label>
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
                            <Form.Label>{translate(locale, "group.state")}</Form.Label>
                                <RadioGroup.Root 
                                    bind:value={selectedIsComplete}
                                    onValueChange={() => {
                                        $formData.is_complete = selectedIsComplete === "true" ? true : false;
                                    }}>
                                    <div class="flex items-center space-x-2">
                                        <RadioGroup.Item value="true" id="r1" />
                                        <Label class="font-normal" for="r1">{translate(locale, "group.lookingForMembers")}</Label>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <RadioGroup.Item value="false" id="r2" />
                                        <Label class="font-normal" for="r2">{translate(locale, "group.complete")}</Label>
                                    </div>
                                    <RadioGroup.Input name="is_complete" />
                                </RadioGroup.Root>
                        </Form.Control>
                    </Form.Field>
                    <Form.Field {form} name="is_current_sponsor">
                        <Form.Control let:attrs> 
                            <Form.Label>{translate(locale, "sponsorship")}</Form.Label>
                                <RadioGroup.Root 
                                    bind:value={selectedIsCurrentSponsor}
                                    onValueChange={() => {
                                        $formData.is_current_sponsor = selectedIsCurrentSponsor === "true" ? true : false;
                                    }}>
                                    <div class="flex items-center space-x-2">
                                        <RadioGroup.Item value="true" id="r1" />
                                        <Label class="font-normal" for="r1">{translate(locale, "group.state.notSponsoring")}</Label>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <RadioGroup.Item value="false" id="r2" />
                                        <Label class="font-normal" for="r2">{translate(locale, "group.state.sponsoring")}</Label>
                                    </div>
                                    <RadioGroup.Input name="is_current_sponsor" />
                                </RadioGroup.Root>
                        </Form.Control>
                    </Form.Field>
                </div>
            </Card.Content>
        </Card.Root>
    </div>
</form>
