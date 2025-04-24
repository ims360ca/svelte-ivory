<script lang="ts" module>
    import { browser } from '$app/environment';
    import {
        autoPlacement,
        autoUpdate,
        computePosition,
        flip,
        shift,
        type ComputePositionConfig
    } from '@floating-ui/dom';
    import clsx from 'clsx';
    import type { Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';
    import { clickOutside } from '../../../utils/actions/clickOutside';

    /** Possible placements for the popover */
    export type PopoverPlacement = ComputePositionConfig['placement'];
</script>

<script lang="ts">
    type Props = {
        class?: ClassValue;
        /** Whether the popover is open or not */
        b_open: boolean;
        style?: string;
        /** The element the popover will be positioned relative to */
        target: Element | undefined;
        /**
         * Where the popover should be positioned relative to the target.
         *
         * default: `bottom-start`
         */
        placement?: PopoverPlacement;
        /**
         * Callback that is called when the user clicks outside the popover or the target element.
         */
        onClickOutside?: (e: MouseEvent) => void;
        /** If set to `true`, the nested component will not be unmounted when the popover is closed */
        keepMounted?: boolean;
        children: Snippet;
        /**
         * Whether to place the popover automatically
         *
         * [Further reading](https://floating-ui.com/docs/autoPlacement)
         */
        autoplacement?: boolean;
    };

    let {
        class: clazz,
        b_open = $bindable(false),
        style: externalStyle,
        target,
        placement = 'bottom-start',
        onClickOutside = () => {
            b_open = false;
        },
        keepMounted = false,
        children,
        autoplacement
    }: Props = $props();

    let style: string = $state('');
    let popover: HTMLDivElement | undefined = $state();

    const postion = async (open: boolean) => {
        if (!open || !popover || !browser || !target) return;
        const { x, y } = await computePosition(target, popover, {
            middleware: [shift(), ...(autoplacement ? [autoPlacement()] : [flip()])],
            placement
        });
        style = `top: ${y}px; left: ${x}px;`;
    };

    let cleanup: () => void = () => {};
    $effect(() => {
        if (browser && popover && target)
            if (b_open) {
                cleanup = autoUpdate(target, popover, () => postion(b_open));
            } else {
                cleanup();
            }
    });

    // TODO: this is kinda hacky
    $effect(() => {
        [popover, target];
        postion(b_open);
    });
</script>

<!-- 
    @component
    A popover, positions itself relative to a target element.
-->
{#if b_open || keepMounted}
    <div
        class={twMerge(
            clsx('absolute z-30', !keepMounted && clazz, keepMounted && !b_open ? 'hidden' : clazz)
        )}
        style={style + ' ' + externalStyle}
        bind:this={popover}
        use:clickOutside={{ callback: onClickOutside, target }}
    >
        {@render children()}
    </div>
{/if}
