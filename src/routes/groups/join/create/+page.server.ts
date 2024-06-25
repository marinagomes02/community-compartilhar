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
        const possible_regions = region.split(",").map(r => r.trim().split(/\s+/).join(" ").toUpperCase())

        // create request
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

         // if there is a possible group in the user region not yet validated, make him a member
        const { data: potential_possible_group_id } = await event.locals.supabase
            .rpc(
                'get_not_yet_validated_possible_group_in_user_regions', 
                { user_id: user.id }
            );

        if (potential_possible_group_id) {
            const {error: assign_group_error} = await event.locals.supabase
                .from('group_search_requests')
                .update({ possible_group_id: potential_possible_group_id })
                .eq('id', form.data.id);

        } else {
            // if there is no possible group on the user region not yet validated, create a new possible group if there are min members
            const { data: requests_for_possible_group } = await event.locals.supabase
                .rpc(
                    'get_requests_in_user_regions',
                    { user_id: user.id }
                );

            if (requests_for_possible_group.length >= 4) {
                const { data: possible_group, error: createPossibleGroupError } = await event.locals.supabase
                    .from('possible_groups')
                    .insert({ region: requests_for_possible_group[0].possible_region })
                    .select('id')
                    .single();

                if (possible_group) {
                    await Promise.all(requests_for_possible_group.map(async (request) => {
                        const { error: update_request_error} = await event.locals.supabase
                            .from('group_search_requests')
                            .update({ possible_group_id: possible_group.id })
                            .eq('user_id', request.user_id);
                    })) 
                }
            }
        }

        setFlash({ type: 'success', message: 'Request was successfully created' }, event.cookies);
        return redirect(303, '/groups/join/edit');	
    }
};