<script lang="ts" module>
    import { CircleAlert, CircleCheck } from '@lucide/svelte';
    import { Popover } from '../layout';
    import type { InputProps } from './Input.svelte';
    import PasswordInput from './PasswordInput.svelte';

    export interface PasswordRequirement {
        re: RegExp;
        label: string;
    }

    export interface PasswordCreateInputProps extends InputProps<string> {
        requirements: PasswordRequirement[];
    }
</script>

<script lang="ts">
    let { class: clazz = '', requirements, ...props }: PasswordCreateInputProps = $props();

    let popover = $state<Popover>();
    let target = $state<HTMLElement>();

    const value = $derived(props.form.value() ?? '');
</script>

<div bind:this={target} class={['bg-inherit ', clazz]}>
    <PasswordInput {...props} onfocusin={popover?.open} onfocusout={popover?.close} />
</div>

<Popover
    bind:this={popover}
    {target}
    style="min-width: {target?.getBoundingClientRect().width}px;"
    class="py-3"
    placement="top"
    autoplacement
    popover="manual"
>
    <div class="bg-surface-50-950 flex w-full flex-col gap-2 rounded p-4 shadow-lg">
        {#each requirements as requirement (requirement.re)}
            {@render pwRequirement(requirement.re.test(value), requirement.label)}
        {/each}
    </div>
</Popover>

{#snippet pwRequirement(matches: boolean, label: string)}
    <div
        class={[
            'flex flex-row items-center gap-2',
            matches ? 'text-success-700-300' : 'text-error-500'
        ]}
    >
        {#if matches}
            <CircleCheck />
        {:else}
            <CircleAlert />
        {/if}
        <p>
            {label}
        </p>
    </div>
{/snippet}
