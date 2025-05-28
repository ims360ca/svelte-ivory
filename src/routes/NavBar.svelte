<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();
</script>

<nav class="flex h-full shrink-0 flex-col items-start gap-2 border-r p-2">
    {@render children()}
</nav>
