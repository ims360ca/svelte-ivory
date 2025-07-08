<script lang="ts" module>
    import type { IvoryComponent } from '$lib/types';
    import { X } from '@lucide/svelte';
    import clsx from 'clsx';
    import type { Snippet } from 'svelte';
    import type { ClassValue, MouseEventHandler } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';
    import { Heading, HiddenBackground, Portal } from '..';

    /** Props for the modal, expose if you overwrite the defaults in a custom component */
    export interface ModalProps extends IvoryComponent<HTMLDivElement> {
        /** Class of the modal itself, does not apply to the inner div */
        class?: ClassValue;
        /** Class of the div wrapping the children */
        innerClass?: ClassValue;
        /** If `true`, the modal will be open */
        b_open: boolean;
        /** Content of the modal */
        children?: Snippet;
        /** If `true` the modal will not close when clicking outside of it */
        preventClosing?: boolean;
        /** Variant of the modal, applies styling to the header */
        variant?: ModalVariant;
        title?: string;
    }

    export type ModalVariant = 'success' | 'warning' | 'error' | 'info';
</script>

<script lang="ts">
    interface Props extends ModalProps {
        /** If you don't want the title and close button to be included you can overwrite the default modal */
        modal?: Snippet;
    }

    let {
        class: clazz = 'flex flex-col',
        title,
        b_open = $bindable(),
        children,
        modal,
        preventClosing = false,
        variant,
        innerClass,
        ...rest
    }: Props = $props();

    function close() {
        if (preventClosing) return;
        b_open = false;
    }

    const onclick: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
        rest.onclick?.(e);
    };
</script>

<!-- 
	@component
	A modal, comes with a title, close button and different variants per default.
-->
{#if b_open}
    <Portal>
        <HiddenBackground
            onclose={close}
            class="flex h-full w-full flex-col items-center justify-start p-16"
        >
            {#if modal}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div {...rest} {onclick}>
                    {@render modal()}
                </div>
            {:else}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class={twMerge(
                        clsx([
                            'bg-surface-50-950 relative flex max-h-full max-w-full flex-col overflow-hidden rounded',
                            clazz
                        ])
                    )}
                    {...rest}
                    {onclick}
                >
                    <div
                        class={[
                            'flex flex-row items-center justify-between gap-4 px-4 py-3',
                            !variant && 'pb-0',
                            variant === 'success' && 'preset-tonal-success',
                            variant === 'warning' && 'preset-tonal-warning',
                            variant === 'error' && 'preset-tonal-error',
                            variant === 'info' && 'preset-tonal-primary'
                        ]}
                    >
                        {#if title}
                            <Heading>{title}</Heading>
                        {/if}
                        <button
                            class="group ml-auto flex justify-end"
                            type="button"
                            onclick={close}
                        >
                            <X
                                class="h-full w-auto transition-[stroke-width] group-hover:stroke-3"
                            />
                        </button>
                    </div>
                    <div
                        class={twMerge(
                            clsx(
                                'flex grow flex-col gap-4 overflow-hidden bg-inherit p-4 pt-3',
                                innerClass
                            )
                        )}
                    >
                        {@render children?.()}
                    </div>
                </div>
            {/if}
        </HiddenBackground>
    </Portal>
{/if}
