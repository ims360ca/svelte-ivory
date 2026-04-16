<script lang="ts">
    import { Toasts } from '$lib';
    import { Modal, Popover } from '$lib/components/layout/index';
    import Tooltip from '$lib/components/layout/tooltip/Tooltip.svelte';

    let modal = $state<Modal>();
    let modal2 = $state<Modal>();

    let popoverButton = $state<HTMLButtonElement>();
    let popover = $state<Popover>();
</script>

<button onclick={modal?.open} class="btn preset-tonal-primary"> Open modal </button>

<Modal bind:this={modal} title="Modal">
    <button
        onclick={() => {
            Toasts.trigger({
                message: 'Hello world',
                variant: 'success'
            });
        }}
    >
        Trigger toast
    </button>
    <button class="btn" onclick={modal2?.open}> Open new modal </button>
</Modal>
<Modal bind:this={modal2} title="Modal">
    <Tooltip tooltip="content">Content</Tooltip>
</Modal>

<button class="bg-error-400-600" bind:this={popoverButton} onclick={() => popover?.open()}>
    Open popover
</button>
<Popover bind:this={popover} class="bg-surface-50-950 mt-2 rounded p-2" target={popoverButton}>
    Popover content
</Popover>
