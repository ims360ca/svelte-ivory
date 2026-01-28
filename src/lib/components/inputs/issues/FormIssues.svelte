<script lang="ts">
    import { theme } from '$lib/theme.svelte';
    import { merge } from '$lib/utils/functions';
    import { TriangleAlert } from '@lucide/svelte';
    import type { RemoteFormIssue } from '@sveltejs/kit';
    import type { ClassValue } from 'svelte/elements';
    import { slide } from 'svelte/transition';

    interface Props {
        issues?: RemoteFormIssue[];
        class?: ClassValue;
    }

    let { issues = [], class: clazz }: Props = $props();
</script>

{#each issues as err, i (i)}
    <div
        class={merge(
            'text-error-500 flex h-fit w-full flex-row items-start justify-center gap-2 overflow-hidden pl-1',
            theme.current.input?.issues?.issue?.class,
            clazz
        )}
        transition:slide={{ axis: 'y' }}
    >
        <TriangleAlert size="18" class="my-auto" />
        <p class="flex grow">
            {#if theme.current.input?.issues?.issue?.label}
                {theme.current.input?.issues?.issue?.label(err)}
            {:else}
                {err.message}
            {/if}
        </p>
    </div>
{/each}
