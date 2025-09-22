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
        class: clazz,
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
    const allowClicking = $derived(!!(onclick || rowContext.onclick));

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

    const widthStyle = $derived(
        `calc(${column.width ?? 0}px - var(--spacing) * ${offsetNestingLevel * tableContext.nestingInset}) !important;`
    );
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
    this={element}
    onclick={allowClicking ? finalOnClick : undefined}
    href={!allowClicking ? rowContext.href : undefined}
    type={allowClicking ? 'button' : undefined}
    style={ignoreWidth ? '' : `width: ${widthStyle}`}
    class={twMerge(
        clsx([
            'box-border flex h-full shrink-0 flex-row items-center justify-start gap-1 truncate',
            column.width !== 0 && 'pr-2',
            defaultClasses,
            clazz
        ])
    )}
>
    {@render children()}
</svelte:element>
