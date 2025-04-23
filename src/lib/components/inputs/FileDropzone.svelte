<script lang="ts">
	import { FileUp, X } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type Props = {
		b_files?: File[];
		class?: ClassValue;
		accept?: string[];
		children?: Snippet;
	};

	let { b_files: b_files = $bindable(), class: clazz, accept, children }: Props = $props();

	let hovering = $state(false);
	let input = $state<HTMLInputElement>();

	$effect(function resetSelectedFile() {
		if (input && !b_files) {
			input.value = '';
		}
	});

	function onDrop(
		event: DragEvent & {
			currentTarget: EventTarget & HTMLElement;
		}
	) {
		onChange(event.dataTransfer?.files);
	}

	function onChange(files: FileList | undefined | null) {
		if (!files) return;
		b_files = Array.from(files);
	}

	function remove(file: File) {
		if (!b_files) return;
		b_files = b_files.filter((e) => e !== file);
	}
</script>

<div class={['flex flex-col', clazz]}>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class={[
			'group relative h-full min-h-16 w-full rounded border transition-all',
			hovering ? 'bg-primary-50-950' : 'bg-inherit'
		]}
		ondragover={() => {
			hovering = true;
		}}
		ondragleave={() => {
			hovering = false;
		}}
		ondrop={(e) => {
			e.preventDefault();
			e.stopPropagation();
			hovering = false;
			onDrop(e);
		}}
	>
		{#if children}
			{@render children()}
		{:else}
			<div class="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
				{#if b_files && b_files.length > 0}
					<div class="flex flex-row items-center gap-4">
						{#each b_files as file}
							<div class="bg-primary-200-800 flex w-fit items-center rounded-full py-2 pr-2 pl-4">
								<p>{file.name}</p>
								<button
									type="button"
									class="btn-icon hover:text-primary-500 z-10"
									onclick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										remove(file);
									}}
								>
									<X />
								</button>
							</div>
						{/each}
					</div>
				{:else}
					<div
						class="bg-primary-200-800 group-hover:bg-primary-300-700 flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl transition-colors"
					>
						<FileUp />
					</div>
				{/if}
				<p class="group-hover:text-primary-500 transition-colors">
					Klicke zum Hochladen oder ziehe die Datei hierher
				</p>
			</div>
		{/if}
		<input
			onchange={(e) => {
				onChange(e.currentTarget?.files);
			}}
			multiple
			type="file"
			title=""
			accept={accept?.map((e) => '.' + e).join(', ')}
			class="absolute top-0 left-0 h-full w-full grow cursor-pointer opacity-0"
		/>
	</div>
</div>
