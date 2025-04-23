<script lang="ts">
	import { icons } from '@lucide/svelte';
	import type { ClassValue } from 'svelte/elements';

	const Check = $derived(icons.Check);

	type Props = {
		class?: ClassValue;
		checked?: boolean | null;
		id?: string;
		/** if true, the onclick handler will not be called */
		disabled?: boolean;
		onclick?: () => void;
		/** data-testid */
		testId?: string;
	};

	let { class: clazz, checked = false, id, disabled = false, onclick, testId }: Props = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions-->
<svelte:element
	this={onclick ? 'button' : 'div'}
	type="button"
	{id}
	{disabled}
	class={[disabled && 'cursor-not-allowed opacity-70', clazz]}
	{onclick}
	data-testid={testId}
>
	<div
		class={[
			'text-surface-contrast-50-950 relative flex h-5 max-h-5 w-5 max-w-5 shrink-0 items-center justify-center rounded-sm text-sm transition-all',
			checked ? 'border-[0.625rem]' : 'border-2'
		]}
	>
		{#if checked}
			<Check class="text-surface-50-950 relative shrink-0" size={16} strokeWidth={3} />
		{/if}
	</div>
</svelte:element>
