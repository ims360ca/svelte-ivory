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
</script>

<svelte:element
    this={onclick ? 'button' : 'div'}
    class={twMerge(
        clsx(
            'group relative flex h-5 w-9 flex-row items-center rounded-full p-0.5 transition-colors duration-100',
            value ? 'bg-primary-500' : 'bg-surface-300-700',
            clazz
        )
    )}
    type={onclick ? 'button' : undefined}
    role={onclick ? 'button' : undefined}
    {onclick}
    data-testid={testId}
>
    <div
        class={[
            'relative flex h-full w-full flex-row items-center overflow-visible transition-all',
            value ? 'translate-x-full' : ''
        ]}
    >
        <div
            class={[
                'relative flex aspect-square h-full items-center justify-center rounded-full transition-all',
                value
                    ? 'bg-surface-50 -translate-x-full'
                    : 'bg-surface-100-900 group-hover:bg-surface-50-950'
            ]}
        >
            {@render children?.()}
        </div>
    </div>
</svelte:element>

<style lang="postcss">
</style>
