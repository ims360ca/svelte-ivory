import { SvelteSet } from 'svelte/reactivity';
import { getAllIds, type TablePlugin, type TableRow } from '../table/table.svelte';

interface ExpandAllConfig {
    enabled: boolean;
}

const DEFAULT_CONFIG: ExpandAllConfig = {
    enabled: true
};

export function expandAllPlugin<T extends TableRow<T>>(
    conf: Partial<ExpandAllConfig>
): TablePlugin<T> {
    let initialized = false;

    const config: ExpandAllConfig = {
        ...DEFAULT_CONFIG,
        ...conf
    };

    const middleware: TablePlugin<T> = (state) => {
        if (initialized || !config.enabled) return state;
        const allIds = getAllIds(...state.data);
        const newExpanded = new SvelteSet(allIds);
        initialized = true;
        return {
            data: state.data,
            expanded: newExpanded
        };
    };

    return middleware;
}
