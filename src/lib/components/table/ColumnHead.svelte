<script lang="ts" module>
    import { getContext, setContext, type Snippet } from 'svelte';
    import { resize } from '../../utils/actions';
    import type { ColumnController } from './columnController.svelte';

    const CONTEXT = {};
    function setColumnHeadContext(column: ColumnController) {
        setContext(CONTEXT, column);
    }

    export function getColumnHeadContext(): ColumnController {
        return getContext(CONTEXT);
    }
</script>

<script lang="ts">
    type Props = {
        column: ColumnController;
        children?: Snippet;
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
        column.resize(newWidth + 8);
    };

    const onDragging = (d: boolean) => {
        dragging = d;
        column.dragging = d;
    };
</script>

<div
    class={['group flex shrink-0 flex-row justify-start']}
    bind:this={target}
    style="width: {column?.width ?? 0}px;"
>
    {@render children?.()}
    {#if column.resizable}
        <button
            type="button"
            class={[
                'relative ml-auto h-full w-4 shrink-0 cursor-col-resize bg-inherit after:absolute after:top-0 after:right-2 after:h-full after:w-px',
                dragging ? 'after:bg-primary-400-600' : 'group-hover:after:bg-surface-300-700'
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
