<script lang="ts">
	import { Button } from "@/components/ui/button";
	import { Card } from "@/components/ui/card";
	import type { UserWithImage } from "@/types";
	import { translate } from "@/utils/translation/translate-util";

    export let user: UserWithImage;
    export let locale: string;

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
                src="/avatars/user.png"
                alt="user-profile"
                class="h-10 w-10 rounded-full"
            />
        {/if}
        {#if user.sponsorship_state === 'looking_for_group'}
            <p class="flex flex-row w-full justify-center items-center">
                <span class="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 w-fit mt-1">
                    {translate(locale, "sponsorshipState.lookingForGroup")}
                </span>
            </p>
        {:else if user.sponsorship_state === 'has_group'}
            <p class="flex flex-row w-full justify-center items-center">
                <span class="bg-pink-100 text-pink-800 text-xs px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 w-fit mt-1">
                    {translate(locale, "sponsorshipState.hasGroup")}
                </span>
            </p>
        {:else if user.sponsorship_state ==='no_group'}
            <p class="flex flex-row w-full justify-center items-center">
                <span class="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 w-fit mt-1">
                    {translate(locale, "sponsorshipState.noGroup")}
                </span>
            </p>
        {/if}
        <p class="text-sm mt-2">{user.display_name}</p>
        <p class="flex flex-row items-center text-xs text-gray-500">
            {user.region}
        </p>
        <div class="flex flex-row justify-center items-center w-full mt-4 space-x-6">
            {#if user.phone_number && user.show_link}
                <p class="flex flex-row items-center">
                    <Button class="text-xs" size="sm" variant="outline" rel="external" href={buildWhatsAppLink(user.phone_number)}>
                        {translate(locale, "message")}
                    </Button>
                </p>										
            {/if}
            <Button class="bg-cien-600 text-xs h-7 hover:bg-cien-800" size="sm" variant="default" href="/users/{user.id}">
                {translate(locale, "seeProfile")}
            </Button>
        </div>
    </div>
</Card>