<script lang="ts">
	import PageHeader from "@/components/page-header.svelte";
	import type { PageData } from "./$types";
	import ProfilePreview from "./_components/profile-preview.svelte";
	import { Input } from "@/components/ui/input";
	import { Checkbox } from "@/components/ui/checkbox";
	import { Label } from "@/components/ui/label";
	import { translate } from "@/utils/translation/translate-util";

    export let data: PageData

    let locale: string = data.languagePreference.language;
    $: locale = data.languagePreference.language;

    let show_only_looking_for_group = false;
    let nameSearchTerm = '';
    let regionSearchTerm = '';
    $: filteredByState = show_only_looking_for_group ? data.profiles.filter(profile => profile.sponsorship_state === "looking_for_group") : data.profiles;
    $: filteredProfiles = nameSearchTerm === '' && regionSearchTerm === '' 
                            ? filteredByState // if there are no text filters
                            : nameSearchTerm !== '' && regionSearchTerm !== '' // if both text filters are active, filter by both
                                ? filteredByState.filter(profile => 
                                    profile.display_name.toLowerCase().includes(nameSearchTerm.toLowerCase()) 
                                    && profile.region.toLowerCase().includes(regionSearchTerm.toLowerCase()))
                                : nameSearchTerm !== '' && regionSearchTerm === '' // if only name filter is active, filter by name
                                    ? filteredByState.filter(profile => profile.display_name.toLowerCase().includes(nameSearchTerm.toLowerCase()))
                                    : filteredByState.filter(profile => profile.region.toLowerCase().includes(regionSearchTerm.toLowerCase())); // if only region filter is active, filter by region
</script>

<PageHeader title={translate(locale, "Members")} subtitle={translate(locale, "members.title")}  />
<div class=" container p-10">
    <div class="flex space-x-2 mb-2">
        <p class="text-gray-500 font-semibold text-sm">{translate(locale, "Members")}:</p>
        <p class="text-gray-500 text-sm">{filteredProfiles.length}</p>
    </div>
    <div class="flex flex-row mb-10 space-x-6">
        <Input 
            placeholder={translate(locale, "search.name")}
            bind:value={nameSearchTerm}
            class="w-80" />
        <Input
            placeholder={translate(locale, "search.locality")}
            bind:value={regionSearchTerm}
            class="w-80"/>
        <div class="flex flex-row space-x-2 p-1 items-end">
            <Checkbox name="show_only_looking_for_group" id="checkbox-1" class="border-gray-300 self-center" bind:checked={show_only_looking_for_group}></Checkbox>
            <Label class="font-normal text-sm self-center  text-gray-500" for="checkbox-1">{translate(locale, "members.showMembersLookingForGroup")} </Label>
        </div>
    </div>
    <div class="mx-auto grid grid-cols">
        {#each filteredProfiles as profile}
            <ProfilePreview {profile}></ProfilePreview>
        {/each}
        {#if filteredProfiles.length === 0}
            <div class="text-center col-span-5 text-gray-500">{translate(locale, "noResults")}</div>
        {/if}
    </div>
</div>
<style>
    :global(.grid-cols) {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 260px));
        gap: 20px;
    }
</style>



