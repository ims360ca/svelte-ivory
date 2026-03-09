<script lang="ts" module>
    import { theme } from '$lib/theme.svelte';
    import type { IvoryComponent } from '$lib/types';
    import { merge, pseudoRandomId } from '$lib/utils/functions';

    /** Possible placements for the popover */
    export type PopoverPlacement =
        | 'top'
        | 'top-start'
        | 'top-end'
        | 'right'
        | 'right-start'
        | 'right-end'
        | 'bottom'
        | 'bottom-start'
        | 'bottom-end'
        | 'left'
        | 'left-start'
        | 'left-end';

    export interface PopoverProps extends IvoryComponent<HTMLDivElement> {
        /** The element the popover will be positioned relative to */
        target: HTMLElement | undefined;
        /**
         * Where the popover should be positioned relative to the target.
         *
         * default: `bottom-start`
         */
        placement?: PopoverPlacement;
        /**
         * Whether to place the popover automatically
         */
        autoplacement?: boolean;
    }
</script>

<script lang="ts">
    let {
        class: clazz,
        style: externalStyle,
        placement = 'bottom-start',
        autoplacement = true,
        popover = 'auto',
        target,
        children,
        ...rest
    }: PopoverProps = $props();

    let popoverEl: HTMLDivElement | undefined = $state();
    const anchorName = `--${pseudoRandomId('anchor-')}`;

    const getStyles = (
        placement: PopoverPlacement,
        anchorName: string,
        autoplacement?: boolean
    ) => {
        let styles = `position-anchor: ${anchorName}; margin: 0; inset: auto;`;
        if (autoplacement) {
            styles += ` position-try: flip-block, flip-inline;`;
        }

        switch (placement) {
            case 'top':
                return (
                    styles +
                    ` bottom: anchor(${anchorName} top); left: anchor(${anchorName} center); translate: -50% 0;`
                );
            case 'top-start':
                return (
                    styles +
                    ` bottom: anchor(${anchorName} top); left: anchor(${anchorName} start);`
                );
            case 'top-end':
                return (
                    styles + ` bottom: anchor(${anchorName} top); right: anchor(${anchorName} end);`
                );

            case 'bottom':
                return (
                    styles +
                    ` top: anchor(${anchorName} bottom); left: anchor(${anchorName} center); translate: -50% 0;`
                );
            case 'bottom-start':
                return (
                    styles +
                    ` top: anchor(${anchorName} bottom); left: anchor(${anchorName} start);`
                );
            case 'bottom-end':
                return (
                    styles + ` top: anchor(${anchorName} bottom); right: anchor(${anchorName} end);`
                );

            case 'left':
                return (
                    styles +
                    ` right: anchor(${anchorName} left); top: anchor(${anchorName} center); translate: 0 -50%;`
                );
            case 'left-start':
                return (
                    styles + ` right: anchor(${anchorName} left); top: anchor(${anchorName} top);`
                );
            case 'left-end':
                return (
                    styles +
                    ` right: anchor(${anchorName} left); bottom: anchor(${anchorName} bottom);`
                );

            case 'right':
                return (
                    styles +
                    ` left: anchor(${anchorName} right); top: anchor(${anchorName} center); translate: 0 -50%;`
                );
            case 'right-start':
                return (
                    styles + ` left: anchor(${anchorName} right); top: anchor(${anchorName} top);`
                );
            case 'right-end':
                return (
                    styles +
                    ` left: anchor(${anchorName} right); bottom: anchor(${anchorName} bottom);`
                );

            default:
                return (
                    styles +
                    ` top: anchor(${anchorName} bottom); left: anchor(${anchorName} start);`
                );
        }
    };

    let currentlyOpen = $state(false);
    let style = $derived(getStyles(placement, anchorName, autoplacement));

    $effect(() => {
        if (target) {
            target.style.setProperty('anchor-name', anchorName);
            return () => {
                target.style.removeProperty('anchor-name');
            };
        }
    });

    $effect(() => {
        if (!popoverEl) return;

        const handleToggle = (e: ToggleEvent) => {
            const newState = e.newState === 'open';
            currentlyOpen = newState;
        };

        popoverEl.addEventListener('toggle', handleToggle);
        return () => popoverEl?.removeEventListener('toggle', handleToggle);
    });

    export function close() {
        popoverEl?.hidePopover();
    }

    export function open() {
        if (popoverEl) popoverEl.showPopover();
    }

    export function toggle() {
        if (currentlyOpen) close();
        else open();
    }

    // Now this is reactive!
    export function isOpen() {
        return currentlyOpen;
    }
</script>

<div
    bind:this={popoverEl}
    style="{style} {externalStyle}"
    {popover}
    class={merge('bg-transparent not-open:hidden!', theme.current.popover?.class, clazz)}
    {...rest}
>
    {@render children?.()}
</div>
