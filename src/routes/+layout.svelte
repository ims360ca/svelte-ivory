<script lang="ts">
    import { ToastUI } from '$lib/components/toast';
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
        <NavLink href="/layout/modal">Modal</NavLink>
        <NavLink href="/layout/tooltip">Tooltip</NavLink>
        <NavLink href="/drawer">Drawer</NavLink>
        <NavLink href="/table">Table</NavLink>
    </NavBar>
    <main class="flex h-full grow flex-col gap-4 overflow-hidden p-4">
        {@render children()}
    </main>
</div>

<ToastUI />
