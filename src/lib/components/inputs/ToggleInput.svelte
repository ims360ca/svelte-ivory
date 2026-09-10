<script lang="ts">
    import { Toggle } from '../basic';
    import type { InputProps } from './Input.svelte';
    import FormIssues from './issues/FormIssues.svelte';

    let { field, class: clazz, label, ...props }: InputProps<boolean> = $props();

    const value = $derived(field.value());
</script>

<div class={['flex flex-col gap-2', clazz]}>
    <input {...field.as('checkbox')} class="hidden" {...props} />
    <button
        type="button"
        class="flex flex-row items-center gap-2"
        onclick={() => {
            field.set(!value);
        }}
    >
        <Toggle {value} />
        {label}
    </button>
    <FormIssues issues={field.issues()} />
</div>
