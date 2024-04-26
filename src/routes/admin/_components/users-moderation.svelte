<script lang="ts">
    import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import type { RegisterUsersSchema } from '@/schemas/register-users';
	import { zodClient, type Infer } from 'sveltekit-superforms/adapters';
	import { Loader2 } from 'lucide-svelte';
	import { registerUsersSchema } from '@/schemas/register-users';
	import { fileProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

	export let data;
	
	const form = superForm(data.registerForm, {
		validators: zodClient(registerUsersSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, submitting } = form;	
	const file = fileProxy(form, 'file');

</script>

<style>
	form {
		margin-top: 15px;
	}
	form > .card {
		width: 100%;
	}
	:global(td) {
		text-align: center;
		padding-top: 0.5rem !important;
		padding-bottom: 0.5rem !important;
	}
	.table-container {
		width: 50%;
		margin: 30px !important;
		display: inline-block;
	}
</style>

<form method="POST" enctype="multipart/form-data" use:enhance class="container mx-auto flex flex-row justify-between">
	<Card.Root class="card">
    	<Card.Header>
        	<Card.Title>Register new users</Card.Title>
        	<Card.Description
            	>Upload a .csv file with one column, corresponding to the list of 
            	e-mails of the new users you want to register
        	</Card.Description>
    	</Card.Header>
    	<Card.Content>
			<Form.Field {form} name="file">
				<Form.Control let:attrs>
					<input {...attrs} type="file" accept="text/csv" bind:files={$file} class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
    	</Card.Content>
		<Button type="submit" disabled={$submitting}>
			{#if $submitting}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Submit
		</Button>
	</Card.Root>
</form>
<div class="table-container">
	<Table hoverable={true}>
		<TableHead>
		  <TableHeadCell>Email</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
		  {#each data.authorizedEmails as authorized}
			<TableBodyRow>
			  <TableBodyCell>{authorized.email}</TableBodyCell>
			</TableBodyRow>
		  {/each}
		</TableBody>
	</Table>
</div>

