<script lang="ts">
	import PageHeader from "@/components/page-header.svelte";
	import type { PageData } from "./$types";
	import ProfilePreview from "./_components/profile-preview.svelte";
	import { Input } from "@/components/ui/input";
	import { Checkbox } from "@/components/ui/checkbox";
	import { Label } from "@/components/ui/label";
	import { translate } from "@/utils/translation/translate-util";
    import * as Card from '$lib/components/ui/card';
    import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from "@/components/ui/button";

    export let data: PageData

    let locale: string = data.languagePreference.language;
    $: locale = data.languagePreference.language;

    let show_only_looking_for_group = false;
    let nameSearchTerm = '';
    let districtSearchTerm = '';
    $: filteredByState = show_only_looking_for_group ? data.profiles.filter(profile => profile.sponsorship_state === "looking_for_group") : data.profiles;
    $: filteredProfiles = nameSearchTerm === '' && districtSearchTerm === '' 
                            ? filteredByState // if there are no text filters
                            : nameSearchTerm !== '' && districtSearchTerm !== '' // if both text filters are active, filter by both
                                ? filteredByState.filter(profile => 
                                    profile.display_name.toLowerCase().includes(nameSearchTerm.toLowerCase()) 
                                    && profile.district?.toLowerCase().includes(districtSearchTerm.toLowerCase()))
                                : nameSearchTerm !== '' && districtSearchTerm === '' // if only name filter is active, filter by name
                                    ? filteredByState.filter(profile => profile.display_name.toLowerCase().includes(nameSearchTerm.toLowerCase()))
                                    : filteredByState.filter(profile => profile.district?.toLowerCase().includes(districtSearchTerm.toLowerCase())); // if only region filter is active, filter by region

    function getDistance(userDistance: number): number {
        return Math.round(userDistance * 10 / 1000) / 10;
    }
</script>

<PageHeader title={translate(locale, "Members")} subtitle={translate(locale, "members.title")}  />
<div class="container p-10 pt-0">
    <Tabs.Root value="all-members">
        <Tabs.List class="bg-gray-100">
            <Tabs.Trigger value="all-members" class="data-[state=active]:bg-gray-800 data-[state=active]:text-white">{translate(locale, "allMembers")}</Tabs.Trigger>
            <Tabs.Trigger value="nearby-members" class="data-[state=active]:bg-gray-800 data-[state=active]:text-white">{translate(locale, "nearbyMembers")}</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="all-members">
            <Card.Root class="border-none shadow-none">
                <Card.Content class="pt-6"> 
                    <div class="flex space-x-2 mb-4">
                        <p class="text-gray-500 font-semibold text-sm">{translate(locale, "Members")}:</p>
                        <p class="text-gray-500 text-sm">{filteredProfiles.length}</p>
                    </div>
                    <div class="flex flex-row mb-10 space-x-6">
                        <Input 
                            placeholder={translate(locale, "search.name")}
                            bind:value={nameSearchTerm}
                            class="w-68 h-8" />
                        <Input
                            placeholder={translate(locale, "search.district")}
                            bind:value={districtSearchTerm}
                            class="w-68 h-8"/>
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
                </Card.Content>
            </Card.Root>
        </Tabs.Content>
        <Tabs.Content value="nearby-members">
            <Card.Root class="border-none shadow-none">
                <Card.Header>
                    <Card.Title>{translate(locale, "nearbyUsersLookingForGroup")}</Card.Title>
                    <Card.Description>
                        {#if data.nearby_users.length > 0}
                            <div class="mt-1" >
                                <p>{translate(locale, "youHave")} <strong>{data.nearby_users.length} {translate(locale, "people")}</strong> {translate(locale, "nearYourLocation")}</p>
                                <p>{translate(locale, "meetThem")}</p>
                            </div>
                        {:else}
                            <p class="mt-1">{translate(locale, "noUsersNearby")}</p>
                        {/if}
                    </Card.Description>
                </Card.Header>
                <Card.Content> 
                    {#if data.nearby_users.length > 0}
                        <h5 class="mb-2"> {translate(locale, "peopleNearYou")} </h5>
                        <div class="grid grid-cols-2 w-fit items-center gap-x-7 row-border">
                            {#each data.nearby_users as user}
                                <div class="w-fit flex flex-row items-center p-2 space-x-3">
                                    <img src={user.image_url ? user.image_url : "/avatars/user.png"} alt="user" class="w-9 h-9 rounded-full"/>
                                    <div class="flex flex-col">
                                        <p class="text-sm font-semibold">{user.name}</p>
                                        <p class="text-xs text-gray-500">{getDistance(user.distance)} km</p>
                                    </div>
                                </div>
                                <Button class="text-xs h-8 text-cien-600 w-fit justify-self-center" size="sm" variant="link" href="/users/{user.id}">
                                    {translate(locale, "seeProfile")}
                                </Button>
                            {/each}
                        </div>
                    {/if}
                </Card.Content>            
            </Card.Root>
        </Tabs.Content>
    </Tabs.Root>
</div>
<style>
    :global(.grid-cols) {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(210px, 210px));
        gap: 10px;
    }
</style>



