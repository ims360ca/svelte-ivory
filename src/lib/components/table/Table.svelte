<script lang="ts" module>
    import { ChevronRight } from '@lucide/svelte';
    import { getContext, setContext, type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import Column from './Column.svelte';
    import ColumnHead from './ColumnHead.svelte';
    import { Table } from './table.svelte';
    import TableRow from './TableRow.svelte';
    import VirtualList from './VirtualList.svelte';

    export interface TableProps<T extends { id: string }> {
        class?: ClassValue;
        data: T[];
        onclick?: (row: T) => void;
        href?: (row: T) => string;
        children?: Snippet<[{ row: T; nestingLevel?: number }]>;
    }

    export interface GroupableRow {
        tableGroup?: string;
        tableGroupingKey?: string | number;
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

<script lang="ts" generics="T extends { id: string } & GroupableRow & {children?: T[] }">
    interface Props<TI extends { id: string }> extends TableProps<TI> {
        children: Snippet<[{ row: TI; nestingLevel?: number }]>;
        firstColumn?: Snippet<[{ row: TI }]>;
        rowClass?: ClassValue;
    }

    let {
        class: clazz,
        onclick,
        href,
        data,
        children: passedChildren,
        firstColumn,
        rowClass
    }: Props<T> = $props();

    let table: Table<T> = new Table({
        get data() {
            return data;
        }
    });

    setTableContext(table);
</script>

<div class={['flex flex-col overflow-hidden', clazz]}>
    <VirtualList
        data={table.results.entries}
        class="w-full min-w-full"
        bind:scrollTop={table.scrollTop}
    >
        {#snippet header()}
            {#if table.columns.length > 1}
                <div class={['flex w-fit min-w-full flex-row gap-4 pr-4']}>
                    {#each table.columns as column (column.id)}
                        <ColumnHead {column}>
                            {column.label}
                        </ColumnHead>
                    {/each}
                </div>
            {/if}
        {/snippet}
        {#snippet children({ row: { node, id, nestingLevel } })}
            <TableRow {onclick} {href} row={node} {table} class={rowClass}>
                {@render firstColumn?.({ row: node })}
                <Column
                    id="tree-indicator"
                    label=""
                    row={node}
                    resizable={false}
                    onclick={() => {
                        if (table.expanded.has(id)) table.expanded.delete(id);
                        else table.expanded.add(id);
                    }}
                    ignoreWidth={table.results.someHaveChildren}
                    width={table.results.someHaveChildren ? 20 : 0}
                    class="h-full"
                >
                    <div style="width: calc(var(--spacing) * {nestingLevel * 4} + 20px);">
                        {#if node.children}
                            <ChevronRight
                                class={[
                                    'ml-auto aspect-square shrink-0 transition-all',
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
</div>
