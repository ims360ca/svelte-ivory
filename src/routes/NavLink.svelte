<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        href: string;
        children: Snippet;
    }

    let { href, children }: Props = $props();
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a {href} class="hover:text-primary-500 w-full text-lg font-bold">
    {@render children()}
</a>
