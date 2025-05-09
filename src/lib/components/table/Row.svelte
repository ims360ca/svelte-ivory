<script lang="ts" generics="T extends  {children?: T[], id: string}">
    import clsx from 'clsx';
    import { type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    interface Props<TI> {
        class?: ClassValue;
        row: TI;
        onclick?: (row: TI) => void;
        href?: (row: TI) => string;
        children: Snippet;
    }

    let {
        class: clazz = 'hover:bg-surface-950-50/10 transition-colors',
        row,
        onclick,
        href,
        children
    }: Props<T> = $props();

    const elementProps: {
        this: 'button' | 'a' | 'div';
        type?: 'button';
        onclick?: () => void;
        href?: string;
    } = $derived.by(() => {
        if (onclick) {
            return {
                this: 'button',
                type: 'button',
                onclick: () => {
                    onclick(row);
                }
            };
        } else if (href) {
            return {
                this: 'a',
                href: href(row)
            };
        } else {
            return {
                this: 'div'
            };
        }
    });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
    this={elementProps.this}
    {...elementProps}
    class={twMerge(
        clsx(
            'flex min-w-full shrink-0 flex-row items-stretch gap-2 overflow-hidden pr-4 pl-2',
            clazz
        )
    )}
>
    {@render children()}
</svelte:element>
