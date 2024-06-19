<script lang="ts">
	import Modal from "@/components/modal.svelte";
	import PageHeader from "@/components/page-header.svelte";
	import { Button } from "@/components/ui/button";
	import type { PageData } from "./$types";
	import { Dot } from "lucide-svelte";

    export let data: PageData;
    let openCreateModal = false;
    let openSearchModal = false;
</script>

<PageHeader title="Grupos" subtitle="Cria o teu grupo de patrocínio" />
<div class="p-10">
    <div class="w-fit mb-4 p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
        <span class="font-medium">Pedido para juntar a grupo:</span>
        O seu pedido para encontrar um grupo de patrocínio foi submetido com sucesso! Estamos à procura de mais membros na sua região para formar um grupo de patrocínio comunitário :)
    </div>
    <Modal 
        openModal={openCreateModal} 
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
    <Modal 
        openModal={openSearchModal} 
        header="Procurar grupo de patrocínio"
        accept="Continuar"
        decline="Cancelar"
        redirectOnAccept="groups/join"
        >  
        <p class="mb-3"> Quer ser patrocinador mas não tem grupo? Aqui, pode fazer um pedido para se juntar a outros num grupo.</p>
        <p class="text-black-500 mb-1"><strong>Informação:</strong> 
        <p class="flex flex-row pl-2 mb-1"><Dot class="mr-2 strong-icon w-fit"/> Para fazer parte de um grupo, terá que preencher o seguinte formulário. Quando houver outros participantes disponíveis, a plataforma criará o grupo, que deverá ser aprovado pelo CPR.</p>   
        <p class="flex flex-row pl-2 mb-1"><Dot class="mr-2 strong-icon w-fit"/> Para formar um grupo equilibrado, é necessário reunir todas as funções necessárias para o patrocínio, pelo que será agrupado com candidatos com funcções complementares</p>
        <p class="flex flex-row pl-2 mb-1"><Dot class="mr-2 strong-icon w-fit"/> Apenas serão procuradas pessoas dentro da distância que definir, para garantir apoio presencial à família de refugiados. Certifique-se de ter definido o seu pin no mapa da plataforma.</p>
    </Modal>
    <Button 
        disabled={data.group_id}
        variant="default"
        on:click={() => (openCreateModal = true)}
        class="justify-self-end"
        >Criar grupo de patrocínio
    </Button>
    <Button 
        disabled={data.group_id || data.request_id}
        variant="default"
        on:click={() => (openSearchModal = true)}
        class="justify-self-end"
        >Procurar grupo de patrocínio
    </Button>
</div>

<style>
    :global(.strong-icon) {
        stroke-width: 8px;
    }
</style>