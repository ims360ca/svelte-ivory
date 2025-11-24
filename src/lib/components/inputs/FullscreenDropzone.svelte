<script lang="ts" module>
    import { FileUp } from '@lucide/svelte';
    import type { Snippet } from 'svelte';
    import { scale } from 'svelte/transition';
    import { HiddenBackground } from '../layout';

    export interface FullscreenDropzoneProps {
        ondrop: (files: File[]) => void;
        disabled: boolean;
        children?: Snippet;
    }
</script>

<script lang="ts">
    let { ondrop, disabled, children = defaultChildren }: FullscreenDropzoneProps = $props();

    let open = $state(false);

    // This counter correctly handles dragenter/dragleave events as the
    // cursor moves over different elements within the window.
    let counter = $state(0);

    function handleDragEnter(e: DragEvent) {
        if (disabled) return;
        e.preventDefault();
        // We only want to react to file drags.
        if (e.dataTransfer?.types.includes('Files')) {
            counter++;
            open = true;
        }
    }

    function handleDragLeave(e: DragEvent) {
        e.preventDefault();
        counter = Math.max(counter - 1, 0);
        // Only close the overlay when the counter is 0, meaning the cursor
        // has truly left the window.
        if (counter === 0) {
            open = false;
        }
    }

    function handleDrop(e: DragEvent) {
        // Prevent the browser from opening the file.
        e.preventDefault();

        // Reset state and close the overlay.
        open = false;
        counter = 0;

        const files = Array.from(e.dataTransfer?.files ?? []);

        if (files.length > 0) {
            ondrop(files);
        }
    }
</script>

<svelte:window
    ondragenter={handleDragEnter}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    ondragover={(e) => e.preventDefault()}
/>

{#if open}
    <HiddenBackground class="flex items-center justify-center">
        {@render children()}
    </HiddenBackground>
{/if}

{#snippet defaultChildren()}
    <div
        class="border-surface-400 text-surface-50 relative flex flex-col items-center gap-4 p-12 text-xl"
        in:scale|global={{ duration: 100, delay: 100 }}
        out:scale|global={{ duration: 100 }}
    >
        <div
            class="absolute top-0 left-0 h-full w-full rounded-xl bg-black/75 opacity-50 blur-lg"
        ></div>
        <FileUp size={40} />
    </div>
{/snippet}
