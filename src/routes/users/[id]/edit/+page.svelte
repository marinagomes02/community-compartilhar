<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
    import * as RadioGroup  from '@/components/ui/radio-group';
    import * as Select from '@/components/ui/select';
    import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { editUserProfileSchema } from '@/schemas/edit-user-profile';
    import SuperDebug, { superForm, fileProxy, fieldProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	import { Textarea } from '@/components/ui/textarea';
	import { 
        DateFormatter,
        parseDate,
        type DateValue
    } from '@internationalized/date';
	import { Checkbox } from '@/components/ui/checkbox';
	import { Label } from '@/components/ui/label';
	import type { Selected } from 'bits-ui';
	import type { SponsorshipState } from '@/types';
    import { DateField } from 'bits-ui';
	import { Loader2, Upload } from 'lucide-svelte';
	import { translate } from '@/utils/translation/translate-util';

    export let data: PageData;
    let sponsorship_state_old = data.sponsorship_state_old;

    const form = superForm(data.editUserData, {
        validators: zodClient(editUserProfileSchema),
        dataType: 'json'
	});        
    const { form: formData, enhance, submitting } = form;

    let locale: string = data.languagePreference.language;
    let fileInput: any;
    let old_state = fieldProxy(formData, 'sponsorship_state_old');
    let birth_date: DateValue | undefined;



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
	const sponsorshipStateOptions: Record<SponsorshipState, { label: string }> = {
		no_group: {
			label: translate(locale, "sponsorshipState.noGroup"),
		},
		looking_for_group: {
			label: translate(locale, "sponsorshipState.lookingForGroup"),
		},
        has_group: {
            label: translate(locale, "sponsorshipState.hasGroup")
        }
	};

    $: sponsorship_state_old = data.sponsorship_state_old;
    $: $old_state = sponsorship_state_old;
    $: locale = data.languagePreference.language;
	$: birth_date = $formData.birth_date ? parseDate($formData.birth_date) : undefined;
    $: selectedCompletedCourse = String($formData.completed_course)
	$: selectedGroupStage =  $formData.sponsorship_state
		? {
				value: $formData.sponsorship_state,
				label: sponsorshipStateOptions[$formData.sponsorship_state].label,
		    } 
        : undefined;

    function getSponsorshipFromValue(v: Selected<unknown>): SponsorshipState {
		return v.value as SponsorshipState;
	}
</script>

<form method="POST" enctype="multipart/form-data" use:enhance class="flex flex-col">
    <input type="hidden" name="sponsorship_state_old" value={$formData.sponsorship_state_old} />
    <div class="flex flex-col px-40 py-10">
        <div class="flex flex-row mb-4 px-2 justify-between">
            <p class="content-center text-lg font-bold">{translate(locale, "editProfile")}</p>
            <Button class="w-fit" type="submit" disabled={$submitting} style="background-color:#2A9D8F">
                {#if $submitting}
                    <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                {/if}
                {translate(locale, "submit")}
            </Button>
        </div>
        <div>
            <div class="flex flex-row gap-x-8">
                <div class="flex flex-col gap-y-7 w-min">
                    <Card.Root class="w-fit">
                        <Card.Content class="flex flex-col pt-4 pb-0 px-6 w-max">
                            <div class="flex flex-row py-2 space-x-8 w-fit">
                                {#if imageUrl}
                                    <img src={imageUrl} alt="User avatar" class="w-28 h-28 rounded-full" />
                                {:else}
                                    <img class="w-28 h-28 rounded-full" src="/avatars/user.png" alt="User avatar">
                                {/if}
                                <div class="py-2">
                                    <p class="text-lg mb-2"> {$formData.display_name} </p>
                                    <Form.Field class="w-48" {form} name="sponsorship_state">
                                        <Form.Control let:attrs>
											<Select.Root
												{...attrs}
												selected={selectedGroupStage}
												onSelectedChange={(v) => {
													if (v) {
                                                        $formData.sponsorship_state = getSponsorshipFromValue(v);
													}
												}}
											>
												<Select.Trigger {...attrs}>
													<Select.Value class="align-start" placeholder={selectedGroupStage?.label} />
												</Select.Trigger>
												<Select.Content>
													<Select.Item value="no_group">{translate(locale, "sponsorshipState.noGroup")}</Select.Item>
													<Select.Item value="looking_for_group">{translate(locale, "sponsorshipState.lookingForGroup")}</Select.Item>
                                                    <Select.Item value="has_group">{translate(locale, "sponsorshipState.hasGroup")}</Select.Item>
												</Select.Content>
											</Select.Root>
											<Form.FieldErrors />
										</Form.Control>
                                    </Form.Field>
                                </div>
                            </div>
                            <Form.Field {form} name="image">
                                <Form.Control let:attrs>
                                    <Button 
                                        variant="outline" 
                                        class="mb-2 font-normal text-xs px-3 py-2 h-fit" 
                                        on:click={() => fileInput.click()}>
                                            <Upload class="mr-2 h-3 w-3" />
                                            {translate(locale, "editprofile.image")}
                                    </Button>
                                    <input
                                        {...attrs}
                                        hidden
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        bind:files={$image}
                                        bind:this={fileInput}
                                    />
                                    <input hidden value={$formData.image_url} name="imageUrl" />
                                    <Form.FieldErrors />
                                </Form.Control>
                            </Form.Field>
                        </Card.Content>
                    </Card.Root>
                    <Card.Root class="h-full">
                        <Card.Content class="space-y-4 pt-4"> 
                            <Form.Field {form} name="region">
                                <Form.Control let:attrs>
                                    <Form.Label>{translate(locale, "region")}*</Form.Label>
                                    <Input {...attrs} bind:value={$formData.region} placeholder="ex: concelho, freguesia" />
                                </Form.Control>
                                <Form.FieldErrors />
                            </Form.Field>
                            <Form.Field {form} name="phone_number">
                                <Form.Control let:attrs>
                                    <Form.Label>{translate(locale, "phoneNumber")}*</Form.Label>
                                    <Input {...attrs} bind:value={$formData.phone_number} placeholder="ex: +351 999 999 999" />
                                    <div class="flex flex-row space-x-2 px-2">
                                        <Checkbox name="showLink" id="checkbox-1" bind:checked={$formData.show_link}></Checkbox>
                                        <Label class="font-normal text-xs" for="checkbox-1">{translate(locale, "editProfile.link")}</Label>
                                    </div>
                                    </Form.Control>
                                <Form.FieldErrors />
                            </Form.Field>
                        </Card.Content>
                    </Card.Root>
                </div>
                <div class="flex flex-col w-full">
                    <Card.Root>
                        <Card.Content class="space-y-4 pt-6"> 
                            <Form.Field {form} name="display_name">
                                <Form.Control let:attrs> 
                                    <Form.Label>{translate(locale, "name")}</Form.Label>
                                    <Input {...attrs} bind:value={$formData.display_name} placeholder="ex: Maria Santos" />
                                </Form.Control>
                            </Form.Field>
                            <Form.Field {form} name="about_me">
                                <Form.Control let:attrs>
                                    <Form.Label>{translate(locale, "aboutMe")}</Form.Label>
                                    <Textarea 
                                        {...attrs} 
                                        bind:value={$formData.about_me} 
                                        placeholder="ex: Olá! Eu sou a Ana e sou professora. Vivo em Faro há 15 anos e no meu tempo livre gosto de correr à beira-mar." 
                                    />
                                </Form.Control>
                                <Form.FieldErrors />
                            </Form.Field>
                            <Form.Field {form} name="motivation">
                                <Form.Control let:attrs>
                                    <Form.Label>{translate(locale, "motivation")}</Form.Label>
                                    <Textarea 
                                        {...attrs} 
                                        bind:value={$formData.motivation} 
                                        placeholder="ex: Tive oportunidade de conhecer algumas famílias refugiadas e percebi a importância que podemos ter em ajudá-los. Por isso, entrei para esta comunidade para poder fazer parte de um grupo de patrocínio!"
                                    />
                                </Form.Control>
                                <Form.FieldErrors />
                            </Form.Field>
                            <div class="flex flex-row space-x-8">
                                <Form.Field {form} name="job">
                                    <Form.Control let:attrs>
                                        <Form.Label>{translate(locale, "profession")}</Form.Label>
                                        <Input {...attrs} bind:value={$formData.job} placeholder="ex: Professor" />
                                    </Form.Control>
                                    <Form.FieldErrors />
                                </Form.Field>
                                <Form.Field {form} name="birth_date">
                                    <Form.Control let:attrs>
                                        <Form.Label>{translate(locale, "birthdate")}</Form.Label>
                                        <DateField.Root 
                                            {...attrs}
                                            value={birth_date}
                                            onValueChange={(v) => {
                                                if (v) {
                                                    $formData.birth_date = v.toString();
                                                } else {
                                                    $formData.birth_date = null;
                                                }
                                            }}> 
                                            <DateField.Input 
                                                let:segments
                                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 items-center"
                                                >
                                                {#each segments as { part, value }}
                                                    <div class="inline-block select-none">
                                                    {#if part === "literal"}
                                                        <DateField.Segment {part} class="p-1 text-muted-foreground">
                                                        {value}
                                                        </DateField.Segment>
                                                    {:else}
                                                        <DateField.Segment
                                                        {part}
                                                        class="rounded-5px px-1 py-1 hover:bg-muted focus:bg-muted focus:text-foreground focus-visible:!ring-0 focus-visible:!ring-offset-0 aria-[valuetext=Empty]:text-muted-foreground"
                                                        >
                                                        {value}
                                                        </DateField.Segment>
                                                    {/if}
                                                    </div>
                                                {/each}
                                            </DateField.Input>
                                        </DateField.Root>
                                    </Form.Control>
                                    <Form.FieldErrors />
                                </Form.Field>
                            </div>
                            <Form.Field {form} name="completed_course">
                                <Form.Control let:attrs>
                                    <Form.Label>{translate(locale, "communitySponsorshipCourse")}</Form.Label>
                                    <RadioGroup.Root 
                                        bind:value={selectedCompletedCourse}
                                        onValueChange={(v) => {
                                            $formData.completed_course = Boolean(selectedCompletedCourse);
                                        }}>
                                        <div class="flex items-center space-x-2">
                                            <RadioGroup.Item value="false" id="r1" />
                                            <Label class="font-normal" for="r1">{translate(locale, "courseDoing")}</Label>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <RadioGroup.Item value="true" id="r2" />
                                            <Label class="font-normal" for="r2">{translate(locale, "courseDone")}</Label>
                                        </div>
                                        <RadioGroup.Input name="completedCourse" />
                                        </RadioGroup.Root>
                                </Form.Control>
                                <Form.FieldErrors />
                            </Form.Field>
                        </Card.Content>
                    </Card.Root>
                </div>
            </div>
        </div>
    </div>
</form>

<style>
	:global(.align-start) {
		text-align: start;
	}

</style>