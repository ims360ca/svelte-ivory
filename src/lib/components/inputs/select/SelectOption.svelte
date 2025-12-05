<script lang="ts">
    import { type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { getSelectContext } from './Select.svelte';

    interface Props {
        class?: ClassValue;
        value: string;
        children: Snippet;
    }

    let {
        class: clazz = 'flex flex-row justify-start items-center gap-2',
        value,
        children
    }: Props = $props();

    const context = getSelectContext();

    // this needs to run in an effect so we can update the value from outside the component
    $effect(function setValue() {
        if (context.value === value) context.select(value, children);
    });
</script>

<button
    type="button"
    class={[clazz]}
    onclick={() => {
        context.select(value, children);
    }}
>
    {@render children()}
</button>
