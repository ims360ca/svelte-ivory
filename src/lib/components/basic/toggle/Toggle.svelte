<script lang="ts" module>
    import type { IvoryComponent } from '$lib/types';
    import clsx from 'clsx';
    import type { Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    export interface ToggleProps extends IvoryComponent<HTMLElement> {
        value?: boolean;
        class?: ClassValue;
        children?: Snippet;
    }
</script>

<script lang="ts">
    let { value, class: clazz, children, ...rest }: ToggleProps = $props();
</script>

<svelte:element
    this={rest.onclick ? 'button' : 'div'}
    class={twMerge(
        clsx(
            'group relative flex h-5 w-9 flex-row items-center rounded-full p-0.5 transition-colors duration-100',
            value ? 'bg-primary-500' : 'bg-surface-300-700',
            clazz
        )
    )}
    type={rest.onclick ? 'button' : undefined}
    role={rest.onclick ? 'button' : undefined}
    {...rest}
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
