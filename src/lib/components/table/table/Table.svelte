<script lang="ts" module>
    import { ChevronRight } from '@lucide/svelte';
    import clsx from 'clsx';
    import { getContext, setContext, type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';
    import Column from './Column.svelte';
    import ColumnHead from './ColumnHead.svelte';
    import Row from './Row.svelte';
    import { Table, type TablePlugin, type TableRow } from './table.svelte';
    import VirtualList from './VirtualList.svelte';

    export interface TableProps<T extends { id: string }> {
        class?: ClassValue;
        data: T[];
        onclick?: (row: T) => void;
        href?: (row: T) => string | undefined;
        rowHeight?: number;
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

<script lang="ts" generics="T extends TableRow<T>">
    interface Props<TI extends { id: string }> extends TableProps<TI> {
        /** Renders the rows */
        children: Snippet<[{ row: TI; nestingLevel?: number; index: number }]>;
        /** Add columns in front of the tree-indicator */
        firstColumn?: Snippet<[{ row: TI }]>;
        rowClass?: ClassValue;
        headerClass?: ClassValue;
        plugins?: TablePlugin<TI>[];
    }

    let {
        class: clazz,
        data,
        children: passedChildren,
        firstColumn,
        rowClass,
        headerClass,
        rowHeight = 64,
        onclick,
        href,
        plugins = []
    }: Props<T> = $props();

    let table: Table<T> = new Table();

    $effect(() => {
        table.refresh({
            data,
            plugins
        });
    });

    setTableContext(table);
    const treeIndicatorId = crypto.randomUUID();
</script>

<VirtualList
    data={table.results.entries}
    class={['border-transparent', clazz, 'flex flex-col overflow-hidden']}
    bind:b_scrollTop={table.scrollTop}
    {rowHeight}
>
    {#snippet header()}
        <div
            class={twMerge(
                clsx(
                    'flex w-fit min-w-full flex-row gap-2 border-b border-inherit pr-4 pl-2',
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
    {#snippet children({ row: { node, id, nestingLevel }, index })}
        <Row
            onclick={onclick ? () => onclick(node) : undefined}
            href={href?.(node)}
            class={rowClass}
        >
            {@render firstColumn?.({ row: node })}
            <Column
                id={treeIndicatorId}
                resizable={false}
                header=""
                onclick={() => {
                    table.toggleExpansion(node.id);
                }}
                ignoreWidth={table.results.someHaveChildren}
                width={table.results.someHaveChildren ? 24 : 0}
                minWidth={0}
            >
                <div
                    class="flex h-full items-center justify-end"
                    style="width: calc(var(--spacing) * {nestingLevel * 4} + 24px);"
                >
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
            {@render passedChildren?.({ row: node, nestingLevel, index })}
        </Row>
    {/snippet}
</VirtualList>
