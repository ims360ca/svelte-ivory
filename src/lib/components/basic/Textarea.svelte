<script lang="ts">
    import { merge } from '@ims360/svelte-ivory/utils/functions';
    import type { ClassValue, HTMLAttributes } from 'svelte/elements';

    interface Props extends HTMLAttributes<HTMLTextAreaElement> {
        class?: ClassValue;
        value?: string;
        disabled?: boolean;
        placeholder?: string;
        name?: string;
    }

    let { class: clazz, value = $bindable(), ...rest }: Props = $props();

    let textareaEl = $state<HTMLTextAreaElement>();

    function autoResize() {
        if (!textareaEl) return;
        textareaEl.style.height = 'auto';
        textareaEl.style.height = `${textareaEl.scrollHeight}px`;
    }

    $effect(() => {
        value;
        autoResize();
    });

    export function focus() {
        textareaEl?.focus();
    }

    export function isActive() {
        return document.activeElement === textareaEl;
    }
</script>

<textarea
    class={merge(
        'max-h-96 w-full resize-none overflow-y-auto border-none bg-transparent ring-0 outline-0 transition-all',
        clazz
    )}
    bind:this={textareaEl}
    bind:value
    rows="1"
    {...rest}
></textarea>
