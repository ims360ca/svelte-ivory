<script lang="ts" module>
    import { merge } from '$lib/utils/functions';
    import type {
        HTMLAttributeAnchorTarget,
        HTMLAttributes,
        MouseEventHandler
    } from 'svelte/elements';
    import type { TransitionConfig } from 'svelte/transition';

    export type AnchorAttributes = {
        download?: string | undefined | null;
        href?: string | undefined | null;
        hreflang?: string | undefined | null;
        rel?: string | undefined | null;
        target?: HTMLAttributeAnchorTarget | undefined | null;
        type?: string | undefined | null;
        referrerpolicy?: ReferrerPolicy | undefined | null;
    };

    export type ButtonAttributes = {
        onclick: MouseEventHandler<HTMLElement>;
        disabled?: boolean | undefined | null;
        form?: string | undefined | null;
        name?: string | undefined | null;
        type?: 'submit' | 'reset' | 'button' | undefined | null;
        value?: string | string[] | number | undefined | null;
    };

    export type ElementProps = HTMLAttributes<HTMLElement> & {
        inTransition?: (element: HTMLElement) => TransitionConfig;
        outTransition?: (element: HTMLElement) => TransitionConfig;
    } & (AnchorAttributes | ButtonAttributes | HTMLAttributes<HTMLDivElement>);
</script>

<script lang="ts">
    const noop = () => ({});
    let {
        div = $bindable(),
        inTransition = noop,
        outTransition = noop,
        ...props
    }: ElementProps & { div?: HTMLElement } = $props();

    function isAnchor(props: ElementProps): props is AnchorAttributes {
        return 'href' in props && typeof props.href !== 'undefined';
    }

    function isButton(props: ElementProps): props is ButtonAttributes {
        return ('onclick' in props && typeof props.onclick !== 'undefined') || 'type' in props;
    }
</script>

{#if 'disabled' in props && props.disabled}
    <div
        {...props}
        in:inTransition
        out:outTransition
        class={merge(props.class, 'pointer-events-none opacity-60 grayscale')}
        bind:this={div}
    >
        {@render props.children?.()}
    </div>
{:else if isAnchor(props)}
    <a {...props} in:inTransition out:outTransition bind:this={div}>
        {@render props.children?.()}
    </a>
{:else if isButton(props)}
    <button
        {...props}
        in:inTransition
        out:outTransition
        type={props.type || 'button'}
        bind:this={div}
    >
        {@render props.children?.()}
    </button>
{:else}
    <div {...props} in:inTransition out:outTransition bind:this={div}>
        {@render props.children?.()}
    </div>
{/if}
