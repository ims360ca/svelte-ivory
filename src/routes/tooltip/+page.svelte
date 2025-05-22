<script lang="ts">
    import { Tooltip } from '$lib/components/layout';
    import { Toasts } from '$lib/components/toast';
    import { ShowerHead } from '@lucide/svelte';

    function onclick() {
        Toasts.trigger({
            variant: 'success',
            message: 'Clicked'
        });
    }
</script>

<div class="flex h-96 flex-col overflow-auto">
    {#each Array(100) as _, i}
        <Tooltip placement="top" class="btn preset-tonal-primary">
            <button class="btn" on:click={onclick}>{i}</button>
            {#snippet tooltip()}
                <div class="flex flex-row items-center gap-2">
                    <ShowerHead />
                    <p>The tooltip</p>
                </div>
            {/snippet}
        </Tooltip>
    {/each}
</div>
