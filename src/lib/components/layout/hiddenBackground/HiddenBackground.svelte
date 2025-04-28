<script lang="ts" module>
    import clsx from 'clsx';
    import type { Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { fade } from 'svelte/transition';
    import { twMerge } from 'tailwind-merge';
    import { focusTrap, shortcut } from '../../../utils/actions/index';

    let globalClass = $state<ClassValue>();

    export function setClasses(value: ClassValue) {
        globalClass = value;
    }

    export const TEST_ID = 'background';
</script>

<script lang="ts">
    interface Props {
        class?: ClassValue;
        /** Gets called when the dialog is clicked */
        onclose?: () => void;
        children: Snippet;
    }

    let { class: clazz, onclose, children }: Props = $props();
</script>

<dialog
    class={twMerge(
        clsx(
            'bg-surface-950-50/40 absolute top-0 left-0 z-40 m-0 h-full w-full p-0',
            globalClass,
            clazz
        )
    )}
    open
    use:focusTrap={true}
    use:shortcut={{
        code: 'Escape',
        callback: onclose ?? (() => {})
    }}
    onclick={onclose}
    transition:fade={{ duration: 200 }}
    data-testid={TEST_ID}
>
    {@render children()}
</dialog>
