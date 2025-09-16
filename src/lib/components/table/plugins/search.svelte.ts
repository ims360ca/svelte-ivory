import { SvelteSet } from 'svelte/reactivity';
import type { TablePlugin, TableRow } from '../';

interface SearchConfig<T extends TableRow<T>> {
    search: string;
    matches: (row: T) => boolean;
}

export function searchPlugin<T extends TableRow<T>>(conf: SearchConfig<T>): TablePlugin<T> {
    let prevSearch: string | undefined = undefined;
    let expandedBeforeSearch: Set<string> | undefined = undefined;

    const middleware: TablePlugin<T> = (state) => {
        // ensure that the state before the search is saved and restored when the user types
        if (prevSearch && !conf.search && expandedBeforeSearch) {
            prevSearch = conf.search;
            return {
                ...state,
                expanded: expandedBeforeSearch
            };
        }

        if (!conf.search) return state;

        // ensure we store the state before the we started searching
        if (conf.search && !prevSearch) expandedBeforeSearch = state.expanded;

        // figure out which nodes to expand and hide
        const { expanded, hidden } = search(state.data, conf.search, conf.matches);
        prevSearch = conf.search;
        console.log(hidden);

        return {
            data: state.data.filter((d) => !hidden.has(d.id)),
            expanded: new SvelteSet(expanded)
        };
    };
    return middleware;
}

/** collapses everything that doesnt match the searchString, expands direct search hit */
export const search = <T extends TableRow<T>>(
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
