<script lang="ts">
	import PageHeader from "@/components/page-header.svelte";
	import type { PageData } from "./$types";
	import ProfilePreview from "./_components/profile-preview.svelte";
	import { Input } from "@/components/ui/input";
    import { Button } from "@/components/ui/button";
    import Modal from "@/components/modal.svelte";

    export let data: PageData

    let openModal = false;
    let nameSearchTerm = '';
    let regionSearchTerm = '';
    $: filteredProfiles = nameSearchTerm === '' && regionSearchTerm === '' 
                            ? data.profiles 
                            : nameSearchTerm !== '' && regionSearchTerm !== '' 
                                ? data.profiles.filter(profile => 
                                    profile.display_name.toLowerCase().includes(nameSearchTerm.toLowerCase()) 
                                    && profile.region.toLowerCase().includes(regionSearchTerm.toLowerCase()))
                                : nameSearchTerm !== '' && regionSearchTerm === ''
                                    ? data.profiles.filter(profile => profile.display_name.toLowerCase().includes(nameSearchTerm.toLowerCase()))
                                    : data.profiles.filter(profile => profile.region.includes(regionSearchTerm.toLowerCase()))
</script>

<PageHeader title="Membros" subtitle="Conhece a tua comunidade" />
<div class="p-10">
    <Modal 
        bind:openModal
        header="Criar grupo"
        body="Escolhe um nome para o teu grupo"
        >        
    </Modal>
    <div class="container flex flex-row justify-between mb-10">
        <div class="flex flex-row space-x-6">
            <Input 
                placeholder="Procurar por nome..." 
                bind:value={nameSearchTerm}
                class="w-80" />
            <Input
                placeholder="Procurar por região..."
                bind:value={regionSearchTerm}
                class="w-80"/>
        </div>
        <Button 
            variant="default"
            on:click={() => (openModal = true)}
            class="justify-self-end"
        >Criar grupo de patrocínio
        </Button>
    </div>
    <div class="container mx-auto grid grid-cols gap-6">
        {#each filteredProfiles as profile}
            <ProfilePreview {profile}></ProfilePreview>
        {/each}
        {#if filteredProfiles.length === 0}
            <div class="text-center col-span-5 text-gray-500">Não foram encontrados resultados</div>
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



