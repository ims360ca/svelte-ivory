<script lang="ts">
    import TextArea from '../basic/Textarea.svelte';
    import Input, { type InputProps } from './Input.svelte';

    let { ...props }: InputProps<string> = $props();

    let inputElement = $state<TextArea>();
    export function focus() {
        inputElement?.focus();
    }
</script>

<Input {...props}>
    {#snippet children(inputProps)}
        {@const { name } = props.form.as('text')}
        <TextArea
            {...inputProps}
            {name}
            bind:value={props.form.value, props.form.set}
            bind:this={inputElement}
        />
    {/snippet}
</Input>
