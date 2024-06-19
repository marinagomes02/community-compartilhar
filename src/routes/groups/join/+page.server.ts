import { groupSearchRequestSchema } from '@/schemas/group.js';
import { handleSignInRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
    const { session, user } = await event.locals.safeGetSession();
    
    if (!session || !user) {
        return redirect(302, handleSignInRedirect(event));
    }   

    return {
        groupSearchRequestForm: await superValidate(zod(groupSearchRequestSchema), {
            id: 'group-search-request',
        }),
    };
};

export const actions = {
    default: async (event) => {
        const { session, user } = await event.locals.safeGetSession();
        if (!session || !user) {
            const errorMessage = 'Unauthorized.';
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            return error(401, errorMessage);
        }

        const form = await superValidate(event.request, zod(groupSearchRequestSchema));

        if (!form.valid) {
            const errorMessage = 'Invalid form.';
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            return fail(400, { message: errorMessage, form });
        }

        const { region, ...data } = form.data;
        const possible_regions = region.replace(" ", "").toUpperCase().split(",");

        const { error: supabaseError } = await event.locals.supabase
            .from('group_search_requests')
            .upsert({
                possible_regions: possible_regions,
                ...data,
                user_id: user.id
            }, 
            { onConflict: 'user_id' });

        if (supabaseError) {
            setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
            return fail(500, { message: supabaseError.message, form });
        }

        setFlash({ type: 'success', message: 'Request was successfully created' }, event.cookies);
        return redirect(303, '/groups');	
    }
};