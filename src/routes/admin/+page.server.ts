import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { handleSignInRedirect } from '$lib/utils';
import { registerUsersSchema, unregisterUserSchema } from '@/schemas/register-users';
import * as EmailValidator from 'email-validator';
import { communicationLinkSchema } from '@/schemas/general-moderation';
import type { AuthorizedEmail } from '@/types';

export const load = async (event) => {
    const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}

	async function getAuthorizedEmails(): Promise<AuthorizedEmail[]> {
		const { data: authorizedEmails, error: authorizedEmailsError } = await event.locals.supabase
																			.from("future_users")
																			.select('email')
																			.order('created_at', { ascending: false });

		if (authorizedEmailsError) {
			const errorMessage = 'Error fetching authorized emails, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}
		return authorizedEmails;
	}

	return {
		registerForm: await superValidate(zod(registerUsersSchema), {
			id: 'users-register',
		}),
		unregisterForm: await superValidate(zod(unregisterUserSchema), {
			id: "user-unregister",
		}),
		communityLinkForm: await superValidate(zod(communicationLinkSchema), {
			id: "community-link",
		}),
		authorizedEmails: await getAuthorizedEmails(),
	};
};

export const actions = {
    register: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}

		const form = await superValidate(event.request, zod(registerUsersSchema), { id: 'users-register' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		// read file
		let emailList
		try {
			const file = form.data.file 
			if (!file) throw new Error('File not found');
			const content = await file.arrayBuffer(); 
			const bytes = new Uint8Array(content);
			emailList = new TextDecoder().decode(bytes).replaceAll("\r", "").split("\n").filter(str => str.trim() !== "");
		} catch (error) {
			const errorMessage = 'Error processing file.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		// validate file
		if (!validateCsvFile(emailList)) {
			const errorMessage = 'Invalid file.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		emailList.forEach(async (email) => {
			const { error: supabaseError } = await event.locals.supabase
												.from('future_users')
												.upsert({email: email});
			if (supabaseError) {
				setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
				return fail(500, { message: supabaseError.message });
			}
		})
	
		setFlash({ type: 'success', message: 'Users were successfully added' }, event.cookies);
		return redirect(303, '/admin');
	},

	unregister: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}

		const form = await superValidate(event.request, zod(unregisterUserSchema), { id: 'user-unregister'});

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase
											.from('future_users')
											.delete()
											.eq('email', form.data.email);
		
		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		setFlash({ type: 'success', message: 'User successfully unregistered' }, event.cookies);
		return redirect(303, '/admin');
	},

	add_community_link: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}
		
		const form = await superValidate(event.request, zod(communicationLinkSchema), { id: 'community-link'});

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase.from('application').insert({
			'community-link': form.data.link,
		});

		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		setFlash({ type: 'success', message: 'Community link added successfully' }, event.cookies);
		return redirect(303, '/admin');
	}
}

function validateCsvFile(csv: string[]) {
	for (var line of csv) {
		if (!EmailValidator.validate(line)) {
			return false
		}
	}
	return true
}
