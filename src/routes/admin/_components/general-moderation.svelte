<script lang="ts">
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { communicationLinkSchema, type CommunicationLinkSchema } from '@/schemas/general-moderation';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Card from '@/components/ui/card';
    import * as Form from '$lib/components/ui/form';
    import { Input } from '$lib/components/ui/input';
    import { Button } from '$lib/components/ui/button';
	import { Dot, Loader2 } from 'lucide-svelte';

    export let data : SuperValidated<Infer<CommunicationLinkSchema>>;

    const form = superForm(data, {
		validators: zodClient(communicationLinkSchema),
		dataType: 'json',
	});

    const { form: formData, enhance, submitting} = form
</script>

<form method="POST" action="?/add_community_link" use:enhance class="flex flex-col">
    <Card.Root>
        <Card.Header>
			<Card.Title>Adicionar link para comunidade no WhatsApp</Card.Title>
			<Card.Description>
                <p>Enter the link for the community on WhatsApp. To get this link:</p>
                <p class="flex flex-row"> <Dot /> Go to the community on the WhatsApp account as admin </p> 
                <p class="flex flex-row"> <Dot /> Click on the icon on the top right corner</p>
                <p class="flex flex-row"> <Dot /> Press 'Invite members'</p>
                <p class="flex flex-row"> <Dot /> Copy the link ('https://chat.whatsapp.com/...')</p>
			</Card.Description>
		</Card.Header>
        <Card.Content>
            <Form.Field {form} name="community_link">
				<Form.Control let:attrs>
					<Form.Label>Link*</Form.Label>
					<Input {...attrs} bind:value={$formData.community_link} class="link-input" />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
            <Button variant="default" type="submit" disabled={$submitting} style="background-color:#2A9D8F">
                {#if $submitting}
                    <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                {/if}
                Submeter
            </Button>
        </Card.Content>
    </Card.Root>
</form>

<style>
    :global(.link-input) {
        width: 30rem !important;
    }
</style>