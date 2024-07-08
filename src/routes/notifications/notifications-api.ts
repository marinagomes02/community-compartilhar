import type { NotificationType, UserNotification } from "@/types";
import { user_notifications } from "../../stores/notifications";

export async function fetchNotifications(user_id: string, supabase: any) {
    const { data: userNotificationsData, error: supabaseError } = await supabase
        .from('user_notifications')
        .select('id, message, created_at, is_read, about_user_id, image:about_user_id(image)')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(15);

    if (supabaseError) {
        console.error('Error fetching notifications:', supabaseError);
        return;
    }

    let user_notifications_data: UserNotification[] = [];

    for (let notification of userNotificationsData) {
        let image_url = null;
        if (notification.about_user_id && notification.image.image && notification.image.image !== "") {
            image_url = await supabase.storage
                .from('users-avatars')
                .getPublicUrl(notification.image.image)
                .data.publicUrl;
            }
        const { image, ...notificationData } = notification;
        user_notifications_data.push({ ...notificationData, image_url });
    }

    user_notifications.set(user_notifications_data);
}

export async function markAsRead(notification_ids: string[], supabase: any) {
    console.log('Marking notifications as read:', notification_ids);
    const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true, read_at: new Date() })
        .in('id', notification_ids);

    if (error) {
        console.error('Error marking notification as read:', error);
    } else {
        user_notifications.update(n => n.map(notif => notification_ids.includes(notif.id) ? { ...notif, is_read: true } : notif));
    }
}

export async function sendBatchNotifications(user_ids: string[], message: string, notification_type: NotificationType, supabase: any) {
    const { error } = await supabase.rpc('insert_notifications_batch', { 
        user_ids, 
        message, 
        type: notification_type
    });
    if (error) {
        console.error('Error sending batch notifications:', error);
    }
}