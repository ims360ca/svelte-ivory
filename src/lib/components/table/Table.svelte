<script lang="ts" module>
    import { ChevronRight } from '@lucide/svelte';
    import clsx from 'clsx';
    import { getContext, setContext, type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';
    import Column from './Column.svelte';
    import ColumnHead from './ColumnHead.svelte';
    import TableRow from './Row.svelte';
    import { Table } from './table.svelte';
    import VirtualList from './VirtualList.svelte';

    export interface TableProps<T extends { id: string }> {
        class?: ClassValue;
        data: T[];
        onclick?: (row: T) => void;
        href?: (row: T) => string;
    }

    const TABLE_CONTEXT = {};
    function setTableContext<T extends { id: string; children?: T[] | undefined }>(
        table: Table<T>
    ) {
        setContext(TABLE_CONTEXT, table);
    }

    export function getTableContext<
        T extends { id: string; children?: T[] | undefined }
    >(): Table<T> {
        return getContext<Table<T>>(TABLE_CONTEXT);
    }
</script>

<script lang="ts" generics="T extends { id: string, children?: T[] }">
    interface Props<TI extends { id: string }> extends TableProps<TI> {
        /** Renders the rows */
        children: Snippet<[{ row: TI; nestingLevel?: number }]>;
        /** Add columns in front of the tree-indicator */
        firstColumn?: Snippet<[{ row: TI }]>;
        rowClass?: ClassValue;
        headerClass?: ClassValue;
    }

    let {
        class: clazz,
        data,
        children: passedChildren,
        firstColumn,
        rowClass,
        headerClass,
        ...props
    }: Props<T> = $props();

    let table: Table<T> = new Table({
        get data() {
            return data;
        }
    });

    setTableContext(table);
    const treeIndicatorId = crypto.randomUUID();
</script>

<VirtualList
    data={table.results.entries}
    class={twMerge(clsx('border-transparent', clazz, 'flex flex-col overflow-hidden'))}
    b_scrollTop={50}
>
    {#snippet header()}
        <div
            class={twMerge(
                clsx(
                    'flex w-fit min-w-full flex-row gap-4 border-b border-inherit pr-4',
                    headerClass
                )
            )}
        >
            {#each table.columns as column (column.id)}
                <ColumnHead {column}>
                    {#if typeof column.header === 'function'}
                        {@render column.header()}
                    {:else}
                        <div
                            class="text-surface-600-400 flex grow flex-row items-center justify-start gap-4 py-2 text-start font-bold select-none"
                        >
                            {column.header}
                        </div>
                    {/if}
                </ColumnHead>
            {/each}
        </div>
    {/snippet}
    {#snippet children({ row: { node, id, nestingLevel } })}
        <TableRow {...props} row={node} class={rowClass}>
            {@render firstColumn?.({ row: node })}
            <Column
                id={treeIndicatorId}
                resizable={false}
                header=""
                onclick={() => {
                    if (table.expanded.has(id)) table.expanded.delete(id);
                    else table.expanded.add(id);
                }}
                ignoreWidth={table.results.someHaveChildren}
                width={table.results.someHaveChildren ? 20 : 0}
                minWidth={0}
                class="h-full"
            >
                <div style="width: calc(var(--spacing) * {nestingLevel * 4} + 20px);">
                    {#if node.children}
                        <ChevronRight
                            class={[
                                'ml-auto aspect-square shrink-0 transition-transform duration-100',
                                table.expanded.has(id) && 'rotate-90'
                            ]}
                        />
                    {/if}
                </div>
            </Column>
            {@render passedChildren?.({ row: node, nestingLevel })}
        </TableRow>
    {/snippet}
</VirtualList>
