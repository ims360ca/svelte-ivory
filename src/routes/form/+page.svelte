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
    <TextInput label="Text" field={form.fields.text} />
    <EmailInput label="Email" field={form.fields.email} />
    <FileInput label="File" field={form.fields.file} class="col-span-2 row-span-2 h-full" />
    <PasswordInput label="Password" field={form.fields.password} />
    <PasswordCreateInput
        label="Password create"
        requirements={[
            { re: /[0-9]/, label: 'numberRequirement' },
            { re: /[a-z]/, label: 'lowercaseRequirement' },
            { re: /[A-Z]/, label: 'uppercaseRequirement' },
            { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'specialCharRequirement' },
            { re: /.{12,}/, label: 'lengthRequirement' }
        ]}
        field={form.fields.createPassword}
    />
    <NumberInput label="Number" field={form.fields.number} />
    <ColorInput label="Color" field={form.fields.color} />
    <CheckboxInput label="Checkbox" field={form.fields.checkbox} class="my-auto pt-5" />
    <ToggleInput label="Toggle" field={form.fields.toggle} class="my-auto pt-5" />
    <Select field={form.fields.select} label="Select">
        <SelectOption value="option1">Option 1</SelectOption>
        <SelectOption value="option2">Option 2</SelectOption>
    </Select>
    <button type="submit">Submit</button>
</form>
