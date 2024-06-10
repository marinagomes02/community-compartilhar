import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { handleSignInRedirect } from '$lib/utils';
import { registerUsersSchema, unregisterUserSchema } from '@/schemas/register-users';
import * as EmailValidator from 'email-validator';
import { communicationLinkSchema } from '@/schemas/general-moderation';
import { acceptGroupRequestSchema, rejectGroupRequestSchema } from '@/schemas/groups-moderation';
import type { AuthorizedEmail, GroupRequestData } from '@/types';

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

	async function getCommunityLink(): Promise<any> {
		const { data: communityLink } = await event.locals.supabase
			.from('application')
			.select('community_link')
			.single();
		return communityLink ? communityLink : { community_link: null };
	}

	async function getGroupRequest(): Promise<GroupRequestData[]> {
		const { data: groupData, error: groupDataError } = await event.locals.supabase
			.from('group_requests_view')
			.select('*, members: profiles!inner(id, email)')
			.order('created_at', { ascending: false })
	
		if (groupDataError) {
			const errorMessage = 'Error fetching group requests, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}
		return groupData
	}
	return {
		registerForm: await superValidate(zod(registerUsersSchema), {
			id: 'users-register',
		}),
		unregisterForm: await superValidate(zod(unregisterUserSchema), {
			id: "user-unregister",
		}),
		communityLink: await getCommunityLink(),
		authorizedEmails: await getAuthorizedEmails(),
		groupRequests: await getGroupRequest(),
		acceptGroupRequestForm: await superValidate(zod(acceptGroupRequestSchema), {
			id: 'accept-group-request',
		}),
		rejectGroupRequestForm: await superValidate(zod(rejectGroupRequestSchema), {
			id: 'reject-group-request',
		}),
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

		await Promise.all(emailList.map(async (email) => {
			const { error: supabaseError } = await event.locals.supabase
												.from('future_users')
												.upsert({email: email});
			if (supabaseError) {
				setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
				return fail(500, { message: supabaseError.message });
			}
		}))

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

		const { error: supabaseError } = await event.locals.supabase
											.from('application')
											.upsert({
												'id': 1,
												'community_link': form.data.community_link?.replace(/\s/g, ""),
											});
		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		setFlash({ type: 'success', message: 'Community link added successfully' }, event.cookies);
		return redirect(303, '/admin');
	},

	accept_group_request: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}

		const form = await superValidate(event.request, zod(acceptGroupRequestSchema), { id: 'accept-group-request' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase
											.from('groups')
											.update({ is_authorized:true })
											.eq('id', form.data.group_id);
		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		setFlash({ type: 'success', message: 'Group request accepted successfully' }, event.cookies);
		return redirect(303, '/admin');
	},

	reject_group_request: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}

		const form = await superValidate(event.request, zod(rejectGroupRequestSchema), { id: 'reject-group-request' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase
											.from('groups')
											.delete()
											.eq('id', form.data.group_id);
		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		setFlash({ type: 'success', message: 'Group request rejected successfully' }, event.cookies);
		return redirect(303, '/admin');
	},
	
}

function validateCsvFile(csv: string[]) {
	for (var line of csv) {
		if (!EmailValidator.validate(line)) {
			return false
		}
	}
	return true
}
