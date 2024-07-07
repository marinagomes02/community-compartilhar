import { translate } from '@/utils/translation/translate-util.js';
import { markAsRead } from './notifications-api.js';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { markAsReadSchema } from '../../lib/schemas/notifications.js';
import { zod } from 'sveltekit-superforms/adapters';
import { user_notifications } from '../../stores/notifications.js';
import { error } from "@sveltejs/kit";

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
    
        const { notification_ids } = form.data;
        notification_ids.map(id => String(id));

        console.log('Marking notifications as read:', notification_ids);
        const { error: supabaseError } = await event.locals.supabase
            .from('user_notifications')
            .update({ is_read: true, read_at: new Date() })
            .in('id', notification_ids);

        if (supabaseError) {
            console.log(supabaseError.message)
            setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
            return fail(500, { message: supabaseError.message, form });
        }
        
        user_notifications.update(n => n.map(notif => notification_ids.includes(notif.id) ? { ...notif, is_read: true } : notif));
    
        return;
    }
} 

