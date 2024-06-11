<script lang="ts">
	import Modal from "@/components/modal.svelte";
	import PageHeader from "@/components/page-header.svelte";
	import { Button } from "@/components/ui/button";
	import type { PageData } from "./$types";

    export let data: PageData;
    let openModal = false;
</script>

<PageHeader title="Grupos" subtitle="Cria o teu grupo de patrocínio" />
<div class="p-10">
    <Modal 
        bind:openModal
        header="Criar grupo de patrocínio"
        accept="Continuar"
        decline="Cancelar"
        redirectOnAccept="groups/create"
        >     
        <p class="text-gray-500"><strong>Aviso:</strong> 
            Para criar um grupo de patrocínio na plataforma, é necessário que o grupo já esteja registado no CPR.
            Se ainda não efetuou o registo, pode fazê-lo através do link: 
            <a 
                class="underline" 
                rel="external" 
                href="https://www.acomunidade.org/tenho-grupo"
            >
                https://www.acomunidade.org/tenho-grupo
            </a>
        </p>
        <p class="mt-5 mb-4">Para criar um grupo de patrocínio, siga os próximos passos:</p>
        <p class="px-3 mt-1">1. Preencha e submeta o formulário com os dados do grupo</p>
        <p class="px-3 mt-1">2. Adicione o pin do grupo no mapa (só será visível para todos após validação)</p>
        <p class="px-3 mt-1">3. Aguarde que o grupo seja validado pelo administrador</p>
        <p class="mt-4 mb-2">Clique em "Continuar" para preencher o formulário de criação do grupo.</p>
    </Modal>
    {#if !data.group_id}
        <Button 
            variant="default"
            on:click={() => (openModal = true)}
            class="justify-self-end"
            >Criar grupo de patrocínio
        </Button>
    {/if}
</div>