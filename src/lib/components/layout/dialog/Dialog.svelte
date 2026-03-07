<script lang="ts" module>
    import { theme } from '$lib/theme.svelte';
    import type { IvoryComponent } from '$lib/types';
    import { merge } from '$lib/utils/functions';
    import { onMount, tick } from 'svelte';
    import type { MouseEventHandler } from 'svelte/elements';

    export interface DialogProps extends IvoryComponent<HTMLElement> {
        /** Gets called when the dialog requests to close (Escape, backdrop click) */
        onclose?: () => void;
    }
</script>

<script lang="ts">
    let {
        class: clazz,
        onclose: close, // This is the prop from the parent
        children,
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
        'backdrop:bg-surface-800-200/30 h-full max-h-none w-screen max-w-full overflow-hidden bg-transparent',
        theme.current.dialog?.class,
        clazz
    )}
    {...rest}
>
    {@render children?.()}
</dialog>

<style>
    dialog::backdrop {
        animation: fade-in 200ms ease-out;
    }
    @keyframes fade-in {
        from {
            opacity: 0;
        }
    }
</style>
