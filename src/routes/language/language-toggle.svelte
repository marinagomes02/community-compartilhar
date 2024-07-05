<script lang="ts">
    import * as Select from '@/components/ui/select';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { setLanguagePreferenceSchema, type SetLanguagePreferenceSchema } from '@/schemas/language';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { languageOptions } from '@/utils/translation/translate-util';

    export let languagePreference: { language: string };

    const form = superForm(languagePreference, {
        validators: zodClient(setLanguagePreferenceSchema),
        dataType: 'json'
    });    

    const { form: formData, enhance, submitting } = form;

    const selectedLocale = {
        label: languagePreference.language,
        value: languagePreference.language,
    };
</script>

<form method="POST" use:enhance class="w-fit" action="/language?/setLanguagePreference">
    <input type="hidden" name="language" value={formData.language} />
    <Select.Root
        selected={selectedLocale}
        onSelectedChange={(v) => {
            if (v) {
                $formData.language = v.value;
                form.submit();
            }
        }}
    >
        <Select.Trigger class="bg-background-none border-none">
            <Select.Value 
                placeholder={selectedLocale.label}
                class="mr-2" />
        </Select.Trigger>
        <Select.Content>
            {#each languageOptions as l}
                <Select.Item 
                    value={l}
                ><p>{l}</p>
                </Select.Item>
            {/each}
        </Select.Content>
    </Select.Root>
</form>