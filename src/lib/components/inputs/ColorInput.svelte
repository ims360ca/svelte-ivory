<script lang="ts">
    import { merge } from '$lib/utils/merge';
    import Input, { INPUT_UNSET_OUTLINE, type InputProps } from './Input.svelte';

    let props: InputProps<string> = $props();
</script>

<Input {...props}>
    {#snippet children({ id, class: inputClass })}
        <div
            class={merge([inputClass, 'flex grow flex-row items-center justify-between gap-4 p-0'])}
        >
            <input
                type="text"
                bind:value={props.form.value, props.form.set}
                class={['flex h-full grow items-center bg-transparent pl-2', INPUT_UNSET_OUTLINE]}
            />
            <input
                class={['h-full rounded', INPUT_UNSET_OUTLINE]}
                {id}
                {...props.form.as('color')}
            />
        </div>
    {/snippet}
</Input>
