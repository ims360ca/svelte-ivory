<script lang="ts">
    import {
        CheckboxInput,
        ColorInput,
        EmailInput,
        FileInput,
        NumberInput,
        PasswordCreateInput,
        PasswordInput,
        Select,
        SelectOption,
        TextInput,
        ToggleInput
    } from '$lib/components/inputs';
    import { remoteForm } from './form.remote';

    const form = remoteForm;
</script>

<form {...form} class="grid grid-cols-4 gap-4" enctype="multipart/form-data">
    <TextInput label="Text" form={form.fields.text} />
    <EmailInput label="Email" form={form.fields.email} />
    <FileInput label="File" form={form.fields.file} class="col-span-2 row-span-2 h-full" />
    <PasswordInput label="Password" form={form.fields.password} />
    <PasswordCreateInput
        label="Password create"
        requirements={[
            { re: /[0-9]/, label: 'numberRequirement' },
            { re: /[a-z]/, label: 'lowercaseRequirement' },
            { re: /[A-Z]/, label: 'uppercaseRequirement' },
            { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'specialCharRequirement' },
            { re: /.{12,}/, label: 'lengthRequirement' }
        ]}
        form={form.fields.createPassword}
    />
    <NumberInput label="Number" form={form.fields.number} />
    <ColorInput label="Color" form={form.fields.color} />
    <CheckboxInput label="Checkbox" form={form.fields.checkbox} class="my-auto pt-5" />
    <ToggleInput label="Toggle" form={form.fields.toggle} class="my-auto pt-5" />
    <Select form={form.fields.select} label="Select">
        <SelectOption value="option1">Option 1</SelectOption>
        <SelectOption value="option2">Option 2</SelectOption>
    </Select>
    <button type="submit">Submit</button>
</form>
