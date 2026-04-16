<script lang="ts" module>
    import { theme } from '$lib/theme.svelte';
    import type { IvoryComponent } from '$lib/types';
    import { merge } from '$lib/utils/functions';
    import type { EventHandler, MouseEventHandler } from 'svelte/elements';

    export type DialogProps = IvoryComponent<HTMLDialogElement>;
</script>

<script lang="ts">
    let { children, ...props }: DialogProps = $props();

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

    const onclick: MouseEventHandler<HTMLDialogElement> = (event) => {
        if (event.target !== dialog) return;
        if (props.onclick) props.onclick(event);
        else close();
    };

    const onclose: EventHandler<Event, HTMLDialogElement> = (event) => {
        props.onclose?.(event);
        currentlyOpen = false;
    };

    const oncancel: EventHandler<Event, HTMLDialogElement> = (event) => {
        if (props.oncancel) props.oncancel(event);
        else props.onclose?.(event);
        currentlyOpen = false;
    };
</script>

<dialog
    bind:this={dialog}
    {...props}
    {oncancel}
    {onclose}
    {onclick}
    class={merge(
        'backdrop:bg-surface-800-200/30 h-full max-h-none w-screen max-w-full overflow-hidden bg-transparent',
        theme.current.dialog?.class,
        props.class
    )}
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
