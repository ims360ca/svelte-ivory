<script lang="ts" module>
    import type { IvoryComponent } from '$lib/types';

    export interface CheckboxProps extends IvoryComponent<HTMLElement> {
        class?: ClassValue;
        /** `checked` has prioriy over `partial` */
        checked?: boolean | null;
        /** `checked` has prioriy over `partial` */
        partial?: boolean | null;
        id?: string;
        /** if true, the onclick handler will not be called */
        disabled?: boolean;
        onclick?: () => void;
        /** data-testid */
        testId?: string;
    }
</script>

<!-- 
    @component
    It's a checkbox 
-->

<script lang="ts">
    import { Check, type Icon as LucideIcon, Minus } from '@lucide/svelte';
    import clsx from 'clsx';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    let {
        class: clazz,
        checked = false,
        partial = false,
        id,
        disabled = false,
        onclick,
        ...rest
    }: CheckboxProps = $props();

    const {
        icon: Icon,
        innerClass,
        style
    }: { icon?: typeof LucideIcon; innerClass?: string; style?: string } = $derived.by(() => {
        if (!checked && !partial) return { innerClass: 'border-surface-500' };
        if (checked)
            return {
                icon: Check,
                innerClass: 'bg-primary-500 border-primary-500 text-surface-50'
            };
        if (partial)
            return {
                icon: Minus,
                innerClass: 'border-primary-700 text-primary-500'
            };
        return {};
    });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions-->
<svelte:element
    this={onclick ? 'button' : 'div'}
    type="button"
    {id}
    {disabled}
    {style}
    {onclick}
    class={twMerge(
        clsx(
            'box-border flex h-5 w-5 items-center justify-center overflow-hidden rounded border-2 transition-colors',
            disabled && 'cursor-not-allowed opacity-70',
            innerClass,
            clazz
        )
    )}
    {...rest}
>
    {#if Icon}
        <Icon class="h-full w-full" size={16} strokeWidth={3} />
    {/if}
</svelte:element>
