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

    let openCreateModal = false;
    let openSearchModal = false;

    function getDistance(userDistance: number): number {
        return Math.round(userDistance * 10 / 1000) / 10;
    }
</script>

<PageHeader title="Grupos" subtitle="Regista o teu grupo de patrocínio" />
<div class="container pb-10">
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
    <Tabs.Root value="look-for-group">
        <Tabs.List>
            <Tabs.Trigger value="register">{translate(locale, "general")}</Tabs.Trigger>
			<Tabs.Trigger value="look-for-group">{translate(locale, "groupsModeration.title")}</Tabs.Trigger>
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
                        <p class="mt-4 mb-2">{translate(locale, "createGroupModal.inst1")}</p>
                        <div class="w-full flex flex-col pl-2 space-y-1"> 
                            <div class="flex flex-row items-center space-x-2">
                                <CircleCheck size="16" color="rgb(42,157, 143)"/> 
                                <span>{translate(locale, "createGroupModal.inst2")}</span>
                            </div>
                            <div class="flex flex-row items-center space-x-2">
                                <CircleCheck size="16" color="rgb(42,157, 143)"/> 
                                <span>{translate(locale, "createGroupModal.inst3")}</span>
                            </div>
                            <div class="flex flex-row items-center space-x-2">
                                <CircleCheck size="16" color="rgb(42,157, 143)"/> 
                                <span>{translate(locale, "createGroupModal.inst4")}</span>
                            </div>
                        </div>
                        <p class="mt-6">{translate(locale, "createGroupModal.inst5")}</p>
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
                    </div>
                </Card.Content>
            </Card.Root>			
		</Tabs.Content>
		<Tabs.Content value="look-for-group">
            <Card.Root>
                <Card.Header>
                    <Card.Title>Nearby users looking for a group</Card.Title>
                    <Card.Description>
                        {#if data.near_by_users.length > 0}
                            <div class="mt-1" >
                                <p>You have <strong>{data.near_by_users.length} users</strong>  near your location that are looking for a new sposorship group.</p>
                                <p>Meet them below and create a sponsorship group to help another refugee family! </p>
                            </div>
                            {:else}
                            <p class="mt-1">There are no users near your location looking for a new sponsorship group, at the moment.</p>
                            {/if}
                        </Card.Description>
                    </Card.Header>
                    <Card.Content> 
                        {#if data.near_by_users.length > 0}
                            <h5 class="mb-2"> People near you: </h5>
                            <div class="grid grid-cols-2 w-fit items-center gap-x-7 row-border">
                                {#each data.near_by_users as user}
                                    <div class="w-fit flex flex-row items-center p-2 space-x-3">
                                        <img src={user.image_url} alt="user" class="w-9 h-9 rounded-full"/>
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
	</Tabs.Root>
</div>

<style>
    :global(.strong-icon) {
        stroke-width: 8px;
    }
</style>