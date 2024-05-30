<script lang="ts">
	import PageHeader from "@/components/page-header.svelte";
	import type { PageData } from "./$types";
	import ProfilePreview from "./_components/profile-preview.svelte";
	import { CloseButton } from "flowbite-svelte";
	import { Input } from "@/components/ui/input";

    export let data: PageData

    let searchTerm = '';
    $: filteredProfiles = data.profiles.filter(profile => profile.display_name.toLowerCase().includes(searchTerm.toLowerCase()));
</script>

<PageHeader title="Membros" subtitle="Conhece a tua comunidade" />
<div class="p-10">
    <div class="container flex flex-row space-x-3">
        <Input 
            placeholder="⌕ Procurar..." 
            bind:value={searchTerm}
            class="w-80 mb-10">
        </Input>
    </div>
    <div class="container mx-auto grid grid-cols gap-6">
        {#if searchTerm === ''}
            {#each data.profiles as profile}
                <ProfilePreview {profile}></ProfilePreview>
            {/each}
        {:else}
            {#if filteredProfiles.length === 0}
                <div class="text-center col-span-5 text-gray-500">Não foram encontrados resultados</div>
            {/if}
            {#each filteredProfiles as profile}
                <ProfilePreview {profile}></ProfilePreview>
            {/each} 
        {/if}
    </div>
</div>

<style>
    :global(.grid-cols) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 250px));
    gap: 20px;
  }
</style>



