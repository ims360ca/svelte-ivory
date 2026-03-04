<script lang="ts" module>
    import type { TransitionProps } from '$lib/types';
    import { merge } from '$lib/utils/functions';
    import { X } from '@lucide/svelte';
    import type { Snippet } from 'svelte';
    import { fly } from 'svelte/transition';
    import Heading from '../Heading.svelte';
    import { Dialog } from '../dialog';

    export type DrawerPlacement = 'left' | 'right';

    export type DrawerProps = TransitionProps & {
        class?: string;
        title?: string | Snippet;
        children: Snippet;
        placement?: DrawerPlacement;
        closeOnOutsideClick?: boolean;
        /** Overwrites entire content of the drawer */
        inner?: Snippet;
    };
</script>

<script lang="ts">
    let {
        class: clazz,
        children,
        title,
        placement = 'right',
        closeOnOutsideClick = true,
        inTransition = (e) =>
            fly(e, { x: placement === 'right' ? '100%' : '-100%', duration: 200 }),
        outTransition = (e) =>
            fly(e, { x: placement === 'right' ? '100%' : '-100%', duration: 200 }),
        inner,
        ...rest
    }: DrawerProps = $props();

    let currentlyOpen = $state(false);
    export function close() {
        currentlyOpen = false;
    }

    export function open() {
        currentlyOpen = true;
    }

    export function toggle() {
        currentlyOpen = !currentlyOpen;
    }

    export function isOpen() {
        return currentlyOpen;
    }
</script>

{#if currentlyOpen}
    <Dialog
        onclose={() => {
            if (closeOnOutsideClick) close();
        }}
    >
        <div
            class={merge([
                'bg-surface-50-950 absolute top-0 flex h-full flex-col gap-4 p-4',
                placement === 'left' && 'left-0',
                placement === 'right' && 'right-0',
                clazz
            ])}
            onclick={(e) => e.stopPropagation()}
            in:inTransition
            out:outTransition
            {...rest}
        >
            {#if inner}
                {@render inner()}
            {:else}
                <div class="flex flex-row items-center justify-between gap-8">
                    {#if title}
                        <Heading class="flex grow flex-row items-center gap-4">
                            {#if typeof title === 'function'}
                                {@render title()}
                            {:else}
                                {title}
                            {/if}
                        </Heading>
                    {/if}
                    <button class="group ml-auto flex justify-end" type="button" onclick={close}>
                        <X class="h-full w-auto transition-[stroke-width] group-hover:stroke-3" />
                    </button>
                </div>
                {@render children()}
            {/if}
        </div>
    </Dialog>
{/if}
