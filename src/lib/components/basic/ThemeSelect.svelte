<script lang="ts">
    import { ColorTheme, type ColorThemePreference } from '$lib/colorTheme.svelte';
    import { merge } from '$lib/utils/functions';
    import { Icon, Monitor, Moon, Sun } from '@lucide/svelte';
    import type { ClassValue } from 'svelte/elements';

    type Props = {
        class?: ClassValue;
    };

    let { class: clazz }: Props = $props();

    const options: { icon: typeof Icon; value: ColorThemePreference; ariaLabel: string }[] = [
        {
            value: 'system',
            icon: Monitor,
            ariaLabel: 'System Theme'
        },
        {
            value: 'dark',
            icon: Moon,
            ariaLabel: 'Dark Theme'
        },
        {
            value: 'light',
            icon: Sun,
            ariaLabel: 'Light Theme'
        }
    ];
</script>

<div class={merge('border-surface-300-700 grid grid-cols-3 rounded-full border', clazz)}>
    {#each options as { value, icon: Icon, ariaLabel }, index (index)}
        {@const selected = value === ColorTheme.theme}
        <button
            type="button"
            class={[
                'tranistion-all text-surface-600-400 hover:text-surface-900-100 h-6 w-6 rounded-full p-1 transition-colors',
                selected && 'bg-surface-100-900'
            ]}
            onclick={() => {
                ColorTheme.theme = value;
            }}
            aria-label={ariaLabel}
        >
            <Icon class="h-full w-full" />
        </button>
    {/each}
</div>
