<script lang="ts">
    import { page } from '$app/state';
    import { pseudoRandomId } from '$lib/utils/functions/index';
    import clsx from 'clsx';
    import { onMount, type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';
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
        children: Snippet<[{ selected: boolean }]>;
        testId?: string;
        /** If `href` is set, this can be used to highlight an active tab */
        active?: boolean;
    };

    let {
        class: clazz = (selected: boolean) => [selected && 'text-primary-500 underline'],
        id,
        href,
        children,
        testId,
        active
    }: Props = $props();

    const tab = pseudoRandomId('tab-');
    const tabs = getTabContext();

    const tabId = id || tab;

    const selected = $derived.by(() => {
        if (typeof active === 'boolean') {
            return active;
        } else if (href) {
            return page.url.pathname.startsWith(href);
        } else if (tabs && tabs.selectedTab === tabId) {
            return true;
        } else {
            return false;
        }
    });

    onMount(() => {
        if (href) return;
        tabs.registerTab(tabId);
    });
</script>

<svelte:element
    this={href ? 'a' : 'button'}
    class={twMerge(
        clsx(
            'btn flex h-fit w-fit items-center justify-center px-0 text-xl font-bold',
            clazz(selected)
        )
    )}
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
        selected
    })}
</svelte:element>
