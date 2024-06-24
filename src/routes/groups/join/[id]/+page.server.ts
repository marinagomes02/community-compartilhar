import { handleSignInRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import type { JoinGroupRequestData, PossibleGroupData } from '@/types.js';

export const load = async (event) => {
    const { session, user } = await event.locals.safeGetSession();
    
    if (!session || !user) {
        return redirect(302, handleSignInRedirect(event));
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
    };
};