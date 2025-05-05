<script lang="ts" generics="T extends TableRow<T>">
    import clsx from 'clsx';
    import { type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';
    import { Column } from './column.svelte';
    import { type TableRow } from './table.svelte';
    import { getTableContext } from './Table.svelte';

    interface Props {
        label: string;
        id: string;
        class?: ClassValue;
        row: T;
        /** If the type is incorrect pass the "row" property with the right type */
        width?: number;
        minWidth?: number;
        resizable?: boolean;
        children: Snippet<[props: { row: T }]>;
        onclick?: (e: Event) => void | Promise<void>;
        /** Cannot be used with resizable columns*/
        ignoreWidth?: boolean;
        filter?: Snippet;
    }

    let {
        label,
        id,
        class: clazz = '',
        row,
        width,
        resizable = true,
        children,
        onclick,
        ignoreWidth = false,
        filter,
        minWidth
    }: Props = $props();

    // Register the new column if this is the first table row that was rendered
    const table = getTableContext();
    const column = table.registerColumn(
        new Column({ label, id, width, resizable, filter, minWidth })
    );

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
    style={ignoreWidth ? '' : `width: ${column.width}px;`}
    class={twMerge(
        clsx(
            'mr-[7px] flex shrink-0 flex-row items-stretch justify-start truncate border-r',
            column.dragging && 'border-primary-400-600',
            !column.dragging && column.hovering && 'border-surface-300-700',
            clazz
        )
    )}
>
    {@render children({ row })}
</svelte:element>
