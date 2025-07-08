<script lang="ts" module>
    import type { IvoryComponent } from '$lib/types';
    import clsx from 'clsx';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    export interface HeadingProps extends IvoryComponent<HTMLHeadingElement> {
        class?: ClassValue;
    }

    export function setClasses(c: ClassValue) {
        defaultClasses = c;
    }

    let defaultClasses = $state<ClassValue>('');
</script>

<script lang="ts">
    let { children, class: clazz, ...rest }: HeadingProps = $props();
</script>

<!-- 
    @component
    A component for unified headings.  
    Classes that are set using the `setDefaultClasses` function will be applied to all headings,
    including the ones used in other components of this lib, e.g. the `Modal`.
    If you set the `defaultClasses`, make sure to call it before using a component that uses the heading component (e.g. your root `+layout.svelte`).
-->

<h2
    class={twMerge(clsx('shrink-0 truncate text-lg font-bold select-none', defaultClasses, clazz))}
    {...rest}
>
    {@render children?.()}
</h2>
