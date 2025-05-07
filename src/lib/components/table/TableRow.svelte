<script lang="ts" generics="T extends GroupableRow & {children?: T[], id: string}">
    import { type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import type { GroupableRow } from './Table.svelte';
    import type { Table } from './table.svelte';

    interface Props<TI> {
        class?: ClassValue;
        row: TI;
        onclick?: (row: TI) => void;
        href?: (row: TI) => string;
        children: Snippet;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        table: Table<any>;
    }

    let {
        class: clazz = 'hover:bg-surface-950-50/15',
        row,
        onclick,
        href,
        children,
        table
    }: Props<T> = $props();

    function toggleExpansion(row: T) {
        if (table.expanded.has(row.id)) {
            table.expanded.delete(row.id);
        } else {
            table.expanded.add(row.id);
        }
    }

    const elementProps: {
        this: 'button' | 'a' | 'div';
        type?: 'button';
        onclick?: () => void;
        href?: string;
    } = $derived.by(() => {
        if (row.tableGroup) {
            return {
                this: 'button',
                type: 'button',
                onclick: () => {
                    toggleExpansion(row);
                }
            };
        } else if (onclick) {
            return {
                this: 'button',
                type: 'button',
                onclick: () => {
                    onclick(row);
                }
            };
        } else if (href) {
            return {
                this: 'a',
                href: href(row)
            };
        } else {
            return {
                this: 'div'
            };
        }
    });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
    this={elementProps.this}
    type={elementProps.type}
    href={elementProps.href}
    onclick={elementProps.onclick}
    class={['flex min-w-full shrink-0 flex-row items-stretch gap-4 overflow-hidden pr-4', clazz]}
>
    {@render children()}
</svelte:element>
