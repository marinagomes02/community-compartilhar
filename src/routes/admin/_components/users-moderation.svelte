<script lang="ts">
    import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { PlusCircle } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import type { RegisterUsersSchema } from '@/schemas/admin-users';
	import { zodClient, type Infer } from 'sveltekit-superforms/adapters';
	import { Loader2 } from 'lucide-svelte';
	import { registerUsersSchema } from '@/schemas/admin-users';
	import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';

	export let data: SuperValidated<Infer<RegisterUsersSchema>>;
	
	const form = superForm(data, {
		validators: zodClient(registerUsersSchema)
	});

	const { form: formData, enhance, submitting } = form;

	let registerFormVisible = false;

	function toggleVisible() {
		registerFormVisible = !registerFormVisible;
	}

</script>

<style>
	form > :global(button) {
		margin-left: auto;
	}
	:global(input[type="file"]) {
		background: linear-gradient(to right, black 20.5%, white 0%);
	}
	:global(input::file-selector-button) {
		color: white;
		margin-right: 15px;
	}
</style>

<form method="POST" enctype="multipart/form-data" use:enhance class="container mx-auto flex flex-row justify-between">
    {#if registerFormVisible}
	<Card.Root>
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
					<Input {...attrs} bind:value={$formData.file} type="file" accept=".csv" />
				</Form.Control>
			</Form.Field>
    	</Card.Content>
		<SuperDebug data={$formData} />
		<Button type="submit" disabled={$submitting}>
			{#if $submitting}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Submit
		</Button>
	</Card.Root>
	{/if}
    <Button on:click={toggleVisible} class="registerUsers"><PlusCircle class="mr-2 h-4 w-4" />Register new users</Button>
</form>
<div class="container mx-auto flex flex-row justify-between">
    <div class="flex flex-row gap-x-4">
		<Input placeholder="Search..." class="w-64"></Input>
	</div>
</div>

