<script lang="ts" module>
    import type { IvoryComponent } from '$lib/types';
    import { Copy } from '@lucide/svelte';
    import type { ClassValue } from 'svelte/elements';
    import { Toasts } from '../toast';

    let lastCopied = $state<string>();

    export interface CopyToClipboardButtonProps extends IvoryComponent<HTMLButtonElement> {
        text: string;
        class?: ClassValue;
        toastMessage?: string;
    }
</script>

<script lang="ts">
    let { text, toastMessage, ...rest }: CopyToClipboardButtonProps = $props();

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

<button type="button" class={['text-surface-500 btn', rest.class]} onclick={copyText} {...rest}>
    <Copy class={['h-5 w-5']} />
</button>
