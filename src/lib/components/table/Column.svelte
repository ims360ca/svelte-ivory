<script lang="ts" generics="T extends TableRow<T>">
    import clsx from 'clsx';
    import { type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';
    import type { ColumnConfig } from './column.svelte';
    import { type TableRow } from './table.svelte';
    import { getTableContext } from './Table.svelte';

    interface Props extends ColumnConfig {
        class?: ClassValue;
        row: T;
        /** If the type is incorrect pass the "row" property with the right type */
        children: Snippet<[props: { row: T }]>;
        onclick?: (e: Event) => void | Promise<void>;
        /** Cannot be used with resizable columns*/
        ignoreWidth?: boolean;
    }

    let {
        class: clazz = '',
        row,
        children,
        onclick,
        ignoreWidth = false,
        // ColummnConfig
        ...props
    }: Props = $props();

    // Register the new column if this is the first table row that was rendered
    const table = getTableContext();
    const column = table.registerColumn(props);

    // TODO this could be optimized
    $effect(() => {
        column.updateConfig(props);
    });

    const allowClicking = $derived(!!onclick);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
    this={allowClicking ? 'button' : 'div'}
    onclick={allowClicking
        ? (e: MouseEvent) => {
              e.stopPropagation();
              e.preventDefault();
              onclick?.(e);
          }
        : undefined}
    type={onclick ? 'button' : undefined}
    style={ignoreWidth ? '' : `width: ${column.width}px !important;`}
    class={twMerge(
        clsx(
            'flex shrink-0 flex-row items-stretch justify-start truncate',
            !ignoreWidth && [
                'border-r border-transparent',
                column.dragging && 'border-primary-400-600',
                !column.dragging && column.hovering && 'border-surface-300-700'
            ],
            clazz
        )
    )}
>
    {@render children({ row })}
</svelte:element>
