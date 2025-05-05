<script lang="ts" generics="T extends { id: string }">
    import { browser } from '$app/environment';
    import { onMount, tick, type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';

    type Props<T extends { id: string }> = {
        class?: ClassValue;
        data: T[];
        preScan?: number;
        loadPreScan?: number;
        onreachedend?: (offset: number) => void;
        children: Snippet<[{ row: T; domIndex: number; index: number }]>;
        header?: Snippet;
        loading?: Snippet;
        scrollTop?: number;
    };

    let {
        class: clazz = '',
        data,
        preScan = 0,
        loadPreScan = 0,
        onreachedend = () => {},
        children,
        header,
        loading,
        scrollTop = $bindable()
    }: Props<T> = $props();

    // local state
    let height_map: number[] = [],
        contents = $state<HTMLDivElement>(),
        average_height: number = 40,
        lastHandledScrollOffset = 0;

    let top = $state(0),
        bottom = $state(0),
        viewport_height = $state(0),
        viewport_width = $state(0),
        start = $state(0),
        mounted: boolean = $state(false),
        end = $state(0);

    let scroll_left = $state(0);

    let rows: HTMLCollectionOf<HTMLElement>;
    $effect(() => {
        rows = (contents?.getElementsByTagName('virtual-list-row') ??
            []) as HTMLCollectionOf<HTMLElement>;
    });

    let visible: { index: number; data: T }[] = $derived(
        data?.slice(start, end).map((data, i) => ({ index: i + start, data })) ?? []
    );

    // whenever `items` changes, invalidate the current heightmap
    $effect(() => {
        if (mounted) refresh(data, viewport_height);
    });

    async function refresh(items: T[], viewport_height: number) {
        if (!browser || !contents) return;
        const { scrollTop } = contents;

        await tick(); // wait until the DOM is up to date

        // See if this has no problems, can't find any right now
        if (start >= items.length && contents) {
            contents.scrollTop = items.length * average_height - viewport_height;
            start = Math.floor(items.length - viewport_height / average_height);
            if (start < 0) start = 0;
        }

        let content_height = top - scrollTop;
        let i = start;

        while (content_height < viewport_height && i < items.length) {
            let row = rows[i - start];

            if (!row) {
                end = i + 1;
                await tick(); // render the newly visible row
                row = rows[i - start];
            }

            const row_height = (height_map[i] = row?.offsetHeight);

            content_height += row_height;
            i += 1;
        }

        end = i;

        const remaining = items.length - end;
        average_height = (top + content_height) / end;

        bottom = remaining * average_height;
        height_map.length = items.length;
        handle_scroll();
    }

    async function handle_scroll() {
        if (!browser || !contents) return;
        const { scrollTop } = contents;

        const old_start = start;

        for (let v = 0; v < rows.length; v += 1) {
            height_map[start + v] = rows[v].offsetHeight;
        }

        let i = 0;
        let y = 0;

        while (i < data.length) {
            const row_height = height_map[i] || average_height;
            if (y + row_height > scrollTop - preScan * average_height) {
                start = i;
                top = y;

                break;
            }

            y += row_height;
            i += 1;
        }

        while (i < data.length) {
            y += height_map[i] || average_height;
            i += 1;

            if (y > scrollTop + viewport_height + preScan * average_height) break;
        }

        // dispatch an event when we reached the end of the data
        if (i >= data.length - loadPreScan) {
            onreachedend(data.length);
        }

        end = i;

        const remaining = data.length - end;
        average_height = y / end;

        while (i < data.length) height_map[i++] = average_height;
        bottom = remaining * average_height;

        // prevent jumping if we scrolled up into unknown territory
        if (start < old_start) {
            await tick();

            let expected_height = 0;
            let actual_height = 0;

            for (let i = start; i < old_start; i += 1) {
                if (rows[i - start]) {
                    expected_height += height_map[i];
                    actual_height += rows[i - start].offsetHeight;
                }
            }

            const d = actual_height - expected_height;
            contents.scrollTo(contents.scrollLeft, scrollTop + d);
        }
        // TODO if we overestimated the space these
        // rows would occupy we may need to add some
        // more. maybe we can just call handle_scroll again?
    }

    function updateHeaderPosition() {
        scroll_left = contents?.scrollLeft ?? 0;
    }

    // lets call handle_scroll only when we have scrolled more than the height of a row
    // if we have rows that differ a lot in height we might have to add a weighting to the average_height i.e. 0.75
    const onScroll = () => {
        if (contents) scrollTop = contents.scrollTop;
        updateHeaderPosition();
        if (
            Math.abs((contents?.scrollTop ?? 0) - lastHandledScrollOffset) >
            average_height * 0.75
        ) {
            handle_scroll();
            lastHandledScrollOffset = contents?.scrollTop ?? 0;
        }
    };

    onMount(async () => {
        mounted = true;
        // set the scroll position
        await handle_scroll();
        updateHeaderPosition();
        if (contents && scrollTop) {
            contents.scrollTop = scrollTop;
            await handle_scroll();
        }
    });
</script>

<div class={['relative flex grow flex-col overflow-hidden', clazz]}>
    {#if header}
        <div class="h-fit w-full">
            <div class="min-w-full" style="transform: translateX(-{scroll_left}px);">
                {@render header?.()}
            </div>
        </div>
    {/if}
    <div class="flex grow overflow-hidden">
        <div
            bind:this={contents}
            bind:offsetHeight={viewport_height}
            class="flex h-full w-full grow flex-col overflow-auto"
            onscroll={onScroll}
        >
            <div style="height: {top}px" class="w-full" bind:offsetWidth={viewport_width}></div>
            {#each visible as row, i (row.data.id + row.index)}
                <virtual-list-row class="h-fit w-fit min-w-full shrink-0 overflow-hidden">
                    {@render children({
                        row: row?.data,
                        domIndex: i,
                        index: row?.index ?? 0
                    })}
                </virtual-list-row>
            {/each}
            {@render loading?.()}
            <div style="height: {bottom}px"></div>
        </div>
    </div>
</div>
