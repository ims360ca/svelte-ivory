<script lang="ts" module>
    import type { IvoryComponent } from '$lib/types';
    import { merge } from '$lib/utils/functions';
    import type { Snippet } from 'svelte';
    import type { MouseEventHandler } from 'svelte/elements';
    import { Dialog, type DialogProps } from '../dialog';

    export type DrawerPlacement = 'left' | 'right';
    export type DrawerProps = IvoryComponent<HTMLDivElement> & {
        class?: string;
        children?: Snippet;
        placement?: DrawerPlacement;
        dialog?: DialogProps;
    };
</script>

<script lang="ts">
    let {
        class: clazz,
        children,
        placement = 'right',
        dialog: dialogProps,
        ...props
    }: DrawerProps = $props();

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

<Dialog
    bind:this={dialog}
    {...dialogProps}
    class={merge(
        'flex flex-row justify-start overflow-visible',
        placement === 'right' && 'justify-end',
        dialogProps?.class
    )}
>
    <div
        data-placement={placement}
        class={merge(
            'drawer bg-surface-50-950 flex h-full flex-col gap-4 p-4 transition-transform ease-in-out',
            clazz
        )}
        {...props}
        {onclick}
    >
        {@render children?.()}
    </div>
</Dialog>

<style>
    .drawer[data-placement='right'] {
        transform: translateX(100%);
    }
    .drawer[data-placement='left'] {
        transform: translateX(-100%);
    }

    :global(dialog[open]) .drawer {
        transform: translateX(0);
    }

    @starting-style {
        :global(dialog[open]) .drawer[data-placement='right'] {
            transform: translateX(100%);
        }
        :global(dialog[open]) .drawer[data-placement='left'] {
            transform: translateX(-100%);
        }
    }
</style>
