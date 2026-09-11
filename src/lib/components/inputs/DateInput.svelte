<script lang="ts">
    import Input, { type InputProps } from './Input.svelte';

    let { fixLabel = true, ...props }: InputProps<string> = $props();
</script>

<Input {...props} {fixLabel}>
    {#snippet children(inputProps)}
        <input {...inputProps} {...props.field.as?.('date')} />
    {/snippet}
</Input>
