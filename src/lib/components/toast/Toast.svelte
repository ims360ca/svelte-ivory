<script lang="ts" module>
    export interface Props {
        class?: ClassValue;
        children?: Snippet<[toast: ToastSettings & { close: () => void }]>;
        duration?: number;
    }
</script>

<!-- 
	@component
	Renders the toasts that have been triggered by the `Toasts` store.  
	Make sure to include this component in your root `+layout.svelte` file.
-->
<script lang="ts">
    import type { Icon } from '@lucide/svelte';
    import { Check, CircleAlert, Info, TriangleAlert, X } from '@lucide/svelte';
    import type { Snippet } from 'svelte';
    import { flip } from 'svelte/animate';
    import type { ClassValue } from 'svelte/elements';
    import { fly, scale } from 'svelte/transition';
    import { Toasts, type ToastSettings } from './toasts.svelte';

    let { class: clazz = 'px-2 pb-2', children, duration = 200 }: Props = $props();

    function getIcon(
        variant: 'info' | 'success' | 'warning' | 'error',
        icon?: typeof Icon
    ): typeof Icon {
        if (icon) return icon;
        switch (variant) {
            case 'info':
                return Info;
            case 'success':
                return Check;
            case 'warning':
                return CircleAlert;
            case 'error':
                return TriangleAlert;
        }
    }
</script>

<div
    class="pointer-events-none absolute top-0 left-0 z-50 flex h-full w-full flex-col items-center justify-start"
>
    <div
        class={[
            'flex h-full max-h-full flex-col-reverse items-center justify-end gap-2 overflow-hidden',
            clazz
        ]}
    >
        {#each Toasts.toasts as toast (toast.id)}
            {@const VariantIcon = getIcon(toast.variant, toast.icon)}

            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                in:fly={{ y: '-100%', duration }}
                out:scale={{ duration }}
                animate:flip={{ duration }}
                onpointerenter={() => {
                    Toasts.freeze(toast.id);
                }}
                onpointerleave={() => {
                    Toasts.unfreeze(toast.id);
                }}
                class="group pointer-events-auto flex h-fit w-fit flex-row items-center"
            >
                {#if children}
                    {@render children({
                        ...toast,
                        close: () => Toasts.close(toast.id)
                    })}
                {:else}
                    <div
                        class={[
                            'bg-opacity-85 flex flex-row items-center gap-4 rounded px-4 py-2 shadow-lg group-last:rounded-t-none',
                            toast.variant === 'info' &&
                                'bg-primary-200-800 text-primary-contrast-50-950',
                            toast.variant === 'success' &&
                                'bg-success-200-800 text-success-contrast-50-950',
                            toast.variant === 'warning' &&
                                'bg-warning-200-800 text-warning-contrast-50-950',
                            toast.variant === 'error' &&
                                'bg-error-200-800 text-error-contrast-50-950'
                        ]}
                    >
                        <VariantIcon />
                        <p class="font-bold">
                            {toast.message}
                        </p>
                        {#if !toast.hideDismiss}
                            <button
                                type="button"
                                onclick={() => {
                                    Toasts.close(toast.id);
                                }}
                                class="group"
                            >
                                <X size={20} class="stroke-1 transition-all group-hover:stroke-2" />
                            </button>
                        {/if}
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>
