<script lang="ts" module>
    import type { Snippet } from 'svelte';
    import type { ClassValue, MouseEventHandler } from 'svelte/elements';
    import Popover, { type PopoverPlacement } from '../popover/Popover.svelte';

    export interface TooltipProps {
        onclick?: MouseEventHandler<HTMLElement>;
        class?: ClassValue;
        style?: string;
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
    }: TooltipProps = $props();

    let target = $state<HTMLElement>();
    let popover = $state<Popover>();

    let currentTimeout: number;
    function onpointerenter(e: PointerEvent) {
        if (e.pointerType === 'touch') return;

        clearTimeout(currentTimeout);
        if (timeout === 0) {
            popover?.open();
        } else {
            currentTimeout = setTimeout(() => {
                popover?.open();
            }, timeout) as unknown as number;
        }
    }

    function onpointerleave(e: PointerEvent) {
        if (e.pointerType === 'touch') return;

        clearTimeout(currentTimeout);
        popover?.close();
    }
</script>

<!-- 
    @component
    Shows additional information when hovering over an element.
-->
<svelte:element
    this={href ? 'a' : rest.onclick ? 'button' : 'div'}
    type={rest.onclick ? 'button' : undefined}
    {...rest}
    {href}
    bind:this={target}
    {onpointerenter}
    {onpointerleave}
>
    {@render children?.()}
</svelte:element>

<Popover bind:this={popover} popover="hint" {target} {placement} class={tooltipClass}>
    {#if typeof tooltip === 'string'}
        {tooltip}
    {:else}
        {@render tooltip()}
    {/if}
</Popover>
