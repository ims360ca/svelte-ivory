<script lang="ts">
    import Input, { type InputProps } from './Input.svelte';

    let { ...props }: InputProps<string> = $props();

    let inputElement = $state<HTMLInputElement>();
    export function focus() {
        inputElement?.focus();
    }
</script>

<Input {...props}>
    {#snippet children(inputProps)}
        <input {...inputProps} {...props.form.as?.('text')} bind:this={inputElement} />
    {/snippet}
</Input>
