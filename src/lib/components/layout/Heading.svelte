<script lang="ts" module>
    import { theme } from '$lib/theme.svelte';
    import type { IvoryComponent } from '$lib/types';
    import clsx from 'clsx';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    export interface HeadingProps extends IvoryComponent<HTMLHeadingElement> {
        class?: ClassValue;
    }
</script>

<script lang="ts">
    let { children, class: clazz, ...rest }: HeadingProps = $props();
</script>

<h2
    class={twMerge(
        clsx('shrink-0 truncate text-lg font-bold select-none', theme.current.heading?.class, clazz)
    )}
    {...rest}
>
    {@render children?.()}
</h2>
