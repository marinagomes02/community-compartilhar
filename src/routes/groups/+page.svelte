<script lang="ts">
	import Modal from "@/components/modal.svelte";
	import PageHeader from "@/components/page-header.svelte";
	import { Button } from "@/components/ui/button";
	import type { PageData } from "./$types";
	import { ArrowRight, Dot, CircleCheck } from "lucide-svelte";
	import { translate } from "@/utils/translation/translate-util";
	import * as Card from "@/components/ui/card";
    import * as Tabs from '$lib/components/ui/tabs';

    export let data: PageData;

    let locale: string;
    $: locale = data.languagePreference.language;

    function getDistance(userDistance: number): number {
        return Math.round(userDistance * 10 / 1000) / 10;
    }
</script>

<PageHeader title={translate(locale, "Groups")} subtitle={translate(locale, "groups.subtitle")} />
<div class="container pb-10">
    <Tabs.Root value="groups">
        <Tabs.List class="bg-gray-100">
            <Tabs.Trigger value="groups" class="data-[state=active]:bg-gray-800 data-[state=active]:text-white">{translate(locale, "groupsLookingForMembers")}</Tabs.Trigger>
			<Tabs.Trigger value="look-for-group" class="data-[state=active]:bg-gray-800 data-[state=active]:text-white">{translate(locale, "searchGroup")}</Tabs.Trigger>
            <Tabs.Trigger value="register" class="data-[state=active]:bg-gray-800 data-[state=active]:text-white">{translate(locale, "registerGroup")}</Tabs.Trigger>
            {#if data.user_group}
                <Tabs.Trigger value="my-group" class="data-[state=active]:bg-gray-800 data-[state=active]:text-white">{translate(locale, "myGroup")}</Tabs.Trigger>
            {/if}
		</Tabs.List>
		<Tabs.Content value="register">
            <Card.Root>
                <Card.Header class="pb-2">
                    <Card.Title>{translate(locale, "createGroupForm.title")}</Card.Title>
                    <Card.Description> 
                        <div class="mt-2"> 
                            <p>
                                <strong>{translate(locale, "warning")}:</strong> 
                                {translate(locale, "createGroupModal.description")}
                            </p>
                            <p>
                                {translate(locale, "createGroupModal.description2")}
                                <a 
                                    class="underline hover:text-gray-600" 
                                    rel="external" 
                                    href="https://www.acomunidade.org/tenho-grupo"
                                >
                                    https://www.acomunidade.org/tenho-grupo
                                </a>
                            </p>
                        </div>
                    </Card.Description>
                </Card.Header>
                <Card.Content>
                    <div class="w-full justify-center items-center">
                        <p class="mt-4 mb-3 text-sm">{translate(locale, "createGroupModal.inst1")}</p>
                        <div class="w-full flex flex-col pl-5 space-y-1"> 
                            <div class="flex flex-row items-center space-x-2">
                                <CircleCheck size="16" color="rgb(42,157, 143)"/> 
                                <span class="text-sm">{translate(locale, "createGroupModal.inst2")}</span>
                            </div>
                            <div class="flex flex-row items-center space-x-2">
                                <CircleCheck size="16" color="rgb(42,157, 143)"/> 
                                <span class="text-sm">{translate(locale, "createGroupModal.inst3")}</span>
                            </div>
                            <div class="flex flex-row items-center space-x-2">
                                <CircleCheck size="16" color="rgb(42,157, 143)"/> 
                                <span class="text-sm">{translate(locale, "createGroupModal.inst4")}</span>
                            </div>
                        </div>
                        {#if data.user_group?.id}
                            <p class="mt-6 text-sm font-semibold">{translate(locale, "createGroupModal.alreadyHaveGroup")}</p>
                        {:else}
                            <p class="mt-6 text-sm font-semibold">{translate(locale, "createGroupModal.inst5")}</p>
                            <div class="flex flex-row justify-end pr-8">
                                <Button 
                                    variant="default"
                                    href="/groups/create"
                                    class="bg-cien-600"
                                >
                                    {translate(locale, "createGroupModal.accept")}
                                    <ArrowRight class="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        {/if}
                    </div>
                </Card.Content>
            </Card.Root>			
		</Tabs.Content>
		<Tabs.Content value="look-for-group">
            <Card.Root>
                <Card.Header>
                    <Card.Title>{translate(locale, "nearbyUsersLookingForGroup")}</Card.Title>
                    <Card.Description>
                        {#if data.near_by_users.length > 0}
                            <div class="mt-1" >
                                <p>{translate(locale, "youHave")} <strong>{data.near_by_users.length} {translate(locale, "people")}</strong> {translate(locale, "nearYourLocation")}</p>
                                <p>{translate(locale, "meetThem")}</p>
                            </div>
                        {:else}
                            <p class="mt-1">{translate(locale, "noUsersNearby")}</p>
                        {/if}
                        </Card.Description>
                    </Card.Header>
                    <Card.Content> 
                        {#if data.near_by_users.length > 0}
                            <h5 class="mb-2"> {translate(locale, "peopleNearYou")} </h5>
                            <div class="grid grid-cols-2 w-fit items-center gap-x-7 row-border">
                                {#each data.near_by_users as user}
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
        <Tabs.Content value="groups">
            <Card.Root>
                <Card.Header>
                    <Card.Title>{translate(locale, "groupsLookingForMembers")}</Card.Title>
                    <Card.Description>
                        {#if data.available_groups.length > 0}
                            <p class="mt-1">{translate(locale, "exist")} <strong>{data.available_groups.length}</strong> {translate(locale, "groupsLookingForMembersDescription")}</p>
                        {:else}
                            <p class="mt-1">{translate(locale, "noGroupsLookingForMembers")}</p>
                        {/if}
                    </Card.Description>
                </Card.Header>
                <Card.Content>
                    <div class="grid grid-cols-2 w-fit items-center gap-x-7 row-border">
                        {#each data.available_groups as group}
                            <div class="w-fit flex flex-row items-center p-2 space-x-3">
                                <img src="/avatars/group.png" alt="group" class="w-9 h-9 rounded-full"/>
                                <div class="flex flex-col">
                                    <p class="text-sm font-semibold">{group.name}</p>
                                    <div class="flex flex-row items-center">
                                        <p class="text-xs text-gray-500 font-semibold">{group.region}</p>
                                        <Dot class="w-4 h-4 text-gray-500"></Dot>
                                        <p class="text-xs text-gray-500">{group.members.length} {translate(locale, "members")}</p>
                                    </div>
                                </div>

                            </div>
                            <Button class="text-xs h-8 text-cien-600 w-fit justify-self-center" size="sm" variant="link" href="/users/{group.leader}">
                                {translate(locale, "goToLeaderProfile")}
                            </Button>
                        {/each}
                    </div>
                </Card.Content>
            </Card.Root>
        </Tabs.Content>
        <Tabs.Content value="my-group">
            <Card.Root>
                <Card.Header>
                    <Card.Title>{translate(locale, "myGroup")}</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div class="grid grid-cols-2 w-fit items-center gap-x-7 row-border">
                        <div class="w-fit flex flex-row items-center p-2 space-x-3">
                            <img src="/avatars/group.png" alt="group" class="w-9 h-9 rounded-full"/>
                            <div class="flex flex-col">
                                <p class="text-sm font-semibold">{data.user_group?.name}</p>
                                <div class="flex flex-row items-center">
                                    <p class="text-xs text-gray-500 font-semibold">{data.user_group?.region}</p>
                                    <Dot class="w-4 h-4 text-gray-500"></Dot>
                                    <p class="text-xs text-gray-500">{data.user_group?.members.length} {translate(locale, "members")}</p>
                                </div>
                            </div>

                        </div>
                        <Button class="text-xs h-8 text-cien-600 w-fit justify-self-center" size="sm" variant="link" href="/groups/edit">
                            {translate(locale, "editGroupForm.title")}
                        </Button>
                    </div>
                </Card.Content>
            </Card.Root>
        </Tabs.Content>
	</Tabs.Root>
</div>