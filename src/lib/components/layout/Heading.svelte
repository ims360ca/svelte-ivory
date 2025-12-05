<script lang="ts" module>
    import { theme } from '$lib/theme.svelte';
    import type { IvoryComponent } from '$lib/types';
    import { merge } from '$lib/utils/merge';
    import type { ClassValue } from 'svelte/elements';

    export interface HeadingProps extends IvoryComponent<HTMLHeadingElement> {
        class?: ClassValue;
    }
</script>

<script lang="ts">
    let { children, class: clazz, ...rest }: HeadingProps = $props();
</script>

<h2
    class={merge(
        'shrink-0 truncate text-lg font-bold select-none',
        theme.current.heading?.class,
        clazz
    )}
    {...rest}
>
    {@render children?.()}
</h2>
