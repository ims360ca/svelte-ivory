<script lang="ts">
    import { theme } from '$lib/theme.svelte';
    import type { DialogProps } from '../dialog';
    import Dialog from '../dialog/Dialog.svelte';

    let {
        class: clazz,

        ...rest
    }: DialogProps = $props();
</script>

<Dialog {...rest} class={['bg-surface-950-50/40', theme.current.hiddenBackground?.class, clazz]} />
