<script lang="ts">
    import type { Snippet } from 'svelte';
    import '../app.css';

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();
</script>

<main class="flex flex-col items-center gap-4">
    {@render children()}
</main>
