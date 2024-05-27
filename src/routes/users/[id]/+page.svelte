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

<div class="flex flex-col px-40 py-10">
    <div class="flex flex-row mb-4 px-2 justify-between">
        <p class="content-center text-lg font-bold">Perfil</p>
    </div>
    <div class="flex flex-row gap-x-8">
        <div class="flex flex-row">
            <Card.Root class="w-fit"> 
                <Card.Content class="flex flex-col pt-4 pb-0 px-6 w-max"> 
                    <div class="flex flex-col w-fit">
                        {#if data.profileData.image_url}
                            <img src={data.profileData.image_url} alt="User avatar" class="w-28 h-28 rounded-full" />
                        {:else}
                            <img class="w-28 h-28 rounded-full" src="/avatars/user.png" alt="User avatar">
                        {/if}
                        <p class="text-lg mb-2"> {data.profileData.display_name} </p>
                    </div>
                    {#if data.profileData.sponsorship_state === 'no_group'}
                        <span class="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 w-fit">Sem grupo</span>
                    {:else if data.profileData.sponsorship_state === 'looking_for_group'}
                        <span class="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 w-fit">À procura de grupo</span>
                    {:else if data.profileData.sponsorship_state === 'has_group'}
                        <span class="bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300 w-fit">Pertence a um grupo</span>
                    {/if}
                    <p class="text-gray-500">Localidade</p>
                    <p>{data.profileData.region}</p>
                    <p class="text-gray-500">Email</p>
                    <p>{data.profileData.email}</p>
                    {#if data.profileData.phone_number}
                        <p class="text-gray-500">Telemóvel</p>
                        <p>{data.profileData.phone_number}</p>
                        <p class="text-gray-500">Link para WhatsApp</p>
                        <p>{buildWhatsAppLink(data.profileData.phone_number)}</p>
                    {/if}
                </Card.Content>
            </Card.Root>
        </div>
        <div class="flex flex-col w-full">
            <Card.Root>
                <Card.Content class="space-y-4 pt-6">
                    <Heading tag="h4">Informação geral</Heading>
                    <p>Sobre mim</p>
                    <p class="big-text-field text-gray-500">{data.profileData.about_me}</p>
                    <p>Motivação</p>
                    <p class="big-text-field text-gray-500">{data.profileData.motivation}</p>
                    <div class="container grid grid-cols-2">
                        {#if data.profileData.job}
                            <div>
                                <p>Profissão</p>
                                <p>{data.profileData.job}</p>
                            </div>                        
                        {/if}
                        {#if data.profileData.birth_date}
                            <div>
                                <p>Idade</p>
                                <p>{computeAge(data.profileData.birth_date)}</p>
                            </div>
                        {/if}
                        <div>
                            <p>Curso de formação</p>
                            <p>{computeLabelForCourse(data.profileData.completed_course)}</p>
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</div>

<style>
    :global(.big-text-field) {
        width: 80ch;
    }
</style>
