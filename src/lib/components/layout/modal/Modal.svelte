<script lang="ts" module>
    import type { IvoryComponent } from '$lib/types';
    import { merge } from '$lib/utils/functions';
    import { type Snippet } from 'svelte';
    import type { ClassValue, MouseEventHandler } from 'svelte/elements';
    import { Dialog, type DialogProps } from '../dialog';

    /** Props for the modal, expose if you overwrite the defaults in a custom component */
    export type ModalProps = IvoryComponent<HTMLDivElement> & {
        /** Class of the modal itself, does not apply to the inner div */
        class?: ClassValue;
        dialog?: DialogProps;
        /** Content of the modal */
        children?: Snippet;
        onclick?: MouseEventHandler<HTMLDivElement>;
    };
</script>

<script lang="ts">
    let { children, dialog: dialogProps = {}, ...props }: ModalProps = $props();

    let dialog = $state<Dialog>();

    export const close = () => dialog?.close();
    export const open = () => dialog?.open();
    export const isOpen = () => dialog?.isOpen();

    export const toggle = () => {
        if (isOpen()) close();
        else open();
    };

    const onclick: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
        props.onclick?.(e);
    };
</script>

<!-- 
	@component
	A modal inside a dialog element
-->
<Dialog
    bind:this={dialog}
    {...dialogProps}
    class={merge(
        'flex h-full w-full flex-col items-center justify-center p-2 sm:p-4 md:p-8 lg:p-12 xl:p-16',
        dialogProps?.class
    )}
>
    <div
        {...props}
        {onclick}
        class={merge('modal-content transition-all ease-in-out', props.class)}
    >
        {@render children?.()}
    </div>
</Dialog>

<style>
    .modal-content {
        opacity: 0;
        transform: scale(0.97);
    }

    :global(dialog[open]) .modal-content {
        opacity: 1;
        transform: scale(1);
    }

    @starting-style {
        :global(dialog[open]) .modal-content {
            opacity: 0;
            transform: scale(0.97);
        }
    }
</style>
