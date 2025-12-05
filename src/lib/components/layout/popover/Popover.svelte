<script lang="ts" module>
    import { browser } from '$app/environment';
    import { theme } from '$lib/theme.svelte';
    import type { IvoryComponent } from '$lib/types';
    import { clickOutside } from '$lib/utils/attachments';
    import {
        autoPlacement,
        autoUpdate,
        computePosition,
        flip,
        shift,
        type ComputePositionConfig
    } from '@floating-ui/dom';
    import clsx from 'clsx';
    import { twMerge } from 'tailwind-merge';

    /** Possible placements for the popover */
    export type PopoverPlacement = ComputePositionConfig['placement'];

    export interface PopoverProps extends IvoryComponent<HTMLDivElement> {
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
        /**
         * Whether to place the popover automatically
         *
         * [Further reading](https://floating-ui.com/docs/autoPlacement)
         */
        autoplacement?: boolean;
    }
</script>

<script lang="ts">
    let {
        class: clazz,
        style: externalStyle,
        target,
        placement = 'bottom-start',
        onClickOutside = close,
        children,
        autoplacement,
        ...rest
    }: PopoverProps = $props();

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

    let currentlyOpen = $state(false);

    let cleanup: () => void = () => {};
    export function close() {
        currentlyOpen = false;
        cleanup();
    }

    export function open() {
        currentlyOpen = true;
        if (!target || !popover) return;
        cleanup = autoUpdate(target, popover, () => postion(true));
    }

    export function toggle() {
        currentlyOpen = !currentlyOpen;
    }

    export function isOpen() {
        return currentlyOpen;
    }

    // TODO: this is kinda hacky
    $effect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        [popover, target];
        postion(currentlyOpen);
    });
</script>

<!-- 
    @component
    A popover, positions itself relative to a target element.
-->
{#if currentlyOpen}
    <div
        class={twMerge(clsx('absolute', theme.current.popover?.class, clazz))}
        style={style + ' ' + externalStyle}
        bind:this={popover}
        {@attach clickOutside({ callback: onClickOutside, target })}
        {...rest}
    >
        {@render children?.()}
    </div>
{/if}
