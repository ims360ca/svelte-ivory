<script lang="ts">
    import { pseudoRandomId } from '$lib/utils/functions/index';
    import { type Snippet } from 'svelte';
    import { getTabContext } from './Tabs.svelte';

    type Props = {
        keepMounted?: boolean;
        children: Snippet<[{ visible: boolean }]>;
    };

    let { keepMounted = false, children }: Props = $props();

    const panel = pseudoRandomId('tab-panel-');
    const tabs = getTabContext();

    tabs.registerPanel(panel);
</script>

{#if keepMounted}
    {@render children({ visible: tabs.selectedPanel === panel })}
{:else if tabs.selectedPanel === panel}
    {@render children({ visible: true })}
{/if}
