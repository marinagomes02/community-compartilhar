<script lang="ts">
	import { Button } from "@/components/ui/button";
	import {Card } from "@/components/ui/card";
	import type { GroupDataMap } from "@/types";
	import { Dot, LockKeyhole, UserRound, Users } from "lucide-svelte";

    export let group: GroupDataMap;

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
                <span class="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 w-fit mt-1">Grupo completo</span>
            </p>
        {:else}
            <p class="flex flex-row w-full justify-center items-center">
                <span class="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 w-fit mt-1">À procura de membros</span>
            </p>
        {/if}
        <div class="flex flex-row items-center space-x-1 mt-3">
            <p class="flex flex-row items-center text-xs text-gray-500">
                {group.region}
            </p>
            <Dot class="w-3 h-3 text-gray-500"></Dot>
            <p class="flex flex-row items-center text-gray-500">
                {group.members_count[0].count} membros
            </p>
        </div>
    </div>
</Card>