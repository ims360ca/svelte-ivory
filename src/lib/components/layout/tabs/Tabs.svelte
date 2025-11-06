<script lang="ts" module>
    import type { IvoryComponent } from '$lib/types';
    import { getContext, onDestroy, setContext } from 'svelte';

    export interface TabsProps extends IvoryComponent<HTMLDivElement> {
        initialTab?: number;
    }

    export interface TabContext {
        registerTab: (tab: string) => void;
        registerPanel: (panel: string) => void;
        selectedTab: string | undefined;
        tabs: string[];
        selectedPanel: string | undefined;
    }

    const CONTEXT = {};
    function setTabContext(context: TabContext) {
        setContext<TabContext>(CONTEXT, context);
    }
    export function getTabContext() {
        return getContext<TabContext>(CONTEXT);
    }
</script>

<script lang="ts">
    let { children, initialTab = 0, ...rest }: TabsProps = $props();

    let allTabs: string[] = $state([]);
    let panels: string[] = $state([]);
    let index: number = $state(initialTab);

    export const forward = () => {
        if (index >= panels.length - 1) {
            index = 0;
        } else {
            index++;
        }
    };

    export const back = () => {
        if (index === 0) {
            index = panels.length - 1;
        } else {
            index--;
        }
    };

    export const currentTab = () => index;

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
            index = index;
            onDestroy(() => {
                panels.filter((p) => p !== panel);
            });
        },

        get selectedTab() {
            return allTabs[index];
        },
        set selectedTab(tab: string) {
            index = allTabs.indexOf(tab);
        },
        get selectedPanel() {
            return panels[index];
        },
        set selectedPanel(panel: string) {
            index = panels.indexOf(panel);
        },
        tabs: allTabs
    });
</script>

<div {...rest}>
    {@render children?.()}
</div>
