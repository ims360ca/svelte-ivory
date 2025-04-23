<script lang="ts" module>
	import clsx from 'clsx';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import Popover, { type PopoverPlacement } from '../popover/Popover.svelte';
	import Portal from '../portal/Portal.svelte';

	export interface Props {
		children?: Snippet;
		/** The content of the tooltip */
		tooltip: string | Snippet;
		/** The class of the element that triggers the tooltip */
		class?: ClassValue;
		/** The class of the tooltip itself */
		tooltipClass?: ClassValue;
		style?: string;
		onclick?: (e: Event) => void;
		/** If the href is set, the resulting element will be a link to the href */
		href?: string;
		/**
		 * The delay before the tooltip is shown in ms.
		 *
		 * default: `500`
		 */
		timeout?: number;
		/**
		 * Where the tooltip should be placed
		 *
		 * default: `top`
		 */
		placement?: PopoverPlacement;
	}
</script>

<script lang="ts">
	let {
		children,
		tooltip,
		class: clazz,
		style,
		onclick,
		href,
		timeout = 500,
		tooltipClass
	}: Props = $props();

	let target = $state<HTMLElement>();

	let open = $state(false);

	let showTimeout: number;
	function onpointerenter() {
		clearTimeout(timeout);
		if (timeout === 0) {
			open = true;
		} else {
			showTimeout = setTimeout(() => {
				open = true;
			}, timeout) as unknown as number;
		}
	}

	function onpointerleave() {
		clearTimeout(timeout);
		open = false;
	}
</script>

<!-- 
    @component
    Shows additional information when hovering over an element.
-->

<!-- Ignoring this error is fine since it's a false positive -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
	this={href ? 'a' : onclick ? 'button' : 'div'}
	{href}
	type={onclick ? 'button' : undefined}
	class={clazz}
	bind:this={target}
	{onpointerenter}
	{onpointerleave}
	{style}
	{onclick}
>
	{@render children?.()}
</svelte:element>

{#if open}
	<Portal>
		<Popover
			bind:b_open={open}
			{target}
			placement="top"
			class={twMerge(
				clsx(
					'bg-surface-100-800-token max-w-96 -translate-y-0.5 rounded px-4 py-1 shadow-lg',
					tooltipClass
				)
			)}
		>
			{#if typeof tooltip === 'string'}
				{tooltip}
			{:else}
				{@render tooltip()}
			{/if}
		</Popover>
	</Portal>
{/if}
