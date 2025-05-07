import { SvelteSet } from 'svelte/reactivity';
import { Column, type ColumnConfig } from './column.svelte';

export type TableRow<T> = { id: string; children?: T[] };

export interface TableConfig<T extends TableRow<T>> {
    data: T[];
    expanded?: Set<string>;
    scrollTop?: number;
}

export type TableMiddleware<T extends TableRow<T>> = (conf: TableConfig<T>) => TableConfig<T>;

interface TreeRow<T> {
    node: T;
    nestingLevel: number;
    id: string;
}

export class Table<T extends { id: string } & { children?: T[] }> {
    data = $state<T[]>([]);
    columns = $state<Column[]>([]);
    expanded: Set<string> = new SvelteSet<string>();

    scrollTop = $state(0);

    results = $derived(treeWalker(this.data, this.expanded));

    constructor(conf: TableConfig<T>) {
        this.updateConfig(conf);

        $effect(() => {
            this.updateConfig(conf);
        });
    }

    private updateConfig(conf: TableConfig<T>) {
        this.data = conf.data;
        this.expanded = conf.expanded ?? new SvelteSet<string>();
    }

    registerColumn(config: ColumnConfig): Column {
        // only register a column once
        let existingColumn: Column | undefined = undefined;
        for (const column of this.columns) {
            if (column.id === config.id) {
                existingColumn = column;
                break;
            }
        }
        if (existingColumn) return existingColumn;
        const col = new Column(config);
        this.columns.push(col);
        return col;
    }
}

/** Walks though a tree strucure and turns it into a flat list, needed since the `VirtualList` needs a list, not a tree */
function treeWalker<T extends { children?: T[]; id: string }>(data: T[], expanded: Set<string>) {
    const stack: { node: T; nestingLevel: number }[] = [];

    // push the root nodes of the trees onto the stack
    for (let i = 0; i < data.length; i++) {
        stack.push({
            node: data[data.length - i - 1],
            nestingLevel: 0
        });
    }

    const entries: TreeRow<T>[] = []; // the final result

    let someHaveChildren = false; // used to determine whether to show the tree utility buttons
    let maxNestingLevel = 0;
    while (stack.length !== 0) {
        const stackEntry = stack.pop();
        if (!stackEntry) break;

        const { node, nestingLevel } = stackEntry;
        const children = node.children;

        if (children && children.length > 0) {
            someHaveChildren = true;
            // only show the children of expanded elements
            if (expanded.has(node.id)) {
                maxNestingLevel = Math.max(maxNestingLevel, nestingLevel + 1);
                stack.push(
                    ...children
                        .map((c) => ({
                            node: c,
                            nestingLevel: nestingLevel + 1
                        }))
                        .reverse()
                );
            }
        }

        entries.push({
            id: node.id,
            node,
            nestingLevel
        });
    }

    return {
        entries,
        someHaveChildren,
        maxNestingLevel
    };
}

export function getAllIds<T extends TableRow<T>>(...nodes: T[]): string[] {
    const ids = nodes.map((n) => n.id);
    for (const node of nodes) {
        ids.push(...getAllIds(...(node.children ?? [])));
    }
    return ids;
}
