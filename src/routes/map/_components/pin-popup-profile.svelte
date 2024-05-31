<script lang="ts">
	import { Button } from "@/components/ui/button";
	import { Card } from "@/components/ui/card";
	import type { UserWithImage } from "@/types";
	import { ChevronRight, Hammer, MapPin, MessageCircleMore } from "lucide-svelte";

    export let user: UserWithImage;

    function getAgeFromBirthDate(dateString: string): number {
		var today = new Date();
		var birthDate = new Date(dateString);
		var age = today.getFullYear() - birthDate.getFullYear();
		var m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	}

	function buildWhatsAppLink(phoneNumber: string): string {
		return 'https://wa.me/' + phoneNumber
	}
</script>

<Card class="w-52">
    <div class="flex flex-col items-center px-4 py-3">
        {#if user.image_url}
            <img
                src={user.image_url}
                alt="user-profile-avatar"
                class="h-14 w-14 rounded-full"
            />
        {:else}
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png"
                alt="user-profile"
                class="h-10 w-10 rounded-full"
            />
        {/if}
        {#if user.sponsorship_state === 'looking_for_group'}
            <p class="flex flex-row w-full justify-center items-center">
                <span class="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 w-fit mt-1">À procura de grupo</span>
            </p>
        {:else if user.sponsorship_state === 'has_group'}
            <p class="flex flex-row w-full justify-center items-center">
                <span class="bg-pink-100 text-pink-800 text-xs px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 w-fit mt-1">Pertence a um grupo</span>
            </p>
        {:else if user.sponsorship_state ==='no_group'}
            <p class="flex flex-row w-full justify-center items-center">
                <span class="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 w-fit mt-1">Sem grupo</span>
            </p>
        {/if}
        <p class="text-sm mt-2">{user.display_name}</p>
        <p class="flex flex-row items-center text-xs text-gray-500">
            {user.region}
        </p>
        <div class="flex flex-row justify-between w-full mt-4">
            {#if user.phone_number}
                <p class="flex flex-row items-center">
                    <Button class="text-xs" size="sm" variant="outline" rel="external" href={buildWhatsAppLink(user.phone_number)}>
                        Mensagem
                    </Button>
                </p>										
            {/if}
            <Button class="text-xs btn-primary" size="sm" variant="default" href="/users/{user.id}">
                Ver perfil
            </Button>
        </div>
    </div>
</Card>

<style>
    :global(.btn-primary) {
        background-color: rgb(100, 186, 156) !important;
        color: white !important;
    }
    :global(.btn-primary:hover) {
        background-color: rgb(84, 147, 125) !important;
        color: white !important;
    }
</style>