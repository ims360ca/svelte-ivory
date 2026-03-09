<script lang="ts" module>
    import { theme } from '$lib/theme.svelte';
    import { merge, pseudoRandomId } from '$lib/utils/functions';
    import type { RemoteFormField, RemoteFormFieldValue } from '@sveltejs/kit';
    import type { Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { slide } from 'svelte/transition';
    import FormIssues from './issues/FormIssues.svelte';

    interface CommonProps {
        id?: string;
        class?: ClassValue;
        style?: string;
        label?: string;
        disabled?: boolean;
    }

    export interface InputProps<T extends RemoteFormFieldValue> extends CommonProps {
        form: RemoteFormField<T>;
    }

    export const INPUT_UNSET_OUTLINE =
        'border-none outline-none ring-transparent focus:outline-none';
</script>

<script lang="ts" generics="T extends RemoteFormFieldValue">
    interface Props<K extends RemoteFormFieldValue> extends CommonProps {
        children: Snippet<[{ class: string; id: string; disabled?: boolean }]>;
        fixTitle?: boolean;
        form: Pick<RemoteFormField<K>, 'value' | 'issues'>;
    }

    let {
        class: clazz,
        style,
        label,
        id = pseudoRandomId(),
        children,
        form,
        fixTitle,
        ...inputProps
    }: Props<T> = $props();

    const inputClass = `bg-transparent grow h-14 transition-all peer m-[1px] px-4 py-3 text-lg ${INPUT_UNSET_OUTLINE}`;

    const hasIssues = $derived.by(() => {
        const i = form.issues?.();
        return i && i.length > 0;
    });

    const hasValue = $derived(!!fixTitle || !!form.value?.());
</script>

<div
    class={[
        'accent-primary-500 relative flex h-fit flex-col pt-5',
        inputProps.disabled && 'pointer-events-none opacity-70',
        theme.current.input?.outerClass,
        clazz
    ]}
    {style}
>
    <div
        class={merge(
            'group flex h-full grow flex-col overflow-hidden rounded border-2',
            hasIssues
                ? 'bg-error-500/20 border-error-500'
                : 'focus-within:border-primary-500 focus-within:hover:border-primary-500 border-surface-300-700/25 hover:border-surface-300-700/50 transition-[border-color] duration-300',
            theme.current.input?.class?.(hasValue, hasIssues)
        )}
    >
        {@render children({ class: inputClass, id, ...inputProps })}
        {#if label}
            <label
                class={merge(
                    'pointer-events-none absolute cursor-text px-1 transition-all select-none group-focus-within:top-0 group-focus-within:left-0 group-focus-within:text-sm focus:cursor-default',
                    hasValue ? 'top-0 left-0 cursor-default text-sm' : 'top-10 left-3',
                    hasIssues ? 'text-error-500' : 'text-surface-700-300',
                    theme.current.input?.label?.class?.(hasValue, hasIssues)
                )}
                for={id}
            >
                {label}
            </label>
        {/if}
    </div>
    {#if form.issues?.()}
        <div class="h-fit w-full">
            <div
                class={merge(
                    'flex w-full flex-col overflow-hidden',
                    theme.current.input?.issues?.class
                )}
                transition:slide
            >
                <FormIssues issues={form.issues?.()} class="my-0.5 pr-2 first:mt-1 last:mb-1" />
            </div>
        </div>
    {/if}
</div>
