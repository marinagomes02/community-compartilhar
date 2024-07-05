<script lang="ts">
	import Modal from "@/components/modal.svelte";
	import PageHeader from "@/components/page-header.svelte";
	import { Button } from "@/components/ui/button";
	import type { PageData } from "./$types";
	import { Dot } from "lucide-svelte";
	import { translate } from "@/utils/translation/translate-util";

    export let data: PageData;

    let locale: string;
    $: locale = data.languagePreference.language;

    let openCreateModal = false;
    let openSearchModal = false;
</script>

<PageHeader title="Grupos" subtitle="Regista o teu grupo de patrocínio" />
<div class="p-10">
    <Modal 
        openModal={openCreateModal} 
        header={translate(locale, "createGroupModal.header")}
        accept={translate(locale, "createGroupModal.accept")}
        decline={translate(locale, "createGroupModal.decline")}
        redirectOnAccept="groups/create"
        >     
        <p class="text-gray-500"><strong>{translate(locale, "warning")}:</strong> 
            {translate(locale, "createGroupModal.description")}
            <a 
                class="underline" 
                rel="external" 
                href="https://www.acomunidade.org/tenho-grupo"
            >
                https://www.acomunidade.org/tenho-grupo
            </a>
        </p>
        <p class="mt-5 mb-4">{translate(locale, "createGroupModal.instr1")}</p>
        <p class="px-3 mt-1">{translate(locale, "createGroupModal.instr2")}</p>
        <p class="px-3 mt-1">{translate(locale, "createGroupModal.instr3")}</p>
        <p class="px-3 mt-1">{translate(locale, "createGroupModal.instr4")}</p>
        <p class="mt-4 mb-2">{translate(locale, "createGroupModal.instr5")}</p>
    </Modal>
    <Modal 
        openModal={openSearchModal} 
        header="Procurar grupo de patrocínio"
        accept="Continuar"
        decline="Cancelar"
        redirectOnAccept="groups/join/create"
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
        >{translate(locale, "createGroupModal.header")}
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