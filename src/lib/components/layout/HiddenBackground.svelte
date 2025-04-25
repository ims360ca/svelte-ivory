<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { fade } from 'svelte/transition';
    import { focusTrap, shortcut } from '../../utils/actions/index';

    interface Props {
        class?: ClassValue;
        /** Gets called when the dialog is clicked */
        onclose?: () => void;
        children: Snippet;
    }

    let { class: clazz, onclose, children }: Props = $props();
</script>

<dialog
    class={['bg-surface-950-50/40 absolute top-0 left-0 z-40 m-0 h-full w-full p-0', clazz]}
    open
    use:focusTrap={true}
    use:shortcut={{
        code: 'Escape',
        callback: onclose ?? (() => {})
    }}
    onclick={onclose}
    transition:fade={{ duration: 200 }}
>
    {@render children()}
</dialog>
