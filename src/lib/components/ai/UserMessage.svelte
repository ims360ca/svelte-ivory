<script lang="ts">
    import clsx from 'clsx';
    import type { Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';
    import AttachedFile from './AttachedFile.svelte';
    import type { AiChatMessage } from './Chat.svelte';
    import Markdown from './Markdown.svelte';

    interface Props {
        class?: ClassValue;
        message: AiChatMessage;
        /** How attached files should be rendered */
        attachedFile?: Snippet<[file: File]>;
        /** How the message string should be rendered */
        messageText?: Snippet<[{ message: AiChatMessage }]>;
    }

    let {
        class: clazz,
        message,
        attachedFile = defaultAttachedFile,
        messageText = defaultMessageText
    }: Props = $props();
</script>

<div class={twMerge(clsx('flex w-full flex-col items-end gap-1', clazz))}>
    {@render messageText({ message })}
    {#if message.files}
        <div class="flex flex-row items-center gap-2">
            {#each message.files as file}
                {@render attachedFile(file)}
            {/each}
        </div>
    {/if}
    <div class="flex flex-row items-center gap-2">
        {#if message.time}
            <p class="text-surface-400-600 text-sm">
                {message.time.toLocaleString('de')}
            </p>
        {/if}
    </div>
</div>

{#snippet defaultAttachedFile(file: File)}
    <AttachedFile {file} />
{/snippet}

{#snippet defaultMessageText({ message }: { message: AiChatMessage })}
    <div class="bg-surface-200-800 text-surface-contrast-200-800 rounded px-2 py-0.5">
        <Markdown source={message.message} />
    </div>
{/snippet}
