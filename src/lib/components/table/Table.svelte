<script lang="ts" module>
    import { ChevronRight } from '@lucide/svelte';
    import clsx from 'clsx';
    import { getContext, setContext, type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';
    import Column from './Column.svelte';
    import ColumnHead from './ColumnHead.svelte';
    import { TableController, type TablePlugin, type TableRow } from './controller.svelte';
    import Row from './Row.svelte';
    import VirtualList from './VirtualList.svelte';

    export interface TableProps<T extends TableRow<T>> {
        class?: ClassValue;
        data: T[];
        onclick?: (row: T) => void;
        href?: (row: T) => string | undefined;
        rowHeight?: number;
        /** Renders the rows */
        children: Snippet<[{ row: T; nestingLevel?: number; index: number }]>;
        /** Add columns in front of the tree-indicator */
        firstColumn?: Snippet<[{ row: T }]>;
        rowClass?: ClassValue;
        headerClass?: ClassValue;
        plugins?: TablePlugin<T>[];
        controller?: TableController<T>;
        /**
         * **Bindable**
         */
        b_scrollTop?: number;
    }

    const TABLE_CONTEXT = {};
    function setTableContext<T extends TableRow<T>>(table: TableController<T>) {
        setContext(TABLE_CONTEXT, table);
    }

    export function getTableContext<T extends TableRow<T>>(): TableController<T> {
        return getContext<TableController<T>>(TABLE_CONTEXT);
    }
</script>

<script lang="ts" generics="T extends TableRow<T>">
    interface Props<TI extends { id: string }> extends TableProps<TI> {}

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
        plugins = [],
        controller: table = new TableController()
    }: Props<T> = $props();

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
                            class="flex grow flex-row items-center justify-start gap-4 py-2 text-start select-none"
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
