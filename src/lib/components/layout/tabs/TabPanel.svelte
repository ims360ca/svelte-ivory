<script lang="ts" module>
    import { pseudoRandomId } from '$lib/utils/functions/index';
    import { type Snippet } from 'svelte';
    import { getTabContext } from './Tabs.svelte';

    export interface TabPanelProps {
        keepMounted?: boolean;
        children: Snippet<[{ visible: boolean }]>;
    }
</script>

<script lang="ts">
    let { keepMounted = false, children }: TabPanelProps = $props();

    const panel = pseudoRandomId('tab-panel-');
    const tabs = getTabContext();

    tabs.registerPanel(panel);
</script>

{#if keepMounted}
    {@render children({ visible: tabs.selectedPanel === panel })}
{:else if tabs.selectedPanel === panel}
    {@render children({ visible: true })}
{/if}
