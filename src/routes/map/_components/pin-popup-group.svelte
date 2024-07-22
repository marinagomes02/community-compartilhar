<script lang="ts">
	import { Button } from "@/components/ui/button";
	import {Card } from "@/components/ui/card";
	import type { GroupDataMap } from "@/types";
	import { translate } from "@/utils/translation/translate-util";
	import { Dot } from "lucide-svelte";

    export let group: GroupDataMap;
    export let locale: string;
    const leaderPhoneNumber = getLeaderPhoneNumber();

    function showLinkLeader(): boolean | undefined {
        return group.show_links.find(link => link.email === group.leader)?.show_link;
    }

    function getLeaderPhoneNumber(): string {
        const leader = group.show_links.find(link => link.email === group.leader);
        return leader ? leader.phone_number : "";
    }

    function buildWhatsAppLink(phoneNumber: string): string {
		return 'https://wa.me/' + phoneNumber
	}
</script>
<Card class="w-52">
    <div class="flex flex-col items-center px-4 py-3">
        <img
                src="/avatars/group.png"
                alt="group-profile"
                class="h-10 w-10 rounded-full"

        />
        <p class="text-sm mt-2">{group.name}</p>
        {#if group.is_complete}
            <p class="flex flex-row w-full justify-center items-center">
                <span class="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 w-fit mt-1">{translate(locale, "group.complete")}</span>
            </p>
        {:else}
            <p class="flex flex-row w-full justify-center items-center">
                <span class="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 w-fit mt-1">{translate(locale, "group.lookingForMembers")}</span>
            </p>
        {/if}
        <div class="flex flex-row items-center space-x-1 mt-2">
            <p class="flex flex-row items-center text-xs text-gray-500">
                {group.region}
            </p>
            <Dot class="w-3 h-3 text-gray-500"></Dot>
            <p class="flex flex-row items-center text-gray-500">
                {group.members_count[0].count} {translate(locale, "members")}
            </p>
        </div>
        {#if !group.is_complete && showLinkLeader() && leaderPhoneNumber !== ""}
            <p class="flex flex-row items-center mt-2">
                <Button class="text-xs" size="sm" variant="outline" rel="external" href={buildWhatsAppLink(leaderPhoneNumber)}>
                    {translate(locale, "message")}
                </Button>
            </p>
        {/if}
    </div>
</Card>