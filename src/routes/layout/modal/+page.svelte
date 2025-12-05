<script lang="ts">
    import { Toggle } from '$lib/components/basic/index';
    import { Modal, Popover } from '$lib/components/layout/index';
    import type { ModalVariant } from '$lib/components/layout/modal/Modal.svelte';
    import { Toasts } from '$lib/components/toast';

    let modal = $state<Modal>();
    let modal2 = $state<Modal>();
    let variant = $state<ModalVariant>();

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
        <option value="info">Info</option>
        <option value="warning">Warning</option>
        <option value="error">Error</option>
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
<Modal bind:this={modal2} title="Modal" closeOnOutsideClick={false}>Content</Modal>

<button class="bg-error-400-600" bind:this={popoverButton} onclick={() => popover?.open()}>
    Open popover
</button>
<Popover bind:this={popover} class="bg-surface-50-950 mt-2 rounded p-2" target={popoverButton}>
    Popover content
</Popover>
