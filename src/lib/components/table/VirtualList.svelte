<script lang="ts" generics="T extends { id: string }">
    import { merge } from '$lib/utils/functions';
    import { onMount, tick, untrack, type Snippet } from 'svelte';
    import type { ClassValue, HTMLAttributes } from 'svelte/elements';

    type Props<T> = {
        class?: ClassValue;
        data: T[];
        children: Snippet<[{ row: T; domIndex: number; index: number }]>;
        header?: Snippet;
        b_scrollTop?: number;
        rowHeight: number;
        overscan?: number;
        row?: HTMLAttributes<HTMLDivElement>;
        virtualized?: boolean;
    };

    let {
        class: clazz,
        data,
        children,
        header,
        b_scrollTop = $bindable(),
        rowHeight,
        overscan = 2,
        row: rowProps,
        virtualized = true
    }: Props<T> = $props();

    const finalRowClass = $derived(
        merge('flex w-full shrink-0 grow flex-row items-center overflow-hidden', rowProps?.class)
    );

    let viewportReactivity = $state(0);
    let scroll_top = $state(b_scrollTop ?? 0);
    let scroll_left = $state(0);
    let header_width = $state(0);
    let viewport = $state<HTMLElement>();
    let viewport_height = $state(0);

    export function scrollTo(top?: number, left?: number) {
        if (!viewport) return;
        if (top !== undefined) {
            scroll_top = top;
            viewport.scrollTop = top;
            b_scrollTop = top;
        }
        if (left !== undefined) {
            scroll_left = left;
            viewport.scrollLeft = left;
        }
    }

    const start = $derived.by(() => {
        if (!virtualized) return 0;
        return Math.max(0, Math.floor(scroll_top / rowHeight) - overscan);
    });

    const end = $derived.by(() => {
        if (!virtualized) return data.length;
        return Math.min(
            data.length,
            Math.ceil((scroll_top + viewport_height) / rowHeight) + overscan
        );
    });

    const visible = $derived(
        data.slice(start, end).map((data, i) => {
            return { index: i + start, data };
        })
    );

    const top = $derived.by(() => {
        if (!virtualized) return 0;
        return start * rowHeight;
    });
    const bottom = $derived.by(() => {
        if (!virtualized) return 0;
        return (data.length - end) * rowHeight;
    });

    async function onscroll() {
        if (!viewport) {
            viewportReactivity++;
            await tick();
            onscroll();
            return;
        }
        scroll_top = viewport.scrollTop;
        scroll_left = viewport.scrollLeft;
        b_scrollTop = scroll_top;
    }

    // update the scrolltop when the prop value changes
    $effect(() => {
        if (
            typeof b_scrollTop !== 'undefined' &&
            untrack(() => viewport?.scrollTop) !== b_scrollTop
        ) {
            scrollTo(b_scrollTop);
        }
    });

    onMount(async () => {
        await tick();
        onscroll();
    });
</script>

<div class={merge('scroll relative flex grow flex-col overflow-hidden border-inherit', clazz)}>
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
    {#key viewportReactivity}
        <div
            class="flex min-w-full! grow overflow-auto [scrollbar-gutter:stable]"
            bind:this={viewport}
            bind:offsetHeight={viewport_height}
            {onscroll}
        >
            <div
                class="flex h-fit shrink-0 flex-col"
                style="padding-top: {top}px; padding-bottom: {bottom}px; min-width: max(100%, {header_width}px) !important;"
            >
                {#each visible as row, i (row.data.id)}
                    <div
                        {...rowProps}
                        class={finalRowClass}
                        style="height: {rowHeight}px !important; {rowProps?.style}"
                    >
                        {@render children({
                            row: row.data,
                            domIndex: i,
                            index: row.index
                        })}
                    </div>
                {/each}
            </div>
        </div>
    {/key}
</div>
