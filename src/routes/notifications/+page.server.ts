import { translate } from '@/utils/translation/translate-util.js';
import { markAsRead } from './notifications-api.js';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { markAsReadSchema } from '../../lib/schemas/notifications.js';
import { zod } from 'sveltekit-superforms/adapters';
import { user_notifications } from '../../stores/notifications.js';
import { error } from "@sveltejs/kit";
import type { UserNotification } from '@/types.js';

export const actions = {
    markAsRead: async (event) => {

        const { session, user } = await event.locals.safeGetSession();
        const locale = event.cookies.get('languagePreference') || 'EN';

        if (!session || !user) {
            const errorMessage = translate(locale, 'error.unauthorized');
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            return error(401, errorMessage);
        }

        const form = await superValidate(event.request, zod(markAsReadSchema));
        if (!form.valid) {
            const errorMessage = translate(locale, 'error.invalidForm');
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
            return fail(400, { message: errorMessage, form });
        }

        let notifications: UserNotification[] = [];
        const unsubscribe = user_notifications.subscribe((value: UserNotification[]) => {
            notifications = value;
        }); 
        const notifications_not_read: string[] = notifications.filter(n => !n.is_read).map(n => n.id);

        await markAsRead(notifications_not_read, event.locals.supabase);
        unsubscribe();
    
        return;
    }
} 

