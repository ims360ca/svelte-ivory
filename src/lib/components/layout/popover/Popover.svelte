<script lang="ts" module>
    import { theme } from '$lib/theme.svelte';
    import type { IvoryComponent } from '$lib/types';
    import { pseudoRandomId } from '$lib/utils/functions';
    import { merge } from '$lib/utils/merge';
    import { type ComputePositionConfig } from '@floating-ui/dom';
    import polyfill from '@oddbird/css-anchor-positioning/fn';

    // ... (Your existing types remain unchanged)
    type Alignment = 'start' | 'end';
    type Side = 'top' | 'bottom' | 'left' | 'right';
    type AlignedPlacement = `${Side}-${Alignment}` | Side;
    export type PopoverPlacement = ComputePositionConfig['placement'];

    const ANCHOR_STYLES: Record<string, string> = {
        // Bottom Placements
        'bottom-start': 'top: anchor(bottom); left: anchor(left);',
        bottom: 'top: anchor(bottom); left: anchor(center); translate: -50% 0;',
        'bottom-end': 'top: anchor(bottom); right: anchor(right);',

        // Top Placements
        'top-start': 'bottom: anchor(top); left: anchor(left);',
        top: 'bottom: anchor(top); left: anchor(center); translate: -50% 0;',
        'top-end': 'bottom: anchor(top); right: anchor(right);',

        // Left Placements
        'left-start': 'right: anchor(left); top: anchor(top);',
        left: 'right: anchor(left); top: anchor(center); translate: 0 -50%;',
        'left-end': 'right: anchor(left); bottom: anchor(bottom);',

        // Right Placements
        'right-start': 'left: anchor(right); top: anchor(top);',
        right: 'left: anchor(right); top: anchor(center); translate: 0 -50%;',
        'right-end': 'left: anchor(right); bottom: anchor(bottom);'
    };

    export interface PopoverProps extends IvoryComponent<HTMLDivElement> {
        target: HTMLElement | undefined;
        placement?: AlignedPlacement;
        autoplacement?: boolean;
    }
</script>

<script lang="ts">
    import { onMount, tick } from 'svelte';

    let {
        class: clazz,
        style: externalStyle,
        target,
        placement = 'bottom-start',
        children,
        popover = 'auto',
        id = pseudoRandomId(),
        ...rest
    }: PopoverProps = $props();

    let popoverEl: HTMLDivElement | undefined = $state();
    let currentlyOpen = $state(false);

    // 1. Load Polyfill
    // We import the 'fn' version to manually control execution,
    // ensuring it runs after the DOM is ready.
    onMount(async () => {
        if (!CSS.supports('position-anchor', '--foo')) {
            await polyfill();
            console.log('loaded polyfill');
        }
    });

    const anchorName = $derived(`--anchor-${id}`);

    // 2. Anchor Association
    $effect(() => {
        if (!target) return;
        const currentStyle = target.getAttribute('style') || '';
        if (!currentStyle.includes(anchorName)) {
            target.setAttribute('style', `anchor-name: ${anchorName}; ${currentStyle}`);
        }
        tick().then(() => polyfill());
    });

    $effect(() => {
        if (!popoverEl) return;

        // Use the explicit coordinates instead of position-area
        const coords = ANCHOR_STYLES[placement] ?? ANCHOR_STYLES['bottom-start'];

        // Important: We ensure position-area is NOT present
        const polyfillStyles = `
            position-anchor: ${anchorName}; 
            ${coords}
        `;

        const combinedStyle = `${externalStyle ? externalStyle + '; ' : ''}${polyfillStyles}`;
        popoverEl.setAttribute('style', combinedStyle);

        tick().then(() => polyfill());
    });

    export async function close() {
        popoverEl?.hidePopover();
    }

    export async function open() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (popoverEl?.showPopover as any)();
    }

    export async function toggle() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (popoverEl?.togglePopover as any)();
    }

    export function isOpen() {
        return currentlyOpen;
    }
</script>

<div
    {popover}
    class={merge('absolute m-0', theme.current.popover?.class, clazz)}
    bind:this={popoverEl}
    ontoggle={(e) => {
        currentlyOpen = e.newState === 'open';
    }}
    {...rest}
>
    {@render children?.()}
</div>
