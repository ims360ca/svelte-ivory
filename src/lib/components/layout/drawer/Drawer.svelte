<script lang="ts">
    import { X } from '@lucide/svelte';
    import clsx from 'clsx';
    import type { Snippet } from 'svelte';
    import { fly } from 'svelte/transition';
    import { twMerge } from 'tailwind-merge';
    import Heading from '../heading';
    import HiddenBackground from '../hiddenBackground';

    type DrawerPlacement = 'left' | 'right';

    interface Props {
        class?: string;
        b_open: boolean;
        title?: string;
        children: Snippet;
        placement?: DrawerPlacement;
    }

    let {
        class: clazz,
        b_open = $bindable(false),
        children,
        title,
        placement = 'right'
    }: Props = $props();

    const close = () => {
        b_open = false;
    };
</script>

{#if b_open}
    <HiddenBackground onclose={close}>
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
            transition:fly={{ x: placement === 'right' ? '100%' : '-100%', duration: 200 }}
            onclick={(e) => e.stopPropagation()}
        >
            <div class="flex flex-row items-center justify-between gap-8">
                {#if title}
                    <Heading>{title}</Heading>
                {/if}
                <button class="group ml-auto flex justify-end" type="button" onclick={close}>
                    <X class="h-full w-auto transition-[stroke-width] group-hover:stroke-3" />
                </button>
            </div>
            {@render children()}
        </div>
    </HiddenBackground>
{/if}
