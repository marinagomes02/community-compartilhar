import { createGroupSchema } from "@/schemas/group";
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

	return {
		createGroupForm: await superValidate(zod(createGroupSchema), {
			id: 'create-group',
		}),
        locale: event.cookies.get("languagePreference") || "EN",
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

        const queryEmailList = buildQueryToValidateEmails(members);        
        const { data: users, error: getUserIdsFromEmailsError} = await event.locals.supabase
            .from('profiles')
            .select('id')
            .filter('email', 'in', queryEmailList);

        if (getUserIdsFromEmailsError) {
            setFlash({ type: 'error', message: getUserIdsFromEmailsError.message }, event.cookies);
            return fail(500, { message: getUserIdsFromEmailsError.message, form });
        }

        if (users.length !== getEmailListFromString(members).length) {
            const errorMessage = translate(locale, "error.emailsNotRegistered");
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            return fail(400, { message: errorMessage, form });
        }

        if (!members.includes(groupDataRequest.leader)) {
            const errorMessage = translate(locale, "error.leaderNotInMembers");
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            return fail(400, { message: errorMessage, form });
        }

        const { data: group, error: createGroupError } = await event.locals.supabase
            .from('groups')
            .insert(groupDataRequest)
            .select()
            .single();
        
        if (createGroupError) {
            setFlash({ type: 'error', message: createGroupError.message }, event.cookies);
            return fail(500, { message: createGroupError.message, form });
        }
  
        await Promise.all(users.map(async (user) => {
            const { error: updateUsersWithGroupId } = await event.locals.supabase
                .from('profiles')
                .update({group_id: group.id})
                .eq('id', user.id)

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
