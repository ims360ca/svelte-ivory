<script lang="ts" module>
    import { theme } from '$lib/theme.svelte';
    import { merge } from '$lib/utils/functions';
    import { type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import Element from '../basic/Element.svelte';
    import type { ColumnConfig } from './columnController.svelte';
    import { getRowContext } from './Row.svelte';
    import { getTableContext } from './Table.svelte';

    export interface ColumnProps extends ColumnConfig {
        class?: ClassValue;
        /** If the type is incorrect pass the "row" property with the right type */
        children: Snippet;
        onclick?: (e: Event) => void | Promise<void>;
        href?: string;
        /** Cannot be used with resizable columns*/
        ignoreWidth?: boolean;
        offsetNestingLevel?: number;
    }
</script>

<script lang="ts">
    let {
        class: clazz,
        onclick,
        href,
        ignoreWidth = false,
        offsetNestingLevel = 0,
        // ColumnConfig
        id,
        width,
        minWidth,
        resizable = true,
        header,
        ...props
    }: ColumnProps = $props();

    // Register the new column if this is the first table row that was rendered
    const tableContext = getTableContext();
    const column = tableContext.registerColumn({ id, width, minWidth, resizable, header });
    const rowContext = getRowContext();

    const finalOnClick = $derived(onclick || rowContext.onclick);
    const finalHref = $derived.by(() => {
        if (finalOnClick) return undefined;
        return href || rowContext.href;
    });

    // passes updated props to the column
    $effect(() => {
        column.updateConfig({ resizable, minWidth, id, header });
    });

    // this must be separate to the above effect, since otherwise the width would be reset on every scroll
    $effect(() => {
        if (!resizable && typeof width !== 'undefined') column.resize(width);
    });

    const widthStyle = $derived(
        `calc(${column.width ?? 0}px - var(--spacing) * ${offsetNestingLevel * tableContext.nestingInset}) !important;`
    );
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<Element
    {...props}
    onclick={finalOnClick}
    href={finalHref}
    style={ignoreWidth ? '' : `width: ${widthStyle}`}
    class={merge([
        'box-border flex h-full shrink-0 flex-row items-center justify-start gap-1 truncate',
        column.width !== 0 && 'border-r-[calc(var(--spacing)*2)] border-transparent',
        theme.current.table?.column?.class,
        clazz
    ])}
/>
