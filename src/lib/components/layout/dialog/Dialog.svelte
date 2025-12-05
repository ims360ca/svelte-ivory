<script lang="ts" module>
    import { theme } from '$lib/theme.svelte';
    import type { IvoryComponent, TransitionProps } from '$lib/types';
    import { merge } from '$lib/utils/merge';
    import { onMount, tick } from 'svelte';
    import type { MouseEventHandler } from 'svelte/elements';
    import { fade } from 'svelte/transition';

    export interface DialogProps extends IvoryComponent<HTMLElement>, TransitionProps {
        /** Gets called when the dialog requests to close (Escape, backdrop click) */
        onclose?: () => void;
    }
</script>

<script lang="ts">
    let {
        class: clazz,
        onclose: close, // This is the prop from the parent
        children,
        inTransition = (e) => fade(e, { duration: 200 }),
        outTransition = (e) => fade(e, { duration: 200 }),
        ...rest
    }: DialogProps = $props();

    let dialog = $state<HTMLDialogElement>();

    /**
     * This function "requests" a close.
     * It tries to stop the native close and lets the parent decide.
     */
    async function requestClose(event: Event) {
        event.preventDefault(); // Stop the native close
        event.stopPropagation();
        close?.(); // Ask the parent to close
        await tick();
        await tick();
        dialog?.showModal();
    }

    onMount(() => {
        if (dialog && !dialog.open) {
            dialog.showModal();
        }
        return () => {
            if (dialog && dialog.open) {
                dialog.close();
            }
        };
    });

    const handleBackdropClick: MouseEventHandler<HTMLElement> = (event) => {
        if (event.target === dialog) {
            requestClose(event);
        }
    };
</script>

<dialog
    bind:this={dialog}
    onclick={handleBackdropClick}
    oncancel={requestClose}
    onclose={close}
    class={merge(
        'h-full max-h-none w-screen max-w-full bg-transparent backdrop:bg-transparent',
        theme.current.dialog?.class,
        clazz
    )}
    in:inTransition
    out:outTransition
    {...rest}
>
    {@render children?.()}
</dialog>
