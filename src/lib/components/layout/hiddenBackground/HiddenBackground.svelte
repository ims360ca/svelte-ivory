<script lang="ts" module>
    import type { IvoryComponent, TransitionProps } from '$lib/types';
    import clsx from 'clsx';
    import type { ClassValue } from 'svelte/elements';
    import { fade } from 'svelte/transition';
    import { twMerge } from 'tailwind-merge';
    import { focusTrap, shortcut } from '../../../utils/actions/index';

    let globalClass = $state<ClassValue>();

    export function setClasses(value: ClassValue) {
        globalClass = value;
    }

    export interface HiddenBackgroundProps
        extends IvoryComponent<HTMLDialogElement>,
            TransitionProps {
        /** Gets called when the dialog is clicked */
        onclose?: () => void;
    }
</script>

<script lang="ts">
    let {
        class: clazz,
        onclose,
        children,
        inTransition = (e) => fade(e, { duration: 200 }),
        outTransition = (e) => fade(e, { duration: 100 }),
        ...rest
    }: HiddenBackgroundProps = $props();
</script>

<dialog
    class={twMerge(
        clsx(
            'bg-surface-950-50/40 pointer-events-auto absolute top-0 left-0 z-40 m-0 h-full w-full p-0',
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
    in:inTransition
    out:outTransition
    {...rest}
>
    {@render children?.()}
</dialog>
