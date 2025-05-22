<script lang="ts" generics="T extends { id: string }">
    import clsx from 'clsx';
    import { onMount, type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    type Props<T> = {
        class?: ClassValue;
        data: T[];
        children: Snippet<[{ row: T; domIndex: number; index: number }]>;
        header?: Snippet;
        b_scrollTop?: number;
        rowHeight: number;
        overscan?: number;
    };

    let {
        class: clazz,
        data,
        children,
        header,
        b_scrollTop = $bindable(0),
        rowHeight,
        overscan = 2
    }: Props<T> = $props();

    let scroll_top = $state(b_scrollTop);
    let scroll_left = $state(0);
    let header_width = $state(0);
    let viewport = $state<HTMLElement>();
    let viewport_height = $state(0);

    const start = $derived(Math.max(0, Math.floor(scroll_top / rowHeight) - overscan));

    const end = $derived(
        Math.min(data.length, Math.ceil((scroll_top + viewport_height) / rowHeight) + overscan)
    );

    const visible = $derived(
        data.slice(start, end).map((data, i) => {
            return { index: i + start, data };
        })
    );

    const top = $derived(start * rowHeight);
    const bottom = $derived((data.length - end) * rowHeight);

    function onscroll() {
        if (!viewport) return;
        scroll_top = viewport.scrollTop;
        scroll_left = viewport.scrollLeft;
        b_scrollTop = scroll_top;
    }

    onMount(() => {
        if (!viewport) return;
        viewport.scrollTop = b_scrollTop;
    });
</script>

<div class={twMerge(clsx(['relative flex grow flex-col overflow-hidden border-inherit', clazz]))}>
    {#if header}
        <div class="h-fit w-full border-inherit">
            <div
                class="w-fit min-w-full border-inherit"
                style="transform: translateX(-{scroll_left}px);"
                bind:clientWidth={header_width}
            >
                {@render header?.()}
            </div>
        </div>
    {/if}
    <div
        class="flex !min-w-full grow overflow-auto"
        bind:this={viewport}
        bind:offsetHeight={viewport_height}
        {onscroll}
    >
        <div
            class="flex flex-col"
            style="padding-top: {top}px; padding-bottom: {bottom}px; min-width: max(100%, {header_width}px) !important;"
        >
            {#each visible as row, i (row.data.id)}
                <virtual-list-row
                    class="flex h-fit w-fit !min-w-full shrink-0 flex-row items-center overflow-hidden"
                    style="height: {rowHeight}px !important;"
                >
                    {@render children({
                        row: row.data,
                        domIndex: i,
                        index: row.index
                    })}
                </virtual-list-row>
            {/each}
        </div>
    </div>
</div>
