<script lang="ts" module>
    import { pseudoRandomId } from '$lib/utils/functions';
    import { ChevronRight } from '@lucide/svelte';
    import clsx from 'clsx';
    import { getContext, setContext, type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { SvelteSet } from 'svelte/reactivity';
    import { twMerge } from 'tailwind-merge';
    import { Column as ColumnComponent, type TablePlugin, type TableRow } from '.';
    import ColumnHead from './ColumnHead.svelte';
    import Row from './Row.svelte';
    import VirtualList from './VirtualList.svelte';
    import { ColumnController, type ColumnConfig } from './columnController.svelte';
    import { treeWalker, type TableState } from './controller';

    export interface TableProps<T extends TableRow<T>> {
        class?: ClassValue;
        data: T[];
        onclick?: (row: T) => void;
        href?: (row: T) => string | undefined;
        rowHeight?: number;
        /** Renders the rows */
        children?: Snippet<[{ row: T; nestingLevel?: number; index: number }]>;
        /** Add columns in front of the tree-indicator */
        firstColumn?: Snippet<[{ row: T }]>;
        rowClass?: ClassValue;
        headerClass?: ClassValue;
        plugins?: TablePlugin<T>[];
        /**
         * **Bindable**
         */
        b_columns?: ColumnController[];
        expanded?: SvelteSet<string>;
        /**
         * **Bindable**
         */
        b_scrollTop?: number;
        /** Equal to tailwinds `spacing` variable (e.g. `w-4` would be `4`) */
        nestingInset?: number;
    }

    const TABLE_CONTEXT = {};
    export type TableContext<T extends TableRow<T>> = {
        registerColumn: (config: ColumnConfig) => ColumnController;
        toggleExpansion: (id: string) => void;
        nestingInset: number;
    };

    function setTableContext<T extends TableRow<T>>(context: TableContext<T>) {
        setContext(TABLE_CONTEXT, context);
    }

    export function getTableContext<T extends TableRow<T>>(): TableContext<T> {
        return getContext<TableContext<T>>(TABLE_CONTEXT);
    }
</script>

<script lang="ts" generics="T extends TableRow<T>">
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
        expanded: expanded = new SvelteSet<string>(),
        nestingInset = 4,
        b_columns: externalColumns = $bindable(),
        b_scrollTop = $bindable()
    }: TableProps<T> = $props();

    let columns = $state<ColumnController[]>(externalColumns ?? []);
    const results = $derived(computeResults(data, expanded, plugins));

    function toggleExpansion(id: string) {
        if (expanded.has(id)) expanded.delete(id);
        else expanded.add(id);
    }

    setTableContext({
        toggleExpansion,
        registerColumn(config: ColumnConfig) {
            let existingColumn: ColumnController | undefined = undefined;
            for (const column of existingColumn || columns) {
                if (column.id !== config.id) continue;
                existingColumn = column;
                break;
            }
            if (existingColumn) return existingColumn;
            const col = new ColumnController(config);
            (externalColumns || columns).push(col);
            return col;
        },
        get nestingInset() {
            return nestingInset;
        }
    });

    function computeResults(data: T[], expanded: Set<string>, plugins: TablePlugin<T>[]) {
        let state: TableState<T> = {
            data,
            expanded
        };
        for (const plugin of plugins) {
            state = plugin(state);
        }
        return treeWalker(state);
    }

    const treeIndicatorId = pseudoRandomId('tree-indicator-');
</script>

<VirtualList
    data={results.entries}
    class={twMerge(clsx(['flex flex-col overflow-hidden border-transparent', clazz]))}
    bind:b_scrollTop
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
            {#each externalColumns || columns as column (column.id)}
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
            <ColumnComponent
                id={treeIndicatorId}
                resizable={false}
                header=""
                onclick={() => {
                    toggleExpansion(node.id);
                }}
                ignoreWidth={results.someHaveChildren}
                width={results.someHaveChildren ? 24 : 0}
                minWidth={0}
            >
                <div
                    class="flex h-full items-center justify-end"
                    style="width: calc(var(--spacing) * {nestingLevel * nestingInset} + 24px);"
                >
                    {#if node.children}
                        <ChevronRight
                            class={[
                                'ml-auto aspect-square shrink-0 transition-transform duration-100',
                                expanded.has(id) && 'rotate-90'
                            ]}
                        />
                    {/if}
                </div>
            </ColumnComponent>
            {@render passedChildren?.({ row: node, nestingLevel, index })}
        </Row>
    {/snippet}
</VirtualList>
