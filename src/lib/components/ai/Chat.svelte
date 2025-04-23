<!-- 
	@component
	An AI chat component that can be used to create a chatbot.
	Comes with default styles for the chat messages, but can be customized with the `userMessage` and `systemMessage` props.
	The input component has to be provided as a child component, and the `submit` function has to be provided as a callback.  
-->

<script lang="ts" module>
	import clsx from 'clsx';
	import { tick, type Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import AiMessage from './AiMessage.svelte';
	import UserMessage from './UserMessage.svelte';

	export interface AiChatMessage {
		from: 'user' | 'system';
		message: string;
		time?: Date;
		liked?: boolean;
		disliked?: boolean;
		files?: File[];
	}

	export interface AiChat {
		messages: AiChatMessage[];
		loading?: boolean;
	}
</script>

<script lang="ts">
	const AUTOSCROLL_PADDING = 200;

	interface Props {
		class?: ClassValue;
		b_chat: AiChat;
		userMessage?: Snippet<[{ message: AiChatMessage; i: number }]>;
		systemMessage?: Snippet<[{ message: AiChatMessage; i: number; minHeight?: number }]>;
		placeholder?: Snippet;
		children: Snippet<[{ onsubmit: (message: AiChatMessage) => Promise<void> }]>;
		submit: (message: AiChatMessage) => Promise<void>;
	}

	let {
		class: clazz,
		b_chat: chat = $bindable(),
		userMessage = defaultUserMessage,
		systemMessage = defaultSystemMessage,
		placeholder,
		children,
		submit: externalSubmit
	}: Props = $props();

	let chatContainer = $state<HTMLDivElement>();
	let lastMessageMinHeight = $state(0);

	function getLastMessageMinHeight() {
		if (!chatContainer) return 0;
		const secondToLastElement = chatContainer.children[chatContainer.children.length - 2];
		const rect = secondToLastElement?.getBoundingClientRect();
		const remainHeight = chatContainer.clientHeight - rect.height - 16;
		return remainHeight;
	}

	async function scrollToBottom() {
		if (!chatContainer) return;
		await tick();
		await tick();
		lastMessageMinHeight = getLastMessageMinHeight();
		await tick();
		// ensure we don't scroll if the newly generated message is already in view
		chatContainer.scrollTo({
			top: chatContainer.scrollHeight,
			behavior: 'smooth'
		});
	}

	async function submit(message: AiChatMessage) {
		if (chat.loading) {
			return;
		}

		chat.messages.push({
			...message,
			from: 'user',
			time: new Date()
		});
		// prevent the user from sending another message while we are loading the ai response
		chat.loading = true;

		// add an empty system message to the chat, this will indicate a loading state
		chat.messages.push({
			from: 'system',
			message: '',
			time: new Date()
		});

		await scrollToBottom();

		await externalSubmit(message);

		chat.loading = false;
	}
</script>

<div class={twMerge(clsx('flex grow flex-col gap-2 overflow-hidden', clazz))}>
	<div
		class="flex grow flex-col gap-4 overflow-auto pr-2 [scrollbar-gutter:stable]"
		bind:this={chatContainer}
	>
		{#if chat.messages.length === 0 && placeholder}
			{@render placeholder()}
		{/if}
		{#each chat.messages as _, i}
			{@const message = chat.messages[i]}
			{#if message.from === 'user'}
				{@render userMessage({
					message,
					i
				})}
			{:else}
				{@render systemMessage({
					message,
					i,
					minHeight: i === chat.messages.length - 1 ? lastMessageMinHeight : 0
				})}
			{/if}
		{/each}
	</div>
	{@render children({ onsubmit: submit })}
</div>

{#snippet defaultSystemMessage({
	i,
	minHeight
}: {
	i: number;
	message: AiChatMessage;
	minHeight?: number;
})}
	<AiMessage bind:b_message={chat.messages[i]} {minHeight} />
{/snippet}

{#snippet defaultUserMessage({
	message
}: {
	i: number;
	message: AiChatMessage;
	minHeight?: number;
})}
	<UserMessage {message} />
{/snippet}
