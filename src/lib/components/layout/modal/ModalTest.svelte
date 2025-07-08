<script lang="ts">
    import Modal, { type ModalProps } from './Modal.svelte';

    let { open, ...props }: ModalProps & { open: boolean } = $props();

    let b_open = $state(open);
</script>

<Modal {...props} bind:b_open />
