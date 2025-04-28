<script lang="ts">
    import type { Snippet } from 'svelte';
    import Modal from './Modal.svelte';

    interface Props {
        open: boolean;
        testId: string;
        children: Snippet;
    }

    let { open, ...props }: Props = $props();

    let b_open = $state(open);
</script>

<Modal bind:b_open {...props} />
