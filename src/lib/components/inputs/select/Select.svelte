<script lang="ts" module>
    import { Popover } from '$lib/components/layout';
    import { ChevronDown } from '@lucide/svelte';
    import { createContext, type Snippet } from 'svelte';
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
    }

    let { placeholder = '', children, ...props }: Props = $props();

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
</Input>

<Popover
    bind:this={popover}
    class="bg-surface-50-950 mt-2 flex flex-col gap-2 rounded p-2 shadow"
    style={`min-width: ${buttonWidth}px`}
    target={button}
>
    {@render children()}
</Popover>
