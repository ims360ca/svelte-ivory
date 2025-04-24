<script lang="ts">
    import { Chat, type AiChat, type AiChatMessage } from '$lib/components/ai';
    import { simulateLLMStream } from './simulateLLMStream';

    let chat = $state<AiChat>({
        messages: [
            {
                from: 'user',
                message: 'Hallo, wie geht es dir?',
                time: new Date(),
                liked: false,
                disliked: false,
                files: [new File([''], 'test.txt'), new File([''], 'something.pdf')]
            },
            {
                from: 'system',
                message: 'Hallo, ich bin ein Chatbot und kann dir helfen, Fragen zu beantworten.',
                time: new Date(),
                liked: false,
                disliked: false,
                files: []
            }
        ],
        loading: false
    });

    let input = $state('');

    async function submit(message: AiChatMessage) {
        const lastMessage = chat.messages[chat.messages.length - 1];
        for await (const chunk of simulateLLMStream({
            prompt: message.message,
            delayPerChunkMs: 100,
            chunkSize: 5,
            fullResponse: `This is a simulated response to the prompt: "${message.message}". Here's some more text to simulate tokenized output.`
        })) {
            lastMessage.message += chunk;
        }
    }
</script>

<Chat bind:b_chat={chat} {submit} class="h-full w-full grow overflow-hidden p-16">
    {#snippet children({ onsubmit })}
        <input bind:value={input} type="text" placeholder="Stelle eine Frage..." />
        <button
            type="button"
            class="btn preset-filled-primary-500 text-surface-50"
            onclick={() => {
                onsubmit({ from: 'user', message: input, files: [], time: new Date() });
            }}
        >
            Senden
        </button>
    {/snippet}
</Chat>
