<script lang="ts">
	import PageHeader from '$lib/components/page-header.svelte';
	import { Card } from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { signInSchema } from '$lib/schemas/sign-in';
	import { translate } from '@/utils/translation/translate-util.js';
	import { Loader2 } from 'lucide-svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(signInSchema),
	});

	const { form: formData, enhance, submitting } = form;
</script>

<PageHeader title="Sign In" subtitle="Sign in to your account" />
<div class="container mx-auto my-20 flex flex-col items-center justify-center">
	<Card class="card w-[32rem] px-12 py-10">
		<form method="POST" use:enhance>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>{translate(data.locale, "email")}</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>{translate(data.locale, "password")}</Form.Label>
					<Input type="password" {...attrs} bind:value={$formData.password} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Form.Button class="mt-5" disabled={$submitting}>
				{#if $submitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				{translate(data.locale, "submit")}
			</Form.Button>
		</form>
	</Card>
</div>
