<script lang="ts">
    import { X } from '@lucide/svelte';
    import type { ClassValue } from 'svelte/elements';

    interface Props {
        file: File;
        onremove?: (f: File) => void;
        class?: ClassValue;
    }

    let { file, onremove, class: clazz }: Props = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
    this={onremove ? 'button' : 'div'}
    type={onremove ? 'button' : undefined}
    onclick={onremove ? () => onremove(file) : undefined}
    class={[
        'bg-primary-500/25 group flex flex-row items-center gap-1 overflow-hidden rounded-full px-4 py-1 whitespace-nowrap',
        clazz
    ]}
>
    <p>{file.name}</p>
    {#if onremove}
        <X size={16} class="group-hover:text-primary-500" />
    {/if}
</svelte:element>
