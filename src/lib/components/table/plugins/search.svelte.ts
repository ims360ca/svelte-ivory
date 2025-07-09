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
        if (conf.search && !prevSearch) {
            expandedBeforeSearch = state.expanded;
        }

        // figure out which nodes to expand and hide
        const { expanded, hidden } = search(state.data, conf.search, conf.matches);

        prevSearch = conf.search;
        return {
            data: state.data.filter((d) => !hidden.has(d.id)),
            expanded: new SvelteSet(expanded)
        };
    };
    return middleware;
}

/** collapses everything that doesnt match the searchString expands direct search hit */
export const search = <T extends TableRow<T>>(
    nodes: T[],
    searchString: string,
    stringsMatch: (a: T, b: string) => boolean
) => {
    const search = searchString.trim().toLowerCase();
    const hidden = new Set<string>();
    const expanded = new Set<string>();

    const recursor = (node: T, childOfMatch = false): boolean => {
        const matches = stringsMatch(node, search);

        const intermediateNode =
            node.children?.some((c) => recursor(c, matches || childOfMatch)) ?? false;

        if (intermediateNode) {
            expanded.add(node.id);
        } else if (!childOfMatch) {
            hidden.add(node.id);
        }

        return matches || intermediateNode;
    };

    nodes.forEach((n) => recursor(n));

    return {
        hidden,
        expanded
    };
};
