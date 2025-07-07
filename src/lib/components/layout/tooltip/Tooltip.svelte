<script lang="ts" module>
    import type { IvoryComponent } from '$lib/types';
    import clsx from 'clsx';
    import type { Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';
    import Popover, { type PopoverPlacement } from '../popover/Popover.svelte';
    import Portal from '../portal/Portal.svelte';

    export interface Props extends IvoryComponent<HTMLElement> {
        children?: Snippet;
        /** The content of the tooltip */
        tooltip: string | Snippet;
        /** The class of the tooltip itself */
        tooltipClass?: ClassValue;
        /** If the href is set, the resulting element will be a link to the href */
        href?: string;
        /**
         * The delay before the tooltip is shown in ms.
         *
         * default: `500`
         */
        timeout?: number;
        /**
         * Where the tooltip should be placed
         *
         * default: `top`
         */
        placement?: PopoverPlacement;
    }
</script>

<script lang="ts">
    let {
        children,
        tooltip,
        href,
        timeout = 500,
        tooltipClass,
        placement = 'top',
        ...rest
    }: Props = $props();

    let target = $state<HTMLElement>();

    let open = $state(false);

    let currentTimeout: number;
    function onmouseenter() {
        clearTimeout(currentTimeout);
        if (timeout === 0) {
            open = true;
        } else {
            currentTimeout = setTimeout(() => {
                open = true;
            }, timeout) as unknown as number;
        }
    }

    function onmouseleave() {
        clearTimeout(currentTimeout);
        open = false;
    }
</script>

<!-- 
    @component
    Shows additional information when hovering over an element.
-->

<!-- Ignoring this error is fine since it's a false positive -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
    this={href ? 'a' : onclick ? 'button' : 'div'}
    type={onclick ? 'button' : undefined}
    {...rest}
    {href}
    bind:this={target}
    {onmouseenter}
    {onmouseleave}
>
    {@render children?.()}
</svelte:element>

{#if open}
    <Portal>
        <Popover
            bind:b_open={open}
            {target}
            {placement}
            class={twMerge(
                clsx(
                    'bg-surface-50-950 max-w-96 -translate-y-0.5 rounded px-4 py-1 shadow-lg',
                    tooltipClass
                )
            )}
        >
            {#if typeof tooltip === 'string'}
                {tooltip}
            {:else}
                {@render tooltip()}
            {/if}
        </Popover>
    </Portal>
{/if}
