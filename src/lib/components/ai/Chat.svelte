<!-- 
	@component
	An AI chat component that can be used to create a chatbot.

	Comes with default styles for the chat messages, but can be customized with the `userMessage` and `systemMessage` props.

	The input component has to be provided as a child component, and the `submit` function has to be provided as a callback.  
-->

<script lang="ts" module>
	import { onMount, tick, type Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
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

	export interface Chat {
		messages: AiChatMessage[];
		loading?: boolean;
	}
</script>

<script lang="ts">
	const SCROLL_STICKYNESS = 200;

	interface Props {
		class?: ClassValue;
		b_chat: Chat;
		userMessage?: Snippet<[message: AiChatMessage]>;
		systemMessage?: Snippet<[message: AiChatMessage]>;
		placeholder?: Snippet;
		children: Snippet<[{ onsubmit: (message: AiChatMessage) => Promise<void> }]>;
		submit: (chat: Chat) => Promise<void>;
	}

	let {
		class: clazz,
		b_chat: chat = $bindable(),
		userMessage,
		systemMessage,
		placeholder,
		children,
		submit: externalSubmit
	}: Props = $props();

	let inputElement = $state<HTMLInputElement>();
	let chatContainer = $state<HTMLDivElement>();

	async function scrollToBottom(force = false) {
		if (!chatContainer) return;

		const distanceToBottom =
			chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight;

		if (!force && distanceToBottom > SCROLL_STICKYNESS) return;
		chatContainer.scrollTop = chatContainer.scrollHeight;
		await tick();
	}

	async function selectInput() {
		await tick();
		if (inputElement) {
			inputElement.focus();
			inputElement.select();
			inputElement.setSelectionRange(0, 0);
		}
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

		await scrollToBottom(true);

		await externalSubmit(chat);

		chat.loading = false;
		selectInput();
	}

	onMount(() => {
		selectInput();
	});
</script>

<div class={['flex grow flex-col gap-2 overflow-hidden', clazz]}>
	<div class="flex grow flex-col gap-4 overflow-auto pr-2" bind:this={chatContainer}>
		{#if chat.messages.length === 0 && placeholder}
			{@render placeholder()}
		{/if}
		{#each chat.messages as _, i}
			{@const message = chat.messages[i]}
			{#if message.from === 'user'}
				{#if userMessage}
					{@render userMessage(message)}
				{:else}
					<UserMessage {message} />
				{/if}
			{:else if systemMessage}
				{@render systemMessage(message)}
			{:else}
				<AiMessage bind:b_message={chat.messages[i]} />
			{/if}
		{/each}
	</div>
	{@render children({ onsubmit: submit })}
</div>
