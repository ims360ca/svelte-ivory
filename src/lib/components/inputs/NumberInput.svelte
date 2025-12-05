<script lang="ts">
    import InputBase, { type InputProps } from './Input.svelte';

    type Props = InputProps<number> & {
        min?: number;
        max?: number;
        step?: number;
    };

    let { min = undefined, step = 1, max, ...props }: Props = $props();
</script>

<InputBase {...props}>
    {#snippet children(inputProps)}
        <input {...inputProps} {...props.form.as?.('number')} {min} {max} {step} />
    {/snippet}
</InputBase>
