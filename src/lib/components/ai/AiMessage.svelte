<!-- 
	@component
	The default for AI Messages in the Chat component.
	Can be customized using the `class` and `loading` props.
-->

<script lang="ts">
	import { ThumbsDown, ThumbsUp } from '@lucide/svelte';
	import clsx from 'clsx';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import CopyToClipboardButton from '../buttons/CopyToClipboardButton.svelte';
	import type { AiChatMessage } from './Chat.svelte';
	import Markdown from './Markdown.svelte';

	interface Props {
		b_message: AiChatMessage;
		loading?: Snippet;
		class?: ClassValue;
	}

	let { b_message = $bindable(), loading = defaultLoading, class: clazz }: Props = $props();

	// const uuidRegex =
	//     /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
	// const icon = `<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" class="h-[1em] origin-center overflow-visible align-[-0.125rem]" viewBox="0 0 512 512"><g transform="translate(256 256)" transform-origin="128 0"><path d="M336 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l121.4 0L212.7 276.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L480 54.6 480 176c0 8.8 7.2 16 16 16s16-7.2 16-16l0-160c0-8.8-7.2-16-16-16L336 0zM64 32C28.7 32 0 60.7 0 96L0 448c0 35.3 28.7 64 64 64l352 0c35.3 0 64-28.7 64-64l0-144c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 144c0 17.7-14.3 32-32 32L64 480c-17.7 0-32-14.3-32-32L32 96c0-17.7 14.3-32 32-32l144 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L64 32z" fill="currentColor" transform="translate(-256 -256)"></path><!----></g></svg>`;

	// async function replacerFactory(): Promise<(match: string) => string> {
	//     const docs = await documents.value;
	//     return (match: string) => {
	//         const doc = docs.find((d) => d.id === match);

	//         return `<span class="bg-surface-100-900 py-1 px-2 rounded flex flex-row items-center gap-2 hover:shadow-lg w-fit transition-all">
	//         ${doc?.title ?? 'Unbekanntes Dokument'}
	//         <a href="/documents/${doc?.id}" target="_blank">
	//         ${icon}
	//         </a>
	//         </span>`;
	//     };
	// }
</script>

<div class={twMerge(clsx('group flex w-full flex-col items-start', clazz))}>
	<img src="/images/bot.webp" alt="bot" class="h-auto w-12 object-cover" />
	<div class="text-surface-950-50 prose prose-strong:text-surface-950-50 prose-p:my-1 pt-2.5">
		<div
			class="border-b-primary-500/80 ml-4 h-0 w-0 border-r-8 border-b-8 border-l-8 border-r-transparent border-l-transparent"
		></div>
		<div class="bg-primary-500/80 shrink-0 overflow-hidden rounded-sm px-2">
			{#if b_message.message}
				<Markdown source={b_message.message} />
			{:else}
				{@render loading()}
			{/if}
		</div>
	</div>
	<div
		class={[
			'text-surface-500 flex -translate-x-3 flex-row items-center transition-all group-hover:opacity-100',
			b_message.liked || b_message.disliked ? 'opacity-100' : 'opacity-0'
		]}
	>
		<CopyToClipboardButton
			text={b_message.message}
			toastMessage="Nachricht wurde in die Zwischenablage kopiert"
		/>
		<button
			type="button"
			class="btn-icon"
			onclick={() => {
				b_message.liked = !b_message.liked;
				b_message.disliked = false;
			}}
		>
			<ThumbsUp class={[b_message.liked && 'fill-surface-500/50']} />
		</button>
		<button
			type="button"
			class="btn-icon"
			onclick={() => {
				b_message.liked = false;
				b_message.disliked = !b_message.disliked;
			}}
		>
			<ThumbsDown class={[b_message.disliked && 'fill-surface-500/50']} />
		</button>
		{#if b_message.time}
			<p class="text-surface-400-600 pl-2">
				{b_message.time.toLocaleString('de')}
			</p>
		{/if}
	</div>
</div>

{#snippet defaultLoading()}
	<p class="flex flex-row">
		<span class="h-4 animate-bounce rounded-full pl-1">.</span>
		<span class="h-4 animate-bounce rounded-full" style="animation-delay: 125ms !important;">
			.
		</span>
		<span class="h-4 animate-bounce rounded-full" style="animation-delay: 250ms !important;">
			.
		</span>
	</p>
{/snippet}
