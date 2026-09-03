<script lang="ts">
    import type { InputProps } from './Input.svelte';
    import Input from './Input.svelte';

    type Props = InputProps<string> & {
        onfocusin?: () => void;
        onfocusout?: () => void;
    };

    let { onfocusin, onfocusout, ...props }: Props = $props();
</script>

<Input {...props}>
    {#snippet children(inputProps)}
        <input {...inputProps} {...props.form.as?.('password')} {onfocusin} {onfocusout} />
    {/snippet}
</Input>
