import { handleSignInRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import type { JoinGroupRequestData, PossibleGroupData } from '@/types.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { acceptPossibleGroupSchema, rejectPossibleGroupSchema } from '@/schemas/possible-group-moderation.js';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
    const { session, user } = await event.locals.safeGetSession();
    
    if (!session || !user) {
        return redirect(302, handleSignInRedirect(event));
    }  

    const { data: userData } = await event.locals.supabase
								.from("profiles")
								.select('role')
								.eq('id', user.id)
								.single()
	if (userData.role !== "admin") {
		return redirect(303, '/')
	}

    async function getJoinGroupRequests(): Promise<JoinGroupRequestData[]> {
        const { data: joinGroupData, error: joinGroupDataError } = await event.locals.supabase
            .from('group_search_requests')
            .select('*, user_data:profiles(display_name)')
            .eq('possible_group_id', event.params.id)
            .order('created_at', { ascending: false });
    
        if (joinGroupDataError) {
            const errorMessage = 'Error fetching join group requests, please try again later.';
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            return error(500, errorMessage);
        }
        return joinGroupData;
    }

    async function getPossibleGroup(): Promise<PossibleGroupData> {
        const { data: possibleGroupData, error: possibleGroupsError } = await event.locals.supabase
            .from('possible_groups')
            .select('*')
            .eq('id', event.params.id)
            .single();
    
        if (possibleGroupsError) {
            const errorMessage = 'Error fetching possible groups, please try again later.';
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            return error(500, errorMessage);
        }
        return possibleGroupData;
    }

    return {
        joinGroupRequestsData: await getJoinGroupRequests(),
        possibleGroupData: await getPossibleGroup(),
        acceptForm: await superValidate(zod(acceptPossibleGroupSchema), {
            id: 'accept-possible-group',
        }),
        rejectForm: await superValidate(zod(rejectPossibleGroupSchema), {
            id: 'reject-possible-group',
        }),
    };
};

export const actions = {
    accept_possible_group: async ({ request, cookies, locals: { supabase, safeGetSession } }) => {
        const { session, user } = await safeGetSession();
        if (!session || !user) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, cookies);
			return error(401, errorMessage);
		}

        const form = await superValidate(request, zod(acceptPossibleGroupSchema));

        if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, cookies);
			return fail(400, { message: errorMessage, form });
		}

        const { error: supabaseError } = await supabase
            .from('possible_groups')
            .update({ is_validated: true })
            .eq('id', form.data.possible_group_id);

        setFlash({ type: 'success', message: 'Possible group accepted successfully' }, cookies);
		return redirect(303, '/admin');
    },
    reject_possible_group: async ({ request, cookies, locals: { supabase, safeGetSession } }) => {
        const { session, user } = await safeGetSession();
        if (!session || !user) {
            const errorMessage = 'Unauthorized.';
            setFlash({ type: 'error', message: errorMessage }, cookies);
            return error(401, errorMessage);
        }

        const form = await superValidate(request, zod(rejectPossibleGroupSchema));

        if (!form.valid) {
            const errorMessage = 'Invalid form.';
            setFlash({ type: 'error', message: errorMessage }, cookies);
            return fail(400, { message: errorMessage, form });
        }

        const { error: supabaseError } = await supabase
            .from('possible_groups')
            .delete()
            .eq('id', form.data.possible_group_id);

        if (supabaseError) {
            setFlash({ type: 'error', message: supabaseError.message }, cookies);
            return fail(500, { message: supabaseError.message, form });
        }

        setFlash({ type: 'success', message: 'Possible group deleted successfully' }, cookies);
        return redirect(303, '/admin');
    },
}