<script lang="ts" module>
    let defaultClasses = $state<ClassValue>();

    export function setClasses(c: ClassValue) {
        defaultClasses = c;
    }
</script>

<script lang="ts">
    import clsx from 'clsx';
    import { type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    interface Props {
        class?: ClassValue;
        onclick?: () => void;
        href?: string;
        children: Snippet;
    }

    let {
        class: clazz = 'hover:bg-surface-950-50/10 transition-colors',
        onclick,
        href,
        children
    }: Props = $props();

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
                onclick
            };
        } else if (href) {
            return {
                this: 'a',
                href: href
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
            'flex h-full min-w-full grow flex-row items-stretch gap-2 overflow-hidden pr-4 pl-2',
            defaultClasses,
            clazz
        )
    )}
>
    {@render children()}
</svelte:element>
