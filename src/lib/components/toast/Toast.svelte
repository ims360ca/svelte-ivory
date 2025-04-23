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

	type Props = {
		class?: ClassValue;
		children?: Snippet<[toast: ToastSettings & { close: () => void }]>;
	};

	let { class: clazz = 'px-2 pb-2', children }: Props = $props();

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
				in:fly={{ y: '-100%', duration: 300 }}
				out:scale={{ duration: 300 }}
				animate:flip={{ duration: 300 }}
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
							toast.variant === 'info' && 'preset-filled-primary-500',
							toast.variant === 'success' && 'preset-filled-success-500',
							toast.variant === 'warning' && 'preset-filled-warning-500',
							toast.variant === 'error' && 'preset-filled-error-500'
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
								class="transition-transform hover:rotate-90"
							>
								<X />
							</button>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
