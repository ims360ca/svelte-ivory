<script lang="ts">
    import { Toggle } from '$lib/components/basic/index';
    import { Modal, Popover } from '$lib/components/layout/index';
    import type { ModalVariant } from '$lib/components/layout/modal/Modal.svelte';

    let modal = $state<Modal>();
    let modal2 = $state<Modal>();
    let variant = $state<ModalVariant>();

    let popoverButton = $state<HTMLButtonElement>();
    let popover = $state<Popover>();
</script>

<button onclick={modal?.open} class="btn preset-tonal-primary"> Open modal </button>

<Modal bind:this={modal} title="Modal" {variant} closeOnOutsideClick={false}>
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
    <button class="btn" onclick={modal2?.open}> Open new modal </button>
</Modal>
<Modal bind:this={modal2} title="Modal" closeOnOutsideClick={false}>
    Content
    <button
        bind:this={popoverButton}
        onclick={() => {
            popover?.open();
        }}
    >
        Open popover
    </button>
</Modal>
<Popover bind:this={popover} class="bg-surface-50-950 rounded p-2" target={popoverButton}>
    Popover content
</Popover>
