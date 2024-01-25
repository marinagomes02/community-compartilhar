<script lang="ts">
	import PageHeader from '$lib/components/page-header.svelte';
	import { Card } from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { signUpSchema, type SignUpSchema } from '$lib/schemas/sign-up';
	import { Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ActionData } from './$types.js';

	export let form: SuperValidated<SignUpSchema> & ActionData;
	export let data;
	const sForm = superForm(data.form);
	$: submitting = sForm.submitting;

	$: if (form?.success === false) {
		toast.error(form?.message ?? 'Something went wrong');
	}

	$: if (form?.success === true) {
		toast.success("Click the Magic Link we've sent to your email to sign in");
	}
</script>

<PageHeader title="Sign up" subtitle="Sign up to our community" />
<div class="container mx-auto my-20 flex flex-col items-center justify-center">
	<Card class="card w-[32rem] px-12 py-10">
		<Form.Root method="POST" controlled form={sForm} schema={signUpSchema} let:config>
			<Form.Field {config} name="displayName">
				<Form.Item>
					<Form.Label>Display Name</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
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
			<Form.Field {config} name="confirmPassword">
				<Form.Item>
					<Form.Label>Confirm Password</Form.Label>
					<Form.Input type="password" />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Button disabled={$submitting} class="mt-5">
				{#if $submitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Submit
			</Form.Button>
		</Form.Root>
	</Card>
</div>
