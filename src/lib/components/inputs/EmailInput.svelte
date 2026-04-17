<script lang="ts" module>
    import type { FullAutoFill } from 'svelte/elements';
    import Input, { type InputProps } from './Input.svelte';

    export type EmailInputProps = InputProps<string> & {
        autocomplete?: FullAutoFill;
    };
</script>

<script lang="ts">
    let { autocomplete = 'email', ...props }: EmailInputProps = $props();
</script>

<Input {...props}>
    {#snippet children(inputProps)}
        <input {...inputProps} {...props.form.as?.('email')} {autocomplete} autocapitalize="off" />
    {/snippet}
</Input>
