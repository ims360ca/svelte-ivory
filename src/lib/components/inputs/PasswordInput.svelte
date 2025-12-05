<script lang="ts">
    import type { InputProps } from './Input.svelte';
    import Input from './Input.svelte';

    type Props = InputProps<string> & {
        newPassword?: boolean;
        onfocusin?: () => void;
        onfocusout?: () => void;
    };

    let { newPassword = false, onfocusin, onfocusout, ...props }: Props = $props();
</script>

<Input {...props}>
    {#snippet children(inputProps)}
        <input
            {...inputProps}
            {...props.form.as?.('password')}
            type="password"
            autocapitalize="off"
            autocomplete={newPassword ? 'new-password' : 'current-password'}
            required
            {onfocusin}
            {onfocusout}
        />
    {/snippet}
</Input>
