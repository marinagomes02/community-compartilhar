import { handleSignInRedirect } from "@/utils";
import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
    const { session, user } = await event.locals.safeGetSession();
	
	if (!session || !user) {
		return redirect(302, handleSignInRedirect(event));
	}

    const { data: userData } = await event.locals.supabase
                                .from("profiles")
                                .select('group_id')
                                .eq('id', user.id)
                                .single()
    
    return {
        group_id: userData?.group_id ?? null
    }
}