´<script lang="ts">
	import AspectRatio from "@/components/ui/aspect-ratio/aspect-ratio.svelte";
import Card from "@/components/ui/card/card.svelte";
import type { ProfileDataWithImage } from "@/types";


    export let profile:ProfileDataWithImage;
</script>

<a href="/users/{profile.id}">
    <Card class="overflow-hidden flex flex-row p-2 space-x-3">
        {#if profile.image_url}
            <img
                src={profile.image_url}
                alt="user-avatar"
                class="h-16 w-16 rounded-full"
            />
        {:else}
            <img
                src="avatars/user.png"
                alt="user-avatar"
                class="h-16 w-16 rounded-full"
            />
        {/if}
        <div class="flex flex-col justify-center space-y-1">
            <p>{profile.display_name}</p>
            <p class="text-xs text-foreground/60">{profile.region}</p>
        </div>
    </Card>
</a>