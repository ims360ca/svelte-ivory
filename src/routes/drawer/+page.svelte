<script lang="ts">
    import Drawer from '$lib/components/layout/drawer/Drawer.svelte';

    let rightOpen = $state(false);
    let leftOpen = $state(false);
</script>

<button onclick={() => (rightOpen = true)}>Open right</button>
<button onclick={() => (leftOpen = true)}>Open left</button>

<Drawer bind:b_open={rightOpen} title="Right" placement="right">Content</Drawer>
<Drawer bind:b_open={leftOpen} title="Left" placement="left">Content</Drawer>
