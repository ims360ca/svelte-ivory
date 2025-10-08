<script lang="ts" module>
    import { ChevronRight } from '@lucide/svelte';
    import clsx from 'clsx';
    import { getContext, setContext, untrack, type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { SvelteSet } from 'svelte/reactivity';
    import { twMerge } from 'tailwind-merge';
    import ColumnComponent from './Column.svelte';
    import { ColumnController, type ColumnConfig } from './columnController.svelte';
    import ColumnHead from './ColumnHead.svelte';
    import { treeWalker, type TableRow } from './controller';
    import Row from './Row.svelte';
    import { applyHidden, searchTable } from './search.svelte';
    import VirtualList from './VirtualList.svelte';

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
        search?: {
            term: string;
            matches: (row: T) => boolean;
        };
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
        readonly registerColumn: (config: ColumnConfig) => ColumnController;
        readonly toggleExpansion: (id: string) => void;
        readonly nestingInset: number;
        readonly rowHeight: number;
    };

    function setTableContext<T extends TableRow<T>>(context: TableContext<T>) {
        setContext(TABLE_CONTEXT, context);
    }

    export function getTableContext<T extends TableRow<T>>(): TableContext<T> {
        return getContext<TableContext<T>>(TABLE_CONTEXT);
    }

    const treeIndicatorId = 'tree-chevron';
    const treeIndicatorInset = 32;
</script>

<script lang="ts" generics="T extends TableRow<T>">
    let {
        class: clazz,
        data,
        children: passedChildren,
        firstColumn,
        rowClass = 'hover:bg-surface-950-50/10 transition-colors',
        headerClass,
        rowHeight = 64,
        onclick,
        href,
        expanded: expanded = new SvelteSet<string>(),
        nestingInset = 4,
        b_columns: externalColumns = $bindable(),
        b_scrollTop = $bindable(),
        search
    }: TableProps<T> = $props();

    let columns = $state<ColumnController[]>(externalColumns ?? []);
    let treeIndicatorColumn = $state<ColumnController>();

    function toggleExpansion(id: string) {
        if (expanded.has(id)) expanded.delete(id);
        else expanded.add(id);
    }

    let hidden = $state(new SvelteSet<string>());
    const searchResult = $derived.by(() => {
        if (!search)
            return {
                filteredData: data,
                isSearching: false
            };
        return {
            filteredData: applyHidden(structuredClone(data), hidden),
            isSearching: true
        };
    });
    const results = $derived(treeWalker({ data: searchResult.filteredData, expanded }));

    let expandedBeforeSearch = $state<SvelteSet<string> | null>(null);
    let prevSearch = $state('');

    // updates expanded and hidden states
    $effect(() => {
        if (!search) return;
        const currentSearch = search.term.trim();
        const wasSearching = prevSearch !== '';
        const isSearching = currentSearch !== '';

        // Transition: Not Searching -> Searching
        if (!wasSearching && isSearching) {
            // Save the current expansion state before overwriting it.
            expandedBeforeSearch = untrack(() => new SvelteSet(expanded));
            const { expanded: searchExpanded, hidden: searchHidden } = searchTable(
                data,
                currentSearch,
                search.matches
            );
            expanded = searchExpanded; // Set the initial expansion for the search.
            hidden = searchHidden;
        }

        // Transition: Searching -> Not Searching
        if (wasSearching && !isSearching) {
            // Restore the saved expansion state.
            if (expandedBeforeSearch) {
                expanded = expandedBeforeSearch;
                expandedBeforeSearch = null;
                hidden = new SvelteSet<string>();
            }
        }

        // Transition: Searching -> Searching (different query)
        if (wasSearching && isSearching && currentSearch !== prevSearch) {
            const { expanded: searchExpanded, hidden: searchHidden } = searchTable(
                data,
                currentSearch,
                search.matches
            );
            expanded = searchExpanded; // Update the expansion for the new search.
            hidden = searchHidden;
        }

        prevSearch = currentSearch;
    });

    setTableContext({
        toggleExpansion,
        registerColumn(config: ColumnConfig) {
            let existingColumn: ColumnController | undefined = undefined;

            if (config.id === treeIndicatorId) {
                if (!treeIndicatorColumn) treeIndicatorColumn = new ColumnController(config);
                return treeIndicatorColumn;
            }

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
        },
        get rowHeight() {
            return rowHeight;
        }
    });
</script>

<VirtualList
    data={results.entries}
    class={twMerge(clsx(['flex flex-col overflow-hidden border-transparent', clazz]))}
    bind:b_scrollTop
    {rowHeight}
    rowClass={['pl-2 pr-4', rowClass]}
>
    {#snippet header()}
        <div
            class={twMerge(
                clsx(
                    'flex w-fit min-w-full flex-row border-b border-inherit pr-4 pl-2',
                    headerClass
                )
            )}
        >
            {#if treeIndicatorColumn}
                <ColumnHead column={treeIndicatorColumn}></ColumnHead>
            {/if}
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
        <Row href={href?.(node)} onclick={onclick ? () => onclick(node) : undefined}>
            {@render firstColumn?.({ row: node })}
            <ColumnComponent
                id={treeIndicatorId}
                resizable={false}
                header=""
                onclick={() => {
                    toggleExpansion(node.id);
                }}
                ignoreWidth={results.someHaveChildren}
                width={results.someHaveChildren ? treeIndicatorInset : 0}
                minWidth={0}
            >
                <div
                    class="flex h-full items-center justify-end"
                    style="width: calc(var(--spacing) * {nestingLevel * nestingInset -
                        2} + {treeIndicatorInset}px);"
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
