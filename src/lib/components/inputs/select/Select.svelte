<script lang="ts" module>
    import { Popover } from '$lib/components/layout';
    import { ChevronDown } from '@lucide/svelte';
    import { createContext, type Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import Input, { type InputProps } from '../Input.svelte';

    export interface SelectContext {
        select: (value: string, snippet: Snippet) => void;
        value: string | undefined | null;
    }

    export const [getSelectContext, setSelectContext] = createContext<SelectContext>();
</script>

<script lang="ts">
    interface Props extends InputProps<string> {
        placeholder?: string;
        children: Snippet;
        popoverClass?: ClassValue;
    }

    let {
        placeholder = 'bg-surface-50-950 flex flex-col gap-2 rounded-container p-2 shadow',
        children,
        popoverClass,
        ...props
    }: Props = $props();

    let button = $state<HTMLButtonElement | undefined>();
    let buttonWidth = $state<number>(200);
    let popover = $state<Popover>();
    let selectedSnippet = $state<Snippet>();

    const value = $derived(props.form.value());

    function select(newValue: string, snippet: Snippet) {
        selectedSnippet = snippet;
        if (newValue === value) return;
        props.form.set(newValue);
        popover?.close();
    }

    setSelectContext({
        select,
        get value() {
            return value;
        }
    });
</script>

<Input {...props}>
    <button
        type="button"
        class="flex h-14 w-full flex-row items-center justify-start gap-2 px-4 py-2"
        onclick={popover?.toggle}
        bind:this={button}
        bind:clientWidth={buttonWidth}
    >
        {#if selectedSnippet}
            {@render selectedSnippet()}
        {:else}
            {placeholder}
        {/if}
        <ChevronDown class={['ml-auto transition-all', popover?.isOpen() && 'rotate-180']} />
    </button>
    <input class="hidden" {...props.form.as('text')} {value} />
</Input>

<Popover
    bind:this={popover}
    class={popoverClass}
    style={`min-width: ${buttonWidth}px`}
    target={button}
>
    {@render children()}
</Popover>
