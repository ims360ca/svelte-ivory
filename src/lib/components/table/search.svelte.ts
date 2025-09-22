import { SvelteSet } from 'svelte/reactivity';
import type { TableRow } from '.';

/** collapses everything that doesnt match the searchString, expands direct search hit */
export const searchData = <T extends TableRow<T>>(
    nodes: T[],
    searchString: string,
    stringsMatch: (a: T, b: string) => boolean
) => {
    const search = searchString.trim().toLowerCase();
    const hidden = new SvelteSet<string>();
    const expanded = new SvelteSet<string>();

    function nodeMatches(node: T, childOfMatch = false): boolean {
        const matches = stringsMatch(node, search);
        let intermediate = false;
        for (const child of node.children || []) {
            const childMatches = nodeMatches(child, matches || childOfMatch);
            if (childMatches) intermediate = true;
        }
        if (intermediate) {
            expanded.add(node.id);
        } else if (!childOfMatch && !matches) {
            hidden.add(node.id);
        }
        return matches || intermediate;
    }

    nodes.forEach((n) => nodeMatches(n));
    return {
        hidden,
        expanded
    };
};
