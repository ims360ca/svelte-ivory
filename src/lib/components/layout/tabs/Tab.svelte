<script lang="ts">
    import { pseudoRandomId } from '$lib/utils/functions/index';
    import { type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { getTabContext } from './Tabs.svelte';

    type Props = {
        class?: (selected: boolean) => ClassValue;
        id?: string | undefined;
        /**
         * If this is set the element will be a link.
         *
         * This is useful if your tabs are in a `+layout.svelte` and the Panels are seperate pages.
         */
        href?: string | undefined;
        children: Snippet<[{ selected: boolean; nextSelected: boolean }]>;
        testId?: string;
    };

    let {
        class: clazz = (selected: boolean) => [
            'btn px-0 flex h-fit w-fit items-center justify-center text-xl font-bold',
            selected && 'text-primary-500 underline'
        ],
        id,
        href,
        children,
        testId
    }: Props = $props();

    const tab = pseudoRandomId('tab-');
    const tabs = getTabContext();

    const tabId = id || tab;

    tabs.registerTab(tabId);

    const selected = $derived(tabs.selectedTab === tabId);

    const nextSelected = $derived.by(() => {
        for (let i = tabs.tabs.length - 1; i >= 0; i--) {
            const otherTab = tabs.tabs[i];
            if (otherTab === tabId) {
                return false;
            }
            if (otherTab === tabs.selectedTab) {
                return true;
            }
        }
        return false;
    });
</script>

<svelte:element
    this={href ? 'a' : 'button'}
    class={clazz(selected)}
    onclick={href
        ? undefined
        : () => {
              tabs.selectedTab = tabId;
          }}
    type={href ? undefined : 'button'}
    {href}
    data-testid={testId}
    role="tab"
    tabindex="0"
    aria-selected={selected}
>
    {@render children({
        selected: tabs.selectedTab === tabId,
        nextSelected
    })}
</svelte:element>
