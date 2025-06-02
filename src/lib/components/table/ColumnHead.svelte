<script lang="ts" module>
    import { getContext, setContext, type Snippet } from 'svelte';
    import { resize } from '../../utils/actions';
    import type { Column } from './column.svelte';

    const CONTEXT = {};
    function setColumnHeadContext(column: Column) {
        setContext(CONTEXT, column);
    }

    export function getColumnHeadContext(): Column {
        return getContext(CONTEXT);
    }
</script>

<script lang="ts">
    type Props = {
        column: Column;
        children: Snippet;
    };

    let { column, children }: Props = $props();
    setColumnHeadContext(column);

    let target = $state<HTMLElement | undefined>();
    let dragging = $state(false);

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
</script>

<div
    class={['group flex shrink-0 flex-row justify-start']}
    bind:this={target}
    style="width: {column.width}px;"
>
    {@render children()}
    {#if column.resizable}
        <button
            type="button"
            class={[
                'ml-auto flex h-full w-4 shrink-0 translate-x-px cursor-col-resize justify-center border-r bg-inherit',
                dragging
                    ? '!border-primary-400-600'
                    : 'group-hover:!border-surface-300-700 border-transparent'
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
