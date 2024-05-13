<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
    import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { editUserProfileSchema, type EditUserProfileSchema } from '@/schemas/edit-user-profile';
	import { Field } from 'formsnap';
	import { Loader2 } from 'lucide-svelte';
    import SuperDebug, { superForm, type Infer, type SuperValidated, fileProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	import { Textarea } from '@/components/ui/textarea';

    export let data: PageData;
    console.log(data.editUserData)

    const form = superForm(data.editUserData, {
        validators: zodClient(editUserProfileSchema),
        dataType: 'json'
	});    
    
    const { form: formData, enhance, submitting } = form;

    const image = fileProxy(form, 'image');
	$: imageUrl = $formData.image_url;
	$: {
		if ($image.length > 0) {
			const img = $image.item(0);
			const reader = new FileReader();
			reader.onload = (e) => {
				imageUrl = e.target?.result as string | null;
			};
			reader.readAsDataURL(img!);
		}
	}
</script>

<form method="POST" enctype="multipart/form-data" use:enhance class="flex flex-col">
    <div class="flex flex-col px-40 py-10">
        <div class="flex flex-row mb-4 px-2 justify-between">
            <p class="content-center text-lg font-bold">User settings</p>
            <Button class="w-fit" type="submit" disabled={$submitting}>
                {#if $submitting}
                    <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                {/if}
                Submit
            </Button>
        </div>
        <div>
			<div class="flex flex-row gap-x-8">
				<div class="flex flex-col gap-y-7 w-full">
					<Card.Root class="w-fit">
						<Card.Content class="flex flex-col pt-4 pb-0 px-6 ">
							<div class="flex flex-row py-2 space-x-8">
								{#if imageUrl}
									<img src={imageUrl} alt="User avatar" class="w-28 h-28 rounded-full" />
								{:else}
									<img class="w-28 h-28 rounded-full" src="/avatars/user.png" alt="User avatar">
								{/if}
                            </div>
                            <Form.Field {form} name="image">
								<Form.Control let:attrs>
									<input
										class="flex h-10 w-full my-4 rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										{...attrs}
										type="file"
										accept="image/png, image/jpeg"
										bind:files={$image}
									/>
									<input hidden value={$formData.image_url} name="imageUrl" />
									<Form.FieldErrors />
								</Form.Control>
							</Form.Field>
                        </Card.Content>
                    </Card.Root>
                </div>
            </div>
        <Card.Root>
            <Card.Content> 
                <Form.Field {form} name="display_name">
                    <Form.Control let:attrs> 
                        <Form.Label>Nome</Form.Label>
                        <Input {...attrs} bind:value={$formData.display_name} placeholder="ex: Maria Santos" />
                    </Form.Control>
                </Form.Field>
                <Form.Field {form} name="about_me">
                    <Form.Control let:attrs>
                        <Form.Label>Sobre mim</Form.Label>
                        <Textarea {...attrs} bind:value={$formData.about_me} placeholder="ex: escrever um exemplo" />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="motivation">
                    <Form.Control let:attrs>
                        <Form.Label>Motivação</Form.Label>
                        <Textarea {...attrs} bind:value={$formData.motivation} placeholder="ex: escolher um exemplo" />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <SuperDebug data={$formData}></SuperDebug>
            </Card.Content>
        </Card.Root>
    </div>
</form>