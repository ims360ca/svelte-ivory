<script lang="ts">
    import type { Snippet } from 'svelte';
    import '../app.css';
    import NavBar from './NavBar.svelte';
    import NavLink from './NavLink.svelte';

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();
</script>

<div class="flex h-full w-full flex-row items-start gap-4">
    <NavBar>
        <NavLink href="/">Svelte-ivory</NavLink>
        <NavLink href="/basic">Basic</NavLink>
        <NavLink href="/modal">modal</NavLink>
        <NavLink href="/drawer">drawer</NavLink>
        <NavLink href="/table">Table</NavLink>
    </NavBar>
    <main class="flex h-full grow flex-col gap-4 overflow-hidden p-4">
        {@render children()}
    </main>
</div>
