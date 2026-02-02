<script lang="ts">
    import type { Variant } from '$lib';
    import { Toggle } from '$lib/components/basic/index';
    import { Modal, Popover } from '$lib/components/layout/index';
    import Tooltip from '$lib/components/layout/tooltip/Tooltip.svelte';
    import { Toasts } from '$lib/components/toast';

    let modal = $state<Modal>();
    let modal2 = $state<Modal>();
    let variant = $state<Variant>();

    let popoverButton = $state<HTMLButtonElement>();
    let popover = $state<Popover>();
</script>

<button onclick={modal?.open} class="btn preset-tonal-primary"> Open modal </button>

<Modal bind:this={modal} title="Modal" {variant}>
    <p>Content</p>
    <button
        class="flex flex-row items-center gap-2"
        onclick={() => {
            if (!variant) variant = 'success';
            else variant = undefined;
        }}
    >
        <Toggle value={!!variant} />
        Variant
    </button>
    <select bind:value={variant}>
        <option value="success">Success</option>
        <option value="primary">Info</option>
        <option value="warning">Warning</option>
        <option value="error">Error</option>
        <option value="secondary">secondary</option>
        <option value="tertiary">tertiary</option>
    </select>
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
<Modal bind:this={modal2} title="Modal" closeOnOutsideClick={false}>
    <Tooltip tooltip="content">Content</Tooltip>
</Modal>

<button class="bg-error-400-600" bind:this={popoverButton} onclick={() => popover?.open()}>
    Open popover
</button>
<Popover bind:this={popover} class="bg-surface-50-950 mt-2 rounded p-2" target={popoverButton}>
    Popover content
</Popover>
