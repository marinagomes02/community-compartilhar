<script lang="ts">
	import { Button } from "@/components/ui/button";
	import {Card } from "@/components/ui/card";
	import type { GroupDataMap } from "@/types";
	import { translate } from "@/utils/translation/translate-util";
	import { Dot } from "lucide-svelte";

    export let group: GroupDataMap;
    export let locale: string;

    function getLeaderId(): string {
        const leader = group.members.find(member => member.email === group.leader);
        return leader ? leader.id : ""; 
    }
</script>
<Card class="w-44">
    <div class="flex flex-col items-center py-2">
        <img
                src="/avatars/group.png"
                alt="group-profile"
                class="h-10 w-10 rounded-full"

        />
        <p class="text-sm">{group.name}</p>
        {#if group.is_complete}
            <p class="flex flex-row w-full justify-center items-center mt-2">
                <span class="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 w-fit mt-1">{translate(locale, "group.complete")}</span>
            </p>
        {:else}
            <p class="flex flex-row w-full justify-center items-center mt-2">
                <span class="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 w-fit mt-1">{translate(locale, "group.lookingForMembers")}</span>
            </p>
        {/if}
        <div class="flex flex-row items-center mt-1">
            <p class="flex flex-row items-center text-xs text-gray-500">
                {group.region}
            </p>
            <Dot class="w-3 h-3 text-gray-500"></Dot>
            <p class="flex flex-row items-center text-gray-500">
                {group.members.length} {translate(locale, "members")}
            </p>
        </div>
        <p class="flex flex-row items-center mt-2 mb-1">
            <Button size="sm" variant="default" rel="external" href="/users/{getLeaderId()}" class="bg-cien-600 text-xs h-7 hover:bg-cien-800">
                {translate(locale, "goToLeaderProfile")}
            </Button>
        </p>
    </div>
</Card>