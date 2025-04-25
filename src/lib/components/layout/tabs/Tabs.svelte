<script lang="ts" module>
    import { getContext, onDestroy, setContext, type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';

    interface TabContext {
        registerTab: (tab: string) => void;
        registerPanel: (panel: string) => void;
        selectedTab: string | undefined;
        tabs: string[];
        selectedPanel: string | undefined;
    }
    const TABS = {};

    function setTabContext(context: TabContext) {
        setContext<TabContext>(TABS, context);
    }

    export function getTabContext() {
        return getContext<TabContext>(TABS);
    }
</script>

<script lang="ts">
    type Props = {
        class?: ClassValue;
        children: Snippet;
        b_index?: number;
    };

    let { class: clazz = '', children, b_index = $bindable(0) }: Props = $props();

    let allTabs: string[] = $state([]);
    let panels: string[] = $state([]);

    export const forward = () => {
        if (b_index >= panels.length - 1) {
            b_index = 0;
        } else {
            b_index++;
        }
    };

    export const back = () => {
        if (b_index === 0) {
            b_index = panels.length - 1;
        } else {
            b_index--;
        }
    };

    setTabContext({
        registerTab: (tab: string) => {
            allTabs.push(tab);
            onDestroy(() => {
                const i = allTabs.indexOf(tab);
                allTabs.splice(i, 1);
            });
        },

        registerPanel: (panel: string) => {
            panels.push(panel);
            b_index = b_index;
            onDestroy(() => {
                panels.filter((p) => p !== panel);
            });
        },

        get selectedTab() {
            return allTabs[b_index];
        },
        set selectedTab(tab: string) {
            b_index = allTabs.indexOf(tab);
        },
        get selectedPanel() {
            return panels[b_index];
        },
        set selectedPanel(panel: string) {
            b_index = panels.indexOf(panel);
        },
        tabs: allTabs
    });
</script>

<div class={[clazz]}>
    {@render children()}
</div>
