<script lang="ts">
    import Input, { type InputProps } from './Input.svelte';

    let props: InputProps<string> = $props();
</script>

<Input {...props}>
    {#snippet children(inputProps)}
        <input
            {...inputProps}
            {...props.form.as?.('email')}
            autocomplete="email"
            autocapitalize="off"
        />
    {/snippet}
</Input>
