<script lang="ts">
    import type { ClassValue } from 'svelte/elements';
    import { Checkbox } from '../basic';
    import type { InputProps } from './Input.svelte';
    import FormIssues from './issues/FormIssues.svelte';

    interface Props extends InputProps<boolean> {
        class?: ClassValue;
        label: string;
        description?: string;
        onclick?: () => void;
    }

    let { class: clazz = '', label, description, onclick, disabled, form }: Props = $props();

    const { set, issues, value } = $derived(form);

    const checked = $derived(value());
</script>

<div class={['flex flex-col', clazz]}>
    <button
        type="button"
        {disabled}
        onclick={onclick ||
            (() => {
                set(!checked);
            })}
        class={['flex flex-row items-center gap-2', disabled && 'opacity-80']}
    >
        <Checkbox {checked} />
        {label}
    </button>
    <input class="hidden" {...form.as('checkbox')} />
    {#if description}
        <p class="text-surface-700-300">{description}</p>
    {/if}
    <FormIssues issues={issues?.()} />
</div>
