<script lang="ts">
    import Drawer from '$lib/components/layout/drawer/Drawer.svelte';

    let rightDrawer = $state<Drawer>();
    let leftDrawer = $state<Drawer>();
</script>

<button onclick={rightDrawer?.open}>Open right</button>
<button onclick={leftDrawer?.open}>Open left</button>

<Drawer bind:this={rightDrawer} title="Right" placement="right">Content</Drawer>
<Drawer bind:this={leftDrawer} title="Left" placement="left">Content</Drawer>
