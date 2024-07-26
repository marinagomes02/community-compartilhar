<script lang="ts">
	import { NotificationType, type UserNotification } from "@/types";
	import { BellIcon, DotIcon } from "lucide-svelte";
	import * as DropdownMenu  from "../../lib/components/ui/dropdown-menu";
	import { Button } from "../../lib/components/ui/button";
	import { translate } from "@/utils/translation/translate-util";
	import { fieldProxy, superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
	import { markAsReadSchema, type MarkAsReadSchema } from "../../lib/schemas/notifications";
	import { zodClient } from "sveltekit-superforms/adapters";
    import { user_notifications } from "../../stores/notifications";
	import { onDestroy } from "svelte";
    
    export let locale: string;
    export let markAsReadForm : SuperValidated<Infer<MarkAsReadSchema>>;

    const form = superForm(markAsReadForm, {
        dataType: 'json',
        validators: zodClient(markAsReadSchema),
    });
    const { form: formData, enhance, submitting} = form
    let notifications: UserNotification[] = [];
    let notification_ids_proxy = fieldProxy(formData, 'notification_ids')
    
    
    const unsubscribe = user_notifications.subscribe((value: UserNotification[]) => {
        notifications = value;
    }); 
    let notification_ids: string[] = notifications
        .filter((n) => !n.is_read)
        .map((n) => n.id);

    $: notification_ids = notifications
        .filter((n) => !n.is_read)
        .map((n) => n.id);
    $: $notification_ids_proxy = notification_ids
    
    $: console.log(notifications);
    $: console.log("notification_ids:", notification_ids);
    $: unreadCount = notifications.filter((notification) => !notification.is_read).length;

    function computeTimeAgoStr(created_at: string): string {
        const now = Date.now();
        const createdTime = new Date(created_at).getTime();
        const diffInSeconds = Math.floor((now - createdTime) / 1000);

        if (diffInSeconds < 60) return `${translate(locale, "há")} ${diffInSeconds} ${translate(locale, "seconds")} ${translate(locale, "ago")}`;

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${translate(locale, "há")} ${diffInMinutes} ${translate(locale, "minutes")} ${translate(locale, "ago")}`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${translate(locale, "há")} ${diffInHours} ${translate(locale, "hours")} ${translate(locale, "ago")}`;

        const diffInDays = Math.floor(diffInHours / 24);
        return `${translate(locale, "há")} ${diffInDays} ${translate(locale, "days")} ${translate(locale, "ago")}`;
    }

    function isBadgeNotification(notifType: NotificationType): boolean {
        return notifType === NotificationType.NewBadgeCertified || notifType === NotificationType.NewBadgeGroupLeader 
            || notifType === NotificationType.NewBadgeGroupMember || notifType === NotificationType.NewBadgeSponsor
            || notifType === NotificationType.NewBadgeMapPin || notifType === NotificationType.NewBadgeProfileFilled; 
    }

    function getImageUrlFromNotificationType(notifType: NotificationType): string {
        switch(notifType) {
            case NotificationType.NewBadgeCertified:
                return "/notifications/badge-certified.png";
            case NotificationType.NewBadgeGroupLeader:
                return "/notifications/badge-group-leader.png";
            case NotificationType.NewBadgeGroupMember:
                return "/notifications/badge-group-member.png";
            case NotificationType.NewBadgeSponsor:
                return "/notifications/badge-sponsor.png";
            case NotificationType.NewBadgeMapPin:
                return "/notifications/badge-map-pin.png";
            case NotificationType.NewBadgeProfileFilled:
                return "/notifications/badge-profile-filled.png";
            default:
                return "";
        }
    }

    onDestroy(() => {
        unsubscribe();
    });

</script>

<style>
    /* Container for the Bell icon and the badge */
    .notification-container {
      position: relative; /* Creates a positioning context for the badge */
      display: inline-block;
      margin-top: 5px;
    }
  
    /* Badge styling */
    .badge {
      position: absolute; /* Positions the badge relative to the container */
      top: -10px; /* Adjust this value to move the badge vertically */
      right: -8px; /* Adjust this value to move the badge horizontally */
      background-color: red;
      color: white;
      border-radius: 50%;
      padding: 0px 7px;
      font-size: 10px;
      font-weight: bold;
    }
</style>
  
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
        <Button 
            builders={[builder]} 
            variant="ghost" 
            class="hover:bg-background-none hover:border-none"
        >
            <div id="bell" class="notification-container">
                <BellIcon size={21} class="hover:fill-black" />
                {#if unreadCount > 0}
                    <div class="badge">{unreadCount}</div>
                {/if}
            </div>
        </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="p-0">
        <form method="POST" action="/notifications?/markAsRead" use:enhance class="flex flex-row justify-between items-baseline px-3 py-1">
            <input type="hidden" name="notification_ids" bind:value={$formData.notification_ids} /> 
            <p class="text-center text-md py-2 font-semibold">{translate(locale, "notifications")} ({notifications.length})</p>
            {#if notifications.length > 0 && notifications}
                <Button
                    variant="link_no_underline"
                    type="submit"
                    class="w-fit p-0"
                >
                    <span class="text-gray-400 hover:text-gray-800 hover:no-underline text-sm font-normal">{translate(locale, "markAsRead")}</span>
                </Button>
            {/if}
        </form>
        <div class="overflow-y-auto max-h-72">
            {#if notifications.length === 0 || !notifications}
                <hr class="border-gray-200">
                <p class="text-center text-sm py-2">{translate(locale, "no_notifications")}</p>
            {:else}
                {#each notifications as notif}
                    <DropdownMenu.Item 
                        class="flex border-gray-200 border-t cursor-pointer rouded-none {!notif.is_read ? 'bg-cien-200 data-[highlighted]:bg-cien-400' : '' }"
                        href={notif.about_user_id ? "/users/"+ notif.about_user_id : "#" }
                    >
                        {#if notif.about_user_image_url}
                            <img src={notif.about_user_image_url} alt="avatar" class="mt-1 mr-3 w-8 h-8 rounded-full self-start" />
                        {:else if notif.about_group_id}
                            <img src="/avatars/group.png" alt="avatar" class="mt-1 mr-3 w-8 h-8 rounded-full self-start" />
                        {:else if isBadgeNotification(notif.type)}
                            <img src={getImageUrlFromNotificationType(notif.type)} alt="avatar" class="mt-1 mr-3 w-8 h-8 rounded-full self-start" />
                        {:else}
                            <img src="/avatars/user.png" alt="avatar" class="mt-1 mr-3 w-8 h-8 rounded-full self-start" />
                        {/if}
                        <div class="mr-1">
                            <p class="text-sm w-56">{notif.message}</p>
                            <p class="text-xs text-gray-600 dark:text-primary-500 my-1">{computeTimeAgoStr(notif.created_at)}</p>
                        </div>
                        <DotIcon size="10" color="{notif.is_read ? "none" : "rgb(42,157, 143)"}" strokeWidth="15" class="mr-1"/>                        
                    </DropdownMenu.Item>
                {/each}
            {/if}
        </div>
    </DropdownMenu.Content>
  </DropdownMenu.Root>