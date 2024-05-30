<script lang="ts">
    import * as Card from '$lib/components/ui/card';
    import type { PageData } from "./$types";
	import { Heading, Badge } from 'flowbite-svelte';
	import { parseDate } from '@internationalized/date';

    export let data: PageData;

    function computeAge(birth_date: string) : number {
        let current_year = new Date().getFullYear();
        return current_year - parseDate(birth_date).year
    }

    function computeLabelForCourse(val: boolean) : string {
        switch(val) {
            case true: 
                return "Completado"
            case false:
                return "Não completo"
        }
    }

    function buildWhatsAppLink(phoneNumber: string): string {
		return 'https://wa.me/' + phoneNumber
	}
</script>

<div class="flex flex-col px-40 py-10 gray-background">
    <div class="flex flex-row mb-4 px-2 justify-between">
        <p class="content-center text-lg font-bold">Perfil</p>
    </div>
    <div class="flex flex-row gap-x-8 responsive-div">
        <div class="flex flex-row">
            <Card.Root class="w-fit border-transparent shadow-md h-full responsive-card"> 
                <Card.Content class="flex flex-col pt-4 px-6 w-max"> 
                    <div class="flex flex-col items-center">
                        {#if data.profileData.image_url}
                            <img src={data.profileData.image_url} alt="User avatar" class="w-28 h-28 rounded-full" />
                        {:else}
                            <img class="w-28 h-28 rounded-full" src="/avatars/user.png" alt="User avatar">
                        {/if}
                        <Heading tag="h6" class="mt-3 w-fit"> {data.profileData.display_name} </Heading>
                        {#if data.profileData.sponsorship_state === 'no_group'}
                        <span class="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 w-fit mt-2">Sem grupo</span>
                        {:else if data.profileData.sponsorship_state === 'looking_for_group'}
                            <span class="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 w-fit mt-2">À procura de grupo</span>
                        {:else if data.profileData.sponsorship_state === 'has_group'}
                            <span class="bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300 w-fit mt-2">Pertence a um grupo</span>
                        {/if}
                    </div>
                    {#if data.profileData.region}
                        <p class="text-gray-500 mt-8">Localidade</p>
                        <p>{data.profileData.region}</p>
                    {/if}
                    <p class="text-gray-500 mt-4">Email</p>
                    <p>{data.profileData.email}</p>
                    {#if data.profileData.phone_number}
                        <p class="text-gray-500 mt-4">Telemóvel</p>
                        <p>{data.profileData.phone_number}</p>
                        <p class="text-gray-500 mt-4">Link para WhatsApp</p>
                        <a 
                            rel="external" 
                            href={buildWhatsAppLink(data.profileData.phone_number)}
                            target="_blank" 
                            class="underline"
                        >{buildWhatsAppLink(data.profileData.phone_number)}
                        </a>
                    {/if}
                </Card.Content>
            </Card.Root>
        </div>
        <div class="flex flex-col w-full">
            <Card.Root class="border-transparent shadow-md h-full px-4">
                <Card.Content class="pt-6">
                    <Heading tag="h4">Informação geral</Heading>
                    <p class="mt-6">Sobre mim</p>
                    {#if data.profileData.about_me === ""}
                        <p class="big-text-field text-gray-500 mt-2 text-sm">Não preenchido</p>
                    {:else}
                        <p class="big-text-field text-gray-500 mt-2">{data.profileData.about_me}</p>
                    {/if}
                    <p class="mt-6">Motivação</p>
                    {#if data.profileData.motivation === ""}
                        <p class="big-text-field text-gray-500 mt-2 text-sm">Não preenchido</p>
                    {:else}
                        <p class="big-text-field text-gray-500 mt-2">{data.profileData.motivation}</p>
                    {/if}
                    <div class="container grid grid-cols-2 p-0 mt-6">
                        {#if data.profileData.job}
                            <div>
                                <p>Profissão</p>
                                <p class="text-gray-500">{data.profileData.job}</p>
                            </div>                        
                        {/if}
                        {#if data.profileData.birth_date}
                            <div>
                                <p>Idade</p>
                                <p class="text-gray-500">{computeAge(data.profileData.birth_date)} anos</p>
                            </div>
                        {/if}
                        <div class="mt-6">
                            <p>Curso de formação</p>
                            <p class="text-gray-500">{computeLabelForCourse(data.profileData.completed_course)}</p>
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</div>

<style>
    :global(.big-text-field) {
        max-width: 75ch;
    }
    .gray-background {
        background-color: rgb(249, 250, 251);
    }
    @media (max-width: 900px) {
        :global(.responsive-div) {
            flex-direction: column !important;
        }
        :global(.responsive-card) {
            width: 100% !important;
            margin-bottom: 20px;
        }
    }
</style>
