<script lang="ts" generics="T extends { id: string }">
    import clsx from 'clsx';
    import { tick, type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    type Props<T> = {
        class?: ClassValue;
        data: T[];
        children: Snippet<[{ row: T; domIndex: number; index: number }]>;
        header?: Snippet;
        b_scrollTop?: number;
        itemHeight?: number;
    };

    let {
        class: clazz,
        data,
        children,
        header,
        b_scrollTop = $bindable(0),
        itemHeight
    }: Props<T> = $props();

    // local state
    let start = $state(0);
    let end = $state(0);
    let height_map: number[] = [];
    let viewport = $state<HTMLElement>();
    let contents = $state<HTMLElement>();
    let viewport_height = $state(0);

    const visible = $derived(
        data.slice(start, end).map((data, i) => {
            return { index: i + start, data };
        })
    );

    let top = $state(0);
    let bottom = $state(0);
    let average_height: number;
    let scroll_left = $state(0);

    const rows = $derived.by<HTMLElement[]>(() => {
        if (!contents) return [];
        const elements = contents.getElementsByTagName('virtual-list-row');
        return elements as unknown as HTMLElement[];
    });

    async function refresh(items: T[], viewport_height: number, itemHeight?: number) {
        if (!viewport) return;
        const { scrollTop } = viewport;

        await tick(); // wait until the DOM is up to date

        let content_height = top - scrollTop;
        let i = start;

        while (content_height < viewport_height && i < items.length) {
            let row = rows[i - start];

            if (!row) {
                end = i + 1;
                await tick(); // render the newly visible row
                row = rows[i - start];
            }

            const row_height = (height_map[i] = itemHeight || row.offsetHeight);
            content_height += row_height;
            i += 1;
        }

        end = i;

        const remaining = items.length - end;
        average_height = (top + content_height) / end;

        bottom = remaining * average_height;
        height_map.length = items.length;
    }

    async function handle_scroll() {
        if (!viewport) return;
        const { scrollTop, scrollLeft } = viewport;
        b_scrollTop = scrollTop;
        scroll_left = scrollLeft;

        const old_start = start;

        // extend height map
        for (let v = 0; v < rows.length; v += 1) {
            height_map[start + v] = itemHeight || rows[v].offsetHeight;
        }

        let i = 0;
        let y = 0;

        while (i < data.length) {
            const row_height = height_map[i] || average_height;
            if (y + row_height > scrollTop) {
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

            if (y > scrollTop + viewport_height) break;
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
                    actual_height += itemHeight || rows[i - start].offsetHeight;
                }
            }

            const d = actual_height - expected_height;
            viewport.scrollTo(0, scrollTop + d);
        }

        // TODO if we overestimated the space these
        // rows would occupy we may need to add some
        // more. maybe we can just call handle_scroll again?
    }

    // whenever `data` changes, invalidate the current heightmap
    $effect(() => {
        refresh(data, viewport_height, itemHeight);
        if (!viewport) return;
        // no idea why it only works the first time, but that's what i want anyway
        viewport.scrollTop = b_scrollTop;
    });
</script>

<div class={twMerge(clsx(['relative flex grow flex-col overflow-hidden border-inherit', clazz]))}>
    {#if header}
        <div class="h-fit w-full border-inherit">
            <div class="min-w-full border-inherit" style="transform: translateX(-{scroll_left}px);">
                {@render header?.()}
            </div>
        </div>
    {/if}
    <div
        class="flex grow overflow-auto"
        bind:this={viewport}
        bind:offsetHeight={viewport_height}
        onscroll={handle_scroll}
    >
        <div
            bind:this={contents}
            class="flex min-w-full flex-col"
            style="padding-top: {top}px; padding-bottom: {bottom}px;"
        >
            {#each visible as row, i (row.data.id + row.index)}
                <virtual-list-row class="h-fit w-fit min-w-full shrink-0 overflow-hidden">
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
