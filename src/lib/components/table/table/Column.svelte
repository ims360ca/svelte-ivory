<script lang="ts" module>
    import clsx from 'clsx';
    import { type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';
    import type { ColumnConfig } from './column.svelte';
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
        width,
        ...props
    }: ColumnProps = $props();

    // Register the new column if this is the first table row that was rendered
    const table = getTableContext();
    const column = table.registerColumn({ resizable, ...props });
    const allowClicking = $derived(!!onclick);

    // passes updated props to the column
    $effect(() => {
        column.updateConfig({ resizable, ...props });
    });

    // this must be separate to the above effect, since otherwise the width would be reset on every scroll
    $effect(() => {
        column.resize(width);
    });

    function onClick(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        onclick?.(e);
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
    this={allowClicking ? 'button' : 'div'}
    onclick={allowClicking ? onClick : undefined}
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
            defaultClasses,
            clazz
        )
    )}
>
    {@render children()}
</svelte:element>
