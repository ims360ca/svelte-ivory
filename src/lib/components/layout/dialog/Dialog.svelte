<script lang="ts" module>
    import { theme } from '$lib/theme.svelte';
    import type { IvoryComponent } from '$lib/types';
    import { merge } from '$lib/utils/functions';
    import type { MouseEventHandler } from 'svelte/elements';

    export interface DialogProps extends IvoryComponent<HTMLElement> {
        /** Gets called when the dialog requests to close (Escape, backdrop click) */
        onclose?: () => void;
    }
</script>

<script lang="ts">
    let {
        class: clazz,
        onclose: onclose, // This is the prop from the parent
        children,
        ...rest
    }: DialogProps = $props();

    let dialog = $state<HTMLDialogElement>();

    let currentlyOpen = $state(false);

    export const open = () => {
        dialog?.showModal();
        currentlyOpen = true;
    };

    export const isOpen = () => currentlyOpen;

    export const close = () => {
        dialog?.close();
        currentlyOpen = false;
    };

    const handleBackdropClick: MouseEventHandler<HTMLElement> = (event) => {
        if (event.target !== dialog) return;
        onclose?.();
    };

    const handleClose = () => {
        onclose?.();
        currentlyOpen = false;
    };
</script>

<dialog
    bind:this={dialog}
    onclick={handleBackdropClick}
    oncancel={handleClose}
    onclose={handleClose}
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
    dialog {
        transition:
            display var(--tw-duration, var(--default-transition-duration)) allow-discrete,
            overlay var(--tw-duration, var(--default-transition-duration)) allow-discrete;
    }

    /* Dialog backdrop fade-in animation */
    dialog::backdrop {
        opacity: 0;
        transition:
            display var(--tw-duration, var(--default-transition-duration)) allow-discrete,
            overlay var(--tw-duration, var(--default-transition-duration)) allow-discrete,
            opacity var(--tw-duration, var(--default-transition-duration))
                cubic-bezier(0.16, 1, 0.3, 1),
            backdrop-filter var(--tw-duration, var(--default-transition-duration))
                cubic-bezier(0.16, 1, 0.3, 1);
    }

    dialog[open]::backdrop {
        opacity: 1;
    }

    /* Starting style for entry animation */
    @starting-style {
        dialog[open]::backdrop {
            opacity: 0;
            backdrop-filter: blur(0);
        }
    }

    dialog:not([open]):not(:popover-open) {
        display: none !important;
    }
</style>
