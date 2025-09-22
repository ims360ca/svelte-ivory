<script lang="ts" module>
    import clsx from 'clsx';
    import { type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';
    import type { ColumnConfig } from './columnController.svelte';
    import { getRowContext } from './Row.svelte';
    import { getTableContext } from './Table.svelte';

    let defaultClasses = $state<ClassValue>();

    export function setClasses(c: ClassValue) {
        defaultClasses = c;
    }

    export interface ColumnProps extends ColumnConfig {
        class?: ClassValue;
        /** If the type is incorrect pass the "row" property with the right type */
        children: Snippet;
        onclick?: (e: Event) => void | Promise<void>;
        /** Cannot be used with resizable columns*/
        ignoreWidth?: boolean;
        offsetNestingLevel?: number;
    }
</script>

<script lang="ts">
    let {
        class: clazz = 'py-2 flex flex-row items-center',
        children,
        onclick,
        ignoreWidth = false,
        // ColumnConfig
        resizable = true,
        offsetNestingLevel = 0,
        ...props
    }: ColumnProps = $props();

    // Register the new column if this is the first table row that was rendered
    const tableContext = getTableContext();
    const rowContext = getRowContext();
    const column = tableContext.registerColumn({ resizable, ...props });

    const finalOnClick = $derived(onclick || rowContext.onclick);
    const allowClicking = $derived(!!onclick);

    const element = $derived.by(() => {
        if (finalOnClick) return 'button';
        if (rowContext.href) return 'a';
        return 'div';
    });

    // passes updated props to the column
    $effect(() => {
        column.updateConfig({ resizable, ...props });
    });

    // this must be separate to the above effect, since otherwise the width would be reset on every scroll
    $effect(() => {
        if (!column.resizable && props.width !== undefined) column.resize(props.width);
    });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
    this={element}
    onclick={allowClicking ? finalOnClick : undefined}
    href={rowContext.href}
    type={allowClicking ? 'button' : undefined}
    style={ignoreWidth
        ? ''
        : `width: calc(${column.width ?? 0}px - var(--spacing) * ${offsetNestingLevel * tableContext.nestingInset}) !important;`}
    class={[
        'relative flex h-full shrink-0 flex-row items-stretch justify-start truncate',
        !ignoreWidth && [
            'after:absolute after:inset-y-0 after:right-2 after:box-content after:w-px',
            column.dragging && 'after:bg-primary-400-600',
            !column.dragging && column.hovering && 'after:bg-surface-300-700'
        ]
    ]}
>
    <div class={twMerge(clsx(['flex flex-row items-center gap-1', defaultClasses, clazz]))}>
        {@render children()}
    </div>
</svelte:element>
