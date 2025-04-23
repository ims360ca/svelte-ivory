<script lang="ts" module>
	import { Copy } from '@lucide/svelte';
	import type { ClassValue } from 'svelte/elements';
	import { Toasts } from '../toast';

	let lastCopied = $state<string>();
</script>

<script lang="ts">
	interface Props {
		text: string;
		class?: ClassValue;
		toastMessage?: string;
	}

	let { text, class: clazz = 'text-xl', toastMessage }: Props = $props();

	async function copyText() {
		await navigator.clipboard.writeText(text);
		lastCopied = text;
		if (toastMessage) {
			Toasts.trigger({
				variant: 'success',
				message: toastMessage,
				icon: Copy
			});
		}
	}
</script>

<button type="button" class={['text-surface-500 btn', clazz]} onclick={copyText}>
	<Copy class={['h-5 w-5']} />
</button>
