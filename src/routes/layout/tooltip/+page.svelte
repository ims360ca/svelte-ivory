<script lang="ts">
    import { Tooltip } from '$lib/components/layout';
    import { Toasts } from '$lib/components/toast';
    import { Bath } from '@lucide/svelte';

    function onClick() {
        Toasts.trigger({
            variant: 'success',
            message: 'Clicked'
        });
    }
</script>

<Tooltip tooltip="Tooltip" onclick={onClick} class="btn preset-tonal-primary">Hover me</Tooltip>
<Tooltip
    onclick={onClick}
    class="btn preset-tonal-primary"
    tooltipClass="flex flex-row items-center gap-2"
>
    Snippet tooltip
    {#snippet tooltip()}
        <Bath />
        <p class="font-bold">This is a tooltip</p>
    {/snippet}
</Tooltip>
