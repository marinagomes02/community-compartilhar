import { createGroupSchema } from "@/schemas/group";
import type { UserListData } from "@/types";
import { handleSignInRedirect } from "@/utils";
import { translate } from "@/utils/translation/translate-util.js";
import { error, fail, redirect } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms/server";

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}

    const { data: users } = await event.locals.supabase
        .from('profiles')
        .select('id, email, display_name')
        .order('display_name', { ascending: true });
    
    let users_list: UserListData[] = users ?? [];

	return {
		createGroupForm: await superValidate(zod(createGroupSchema), {
			id: 'create-group',
		}),
        locale: event.cookies.get("languagePreference") || "EN",
        users_list
	};
};

export const actions = {
    default: async (event) => {
        const { session } = await event.locals.safeGetSession();
        const locale = event.cookies.get("languagePreference") || "EN";

		if (!session) {
			const errorMessage = translate(locale, "error.unauthorized");
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}
        const form = await superValidate(event.request, zod(createGroupSchema));
        
        if (!form.valid) {
            const errorMessage = translate(locale, "error.invalidForm");
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

        const { members, ...groupDataRequest } = form.data;
        console.log("membros: ", members);
        console.log("formData: ", form.data);

        const { data: group, error: createGroupError } = await event.locals.supabase
            .from('groups')
            .insert(groupDataRequest)
            .select()
            .single();
        
        if (createGroupError) {
            setFlash({ type: 'error', message: createGroupError.message }, event.cookies);
            return fail(500, { message: createGroupError.message, form });
        }
  
        await Promise.all(members.map(async (member_id) => {
            const { error: updateUsersWithGroupId } = await event.locals.supabase
                .from('profiles')
                .update({group_id: group.id})
                .eq('id', member_id)

            if (updateUsersWithGroupId) {
                setFlash({ type: 'error', message: updateUsersWithGroupId.message }, event.cookies);
                return fail(500, { message: updateUsersWithGroupId.message, form });
            }
        }));

        setFlash({ type: 'success', message: translate(locale, "success.createGroup") }, event.cookies);
		return redirect(303, '/groups');
    } 
}

function getEmailListFromString(emails: string): string[] {
    return emails.replaceAll(" ", "").split(",")
}

function buildQueryToValidateEmails(emails: string): string {
    return '(' + emails.replaceAll(" ", "") + ')'
}
