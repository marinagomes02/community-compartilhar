<script lang="ts">
	import PageHeader from "@/components/page-header.svelte";
	import type { PageData } from "./$types";
	import ProfilePreview from "./_components/profile-preview.svelte";


    export let data: PageData
</script>

<PageHeader title="Membros" subtitle="Conhece a tua comunidade" />
<div class="container mx-auto grid grid-cols-5 gap-6">
    {#each data.profiles as profile}
        <ProfilePreview {profile}></ProfilePreview>
    {/each}
</div>



