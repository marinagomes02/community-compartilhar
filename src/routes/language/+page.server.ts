import { fail, superValidate } from 'sveltekit-superforms';
import { setLanguagePreferenceSchema } from '@/schemas/language';
import { zod } from 'sveltekit-superforms/adapters';
import { setFlash } from 'sveltekit-flash-message/server';

export const actions = {
	setLanguagePreference: async (event: any) => {
		const form = await superValidate(event.request, zod(setLanguagePreferenceSchema), { id: 'set-language-preference' });
		
		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		await event.cookies.set('languagePreference', form.data.language, { path: '/' });
		return;
	},
};