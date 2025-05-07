<script lang="ts">
    import { resize } from '$lib/utils/actions';
    import { type Snippet } from 'svelte';
    import { Popover } from '../layout';
    import type { Column } from './column.svelte';

    let target = $state<HTMLElement | undefined>();

    type Props = {
        column: Column;
        children: Snippet;
    };

    let { column, children }: Props = $props();

    let dragging = $state(false);
    let open = $state(false);

    const onHoverStart = () => {
        column.hovering = true;
    };

    const onHoverEnd = () => {
        column.hovering = false;
    };

    const onResize = (mouseX: number) => {
        if (!target) return;
        let newWidth = mouseX - target.getBoundingClientRect().left;
        column.resize(newWidth + 2);
    };

    const onDragging = (d: boolean) => {
        dragging = d;
        column.dragging = d;
    };

    $inspect(column);
</script>

<div
    class={[
        'group border-primary-500 flex shrink-0 flex-row justify-start overflow-hidden bg-inherit'
    ]}
    bind:this={target}
    style="width: {column.width}px;"
>
    <svelte:element
        this={column.filter ? 'button' : 'div'}
        class={[
            'text-surface-600-400 flex grow flex-row items-center justify-start gap-4 py-2 text-start font-bold select-none'
        ]}
        type={column.filter ? 'button' : undefined}
        onclick={column.filter
            ? (e: MouseEvent) => {
                  e.stopPropagation();
                  e.preventDefault();
                  open = !open;
              }
            : undefined}
    >
        {@render children()}
    </svelte:element>
    {#if column.resizable}
        <button
            type="button"
            class={[
                'flex h-full w-4 shrink-0 cursor-col-resize justify-center border-r bg-inherit',
                dragging
                    ? 'border-primary-400-600 block'
                    : 'hover:border-surface-300-700 border-transparent'
            ]}
            use:resize={{ resized: onResize, dragging: onDragging }}
            onmouseenter={onHoverStart}
            onmouseleave={onHoverEnd}
            onfocusin={onHoverStart}
            onfocusout={onHoverEnd}
            tabindex="-1"
            aria-label="Resize column"
        >
        </button>
    {/if}
</div>

{#if column.filter}
    <Popover
        {target}
        bind:b_open={open}
        placement="bottom-start"
        class="bg-surface-50-950 flex flex-col gap-2 rounded p-4 shadow transition-shadow hover:shadow-lg"
        keepMounted
    >
        {@render column.filter()}
    </Popover>
{/if}
