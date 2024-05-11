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
	import SuperDebug, { superForm, type Infer, type SuperValidated, fileProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as RadioGroup from '@/components/ui/radio-group';
	import Label from '@/components/ui/label/label.svelte';
	import Checkbox from '@/components/ui/checkbox/checkbox.svelte';
	import * as Select from '@/components/ui/select';
	import type { GroupStage } from '@/types';
	import type { Selected } from 'bits-ui';

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

	$: selectedCompletedCourse = String($formData.completedCourse)

	const groupStageOptions: Record<GroupStage, { label: string }> = {
		noGroup: {
			label: 'Sem grupo de patrocínio',
		},
		lookingFor: {
			label: 'À procura de grupo',
		},
		belongsTo: {
			label: 'Pertence a um grupo',
		},
	};
	$: selectedGroupStage = $formData.groupStage 
		? {
				value: $formData.groupStage,
				label: groupStageOptions[$formData.groupStage].label,
			}
		:undefined;
	function getGroupStageFromValue(v: Selected<unknown>): GroupStage {
		return v.value as GroupStage;
	}


</script>

<div class="flex flex-col px-40 py-10">
	<div class="flex flex-row mb-4 px-2 justify-between">
		<p class="mb-3 text-lg font-bold">User settings</p>
		<Button class="w-fit" type="submit" disabled={$submitting}>
			{#if $submitting}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Submit
		</Button>
	</div>
	<div>
		<form method="POST" enctype="multipart/form-data" use:enhance class="flex flex-col gap-y-6">
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
								<div class="py-2">
									<p class="text-lg mb-2"> Marina Gomes </p>
									<Form.Field class="w-52" {form} name="groupStage">
										<Form.Control let:attrs>
											<Select.Root
												{...attrs}
												selected={selectedGroupStage}
												onSelectedChange={(v) => {
													if (v) {
														$formData.groupStage = getGroupStageFromValue(v);
													}
												}}
											>
												<Select.Trigger {...attrs}>
													<Select.Value class="align-start" placeholder={selectedGroupStage?.label} />
												</Select.Trigger>
												<Select.Content>
													<Select.Item value="noGroup">Sem grupo de patrocínio</Select.Item>
													<Select.Item value="lookingFor">À procura de grupo</Select.Item>
													<Select.Item value="belongsTo">Pertence a um grupo</Select.Item>
												</Select.Content>
											</Select.Root>
											<Form.FieldErrors />
										</Form.Control>
									</Form.Field>
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
									<div class="flex flex-row space-x-2 px-2">
										<Checkbox name="showLink" id="checkbox-1" bind:checked={$formData.showLink}></Checkbox>
										<Label class="font-normal text-xs" for="checkbox-1">Mostrar link direto para o WhatsApp para poder ser contactado por outros participantes</Label>
									</div>
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
							<div class="flex flex-row space-x-8">
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
							</div>
							<Form.Field {form} name="completedCourse">
								<Form.Control let:attrs>
									<Form.Label>Curso de formação</Form.Label>
									<RadioGroup.Root 
										bind:value={selectedCompletedCourse}
										onValueChange={(v) => {
											$formData.completedCourse = Boolean(selectedCompletedCourse);
										}}>
										<div class="flex items-center space-x-2">
											<RadioGroup.Item value="false" id="r1" />
											<Label class="font-normal" for="r1">Ainda não completei o curso de formação online</Label>
										</div>
										<div class="flex items-center space-x-2">
											<RadioGroup.Item value="true" id="r2" />
											<Label class="font-normal" for="r2">Já completei o curso e estou apto para ser patrocinador!</Label>
										</div>
										<RadioGroup.Input name="completedCourse" />
										</RadioGroup.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</CardContent>
					</Card.Root>
				</div>
			</div>
		</form>
	</div>
</div>

<style>
	:global(.align-start) {
		text-align: start;
	}

</style>