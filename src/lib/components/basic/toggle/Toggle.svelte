<script lang="ts">
    import clsx from 'clsx';
    import type { Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    type Props = {
        value?: boolean;
        class?: ClassValue;
        onclick?: () => void;
        children?: Snippet;
        testId?: string;
    };

    let { value, class: clazz, onclick, children, testId }: Props = $props();

    let thumbWidth = $state(0);
</script>

<svelte:element
    this={onclick ? 'button' : 'div'}
    class={twMerge(
        clsx(
            'group flex h-5 w-9 items-center rounded-full border p-0.5 transition-colors duration-100',
            value
                ? 'bg-primary-500 border-primary-500'
                : 'bg-surface-500/30 border-surface-500/60 hover:border-surface-500/80',
            clazz
        )
    )}
    type={onclick ? 'button' : undefined}
    role={onclick ? 'button' : undefined}
    {onclick}
    tabindex="0"
    data-testid={testId}
>
    <div class="relative flex h-full w-full flex-row items-center">
        <div
            class={[
                'relative flex aspect-square h-full items-center justify-center rounded-full transition-all',
                value ? 'bg-surface-50' : 'bg-surface-600-400 group-hover:bg-surface-700-300'
            ]}
            style={value ? `left: calc(100% - ${thumbWidth}px);` : 'left: 0;'}
            bind:clientWidth={thumbWidth}
        >
            {@render children?.()}
        </div>
    </div>
</svelte:element>
