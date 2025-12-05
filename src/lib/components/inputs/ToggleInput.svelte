<script lang="ts">
    import { Toggle } from '../basic';
    import type { InputProps } from './Input.svelte';
    import FormIssues from './issues/FormIssues.svelte';

    let { form, class: clazz, label, ...props }: InputProps<boolean> = $props();

    const value = $derived(form.value());
</script>

<div class={['flex flex-col gap-2', clazz]} {...props}>
    <input {...form.as('checkbox')} class="hidden" {value} />
    <button
        type="button"
        class="flex flex-row items-center gap-2"
        onclick={() => {
            form.set(!value);
        }}
    >
        <Toggle {value} />
        {label}
    </button>
    <FormIssues issues={form.issues()} />
</div>
