<script lang="ts">
    import { Toggle } from '$lib/components/basic/index';
    import { Modal } from '$lib/components/layout/index';
    import type { ModalVariant } from '$lib/components/layout/modal/Modal.svelte';

    let open = $state(false);
    let variant = $state<ModalVariant>();
</script>

<button
    onclick={() => {
        open = true;
    }}
    class="btn preset-tonal-primary"
>
    Open modal
</button>

<Modal bind:b_open={open} title="Modal" {variant}>
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
</Modal>
