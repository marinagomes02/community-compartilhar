<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Calendar } from '@/components/ui/calendar';
	import CardContent from '@/components/ui/card/card-content.svelte';
	import * as Popover from '@/components/ui/popover';
	import { Textarea } from '@/components/ui/textarea';
	import { editUserProfile, type EditUserProfileSchema } from '@/schemas/edit-user-profile';
	import { cn } from '@/utils';
	import {
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		type DateValue,
	} from '@internationalized/date';
	import { CalendarIcon, Loader2 } from 'lucide-svelte';
	import { superForm, type Infer, type SuperValidated, fileProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<EditUserProfileSchema>>;

	const form = superForm(data, {
		validators: zodClient(editUserProfile),
		dataType: 'json'
	});

	const { form: formData, enhance, submitting } = form;
	
	const image = fileProxy(form, 'image');
	let imageUrl: string | null | undefined = $formData.imageUrl;
	$: {
		if ($image.length > 0) {
			const img = $image.item(0);
			const reader = new FileReader();
			reader.onload = (e) => {
				imageUrl = e.target?.result as string | null | undefined;
			};
			reader.readAsDataURL(img!);
		}
	}

	let birthDate: DateValue | undefined;
	$: birthDate = $formData.birthDate ? parseDate($formData.birthDate) : undefined;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long',
	});

</script>

<div class="flex flex-col px-40 py-10">
	<div class="header flex flex-row mb-4  px-2">
		<p class="mb-3 text-lg font-bold">User settings</p>
		<Button class="submit-btn" type="submit" disabled={$submitting}>
			{#if $submitting}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Submit
		</Button>
	</div>
	<div>
		<form method="POST" enctype="multipart/form-data" use:enhance class="flex flex-col gap-y-6">
			<div class="flex flex-row gap-x-10">
				<div class="flex flex-col gap-y-8 w-full">
					<Card.Root class="profile-card">
						<Card.Content class="flex flex-col pt-4 pb-0 px-8">
							<div class="flex flex-row py-2 profile-header-container">
								{#if imageUrl}
									<img src={imageUrl} alt="User avatar" class="w-28 h-28 rounded-full" />
								{:else}
									<img class="w-28 h-28 rounded-full" src="/avatars/user.png" alt="User avatar">
								{/if}
								<div class="py-2">
									<p class="text-lg mb-2"> Marina Gomes </p>
									<p> Sem grupo </p>
								</div>
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
									<input hidden value={$formData.imageUrl} name="imageUrl" />
									<Form.FieldErrors />
								</Form.Control>
							</Form.Field>
						</Card.Content>
					</Card.Root>
					<Card.Root>
						<CardContent class="space-y-4 pt-4"> 
							<Form.Field {form} name="region">
								<Form.Control let:attrs>
									<Form.Label>Localidade</Form.Label>
									<Input {...attrs} bind:value={$formData.region} placeholder="ex: concelho, freguesia" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="communicationLink">
								<Form.Control let:attrs>
									<Form.Label>Link WhatsApp</Form.Label>
									<Input {...attrs} bind:value={$formData.communicationLink} placeholder="ex: https://wa.me/351xxxxxxxxx" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="email">
								<Form.Control let:attrs>
									<Form.Label>Email</Form.Label>
									<Input {...attrs} bind:value={$formData.email} placeholder="ex: email@gmail.com" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="phoneNumber">
								<Form.Control let:attrs>
									<Form.Label>Telemóvel</Form.Label>
									<Input {...attrs} bind:value={$formData.phoneNumber} placeholder="ex: +351 999 999 999" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</CardContent>
					</Card.Root>
				</div>
				<div class="flex flex-col w-full">
					<Card.Root>
						<CardContent class="space-y-4 pt-6"> 
							<Form.Field {form} name="displayName">
								<Form.Control let:attrs>
									<Form.Label>Nome</Form.Label>
									<Input {...attrs} bind:value={$formData.displayName} placeholder="ex: Maria Santos" />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="aboutMe">
								<Form.Control let:attrs>
									<Form.Label>Sobre mim</Form.Label>
									<Textarea {...attrs} bind:value={$formData.aboutMe} placeholder="ex: escrever um exemplo" />
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
							<div>
								<Form.Field {form} name="job">
									<Form.Control let:attrs>
										<Form.Label>Profissão</Form.Label>
										<Input {...attrs} bind:value={$formData.job} placeholder="ex: Professor" />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="birthDate">
									<Form.Control let:attrs>
										<Form.Label>Data nascimento</Form.Label>
										<Popover.Root>
											<Popover.Trigger
												{...attrs}
												class={cn(
													buttonVariants({ variant: 'outline' }),
													'w-full justify-start pl-4 text-left font-normal',
													!birthDate && 'text-muted-foreground'
												)}
											>
												{birthDate ? df.format(birthDate.toDate(getLocalTimeZone())) : 'Escolha uma data'}
												<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
											</Popover.Trigger>
											<Popover.Content class="w-auto p-0" side="top">
												<Calendar
													initialFocus
													value={birthDate}
													onValueChange={(v) => {
														if (v) {
															$formData.birthDate = v.toString();
														} else {
															$formData.birthDate = '';
														}
													}}
												/>
											</Popover.Content>
										</Popover.Root>
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name="completedCourse">
									<Form.Control let:attrs>
										<Form.Label>Curso de formação</Form.Label>
										<Input {...attrs} bind:value={$formData.completedCourse} />
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
						</CardContent>
					</Card.Root>
				</div>
			</div>
		</form>
	</div>
</div>

<style>
	:global(.profile-card) {
		width: fit-content
	}
	:global(.submit-btn) {
		width: fit-content;
	}
	:global(.header) {
		justify-content: space-between;
	}
	:global(.profile-header-container) {
		justify-content: space-around;
	}

</style>