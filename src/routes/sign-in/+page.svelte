<script lang="ts">
	import PageHeader from '$lib/components/page-header.svelte';
	import { Card } from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { signInSchema, type SignInSchema } from '$lib/schemas/sign-in';
	import { Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ActionData } from './$types.js';

	export let form: SuperValidated<SignInSchema> & ActionData;
	export let data;
	const sForm = superForm(data.form);
	$: submitting = sForm.submitting;

	$: if (form?.success === false) {
		toast.error(form?.message ?? 'Something went wrong');
	}
</script>

<PageHeader title="Sign In" subtitle="Sign in to your account" />
<div class="container mx-auto my-20 flex flex-col items-center justify-center">
	<Card class="card w-[32rem] px-12 py-10">
		<Form.Root method="POST" controlled form={sForm} schema={signInSchema} let:config>
			<Form.Field {config} name="email">
				<Form.Item>
					<Form.Label>Email</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Field {config} name="password">
				<Form.Item>
					<Form.Label>Password</Form.Label>
					<Form.Input type="password" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Button class="mt-5" disabled={$submitting}>
				{#if $submitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Submit
			</Form.Button>
		</Form.Root>
	</Card>
</div>
