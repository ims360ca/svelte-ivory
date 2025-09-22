import { SvelteSet } from 'svelte/reactivity';
import type { TableRow } from '.';

/** collapses everything that doesnt match the searchString, expands direct search hit */
export const searchTable = <T extends TableRow<T>>(
    nodes: T[],
    searchString: string,
    stringsMatch: (node: T, searchTerm: string) => boolean
) => {
    const search = searchString.trim().toLowerCase();
    const hidden = new SvelteSet<string>();
    const expanded = new SvelteSet<string>();

    function nodeMatches(node: T, childOfMatch = false): boolean {
        const matches = stringsMatch(node, search);
        let hasMatchingChild = false;
        for (const child of node.children || []) {
            const childMatches = nodeMatches(child, matches || childOfMatch);
            if (childMatches) hasMatchingChild = true;
        }

        if (hasMatchingChild) {
            expanded.add(node.id);
        } else if (!matches) {
            hidden.add(node.id);
        }
        return matches || hasMatchingChild;
    }

    nodes.forEach((n) => nodeMatches(n));
    return {
        hidden,
        expanded
    };
};

export function applyHidden<T extends TableRow<T>>(data: T[], hidden: SvelteSet<string>): T[] {
    const results: T[] = [];

    for (const node of data) {
        if (hidden.has(node.id)) continue;
        if (node.children) node.children = applyHidden(node.children, hidden);
        results.push(node);
    }

    return results;
}
