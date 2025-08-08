<script lang="ts" module>
    import type { IvoryComponent, TransitionProps } from '$lib/types';
    import { X } from '@lucide/svelte';
    import clsx from 'clsx';
    import type { Snippet } from 'svelte';
    import { fly } from 'svelte/transition';
    import { twMerge } from 'tailwind-merge';
    import { Portal } from '..';
    import Heading from '../heading';
    import HiddenBackground from '../hiddenBackground';

    export type DrawerPlacement = 'left' | 'right';

    export interface DrawerProps extends IvoryComponent<HTMLDivElement>, TransitionProps {
        class?: string;
        b_open: boolean;
        title?: string;
        children: Snippet;
        placement?: DrawerPlacement;
    }
</script>

<script lang="ts">
    let {
        class: clazz,
        b_open = $bindable(false),
        children,
        title,
        placement = 'right',
        inTransition = (e) =>
            fly(e, { x: placement === 'right' ? '100%' : '-100%', duration: 200 }),
        outTransition = (e) =>
            fly(e, { x: placement === 'right' ? '-100%' : '100%', duration: 200 }),
        ...rest
    }: DrawerProps = $props();

    const onclose = () => {
        b_open = false;
    };
</script>

{#if b_open}
    <Portal>
        <HiddenBackground {onclose}>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class={twMerge(
                    clsx([
                        'bg-surface-50-950 absolute top-0 flex h-full flex-col gap-4 p-4',
                        placement === 'left' && 'left-0',
                        placement === 'right' && 'right-0',
                        clazz
                    ])
                )}
                onclick={(e) => e.stopPropagation()}
                in:inTransition
                out:outTransition
                {...rest}
            >
                <div class="flex flex-row items-center justify-between gap-8">
                    {#if title}
                        <Heading>{title}</Heading>
                    {/if}
                    <button class="group ml-auto flex justify-end" type="button" onclick={onclose}>
                        <X class="h-full w-auto transition-[stroke-width] group-hover:stroke-3" />
                    </button>
                </div>
                {@render children()}
            </div>
        </HiddenBackground>
    </Portal>
{/if}
