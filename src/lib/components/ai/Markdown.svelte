<!-- 
	@component
	Renders markdown to html.  
	Uses the [marked](https://marked.js.org/) library for rendering and [dompurify](https://github.com/cure53/DOMPurify) for sanitizing the html.
-->

<script lang="ts">
	import DomPurify from 'dompurify';
	import { marked } from 'marked';

	interface Props {
		source: string;
		replace?: {
			regex: RegExp;
			replacerFactory: () => Promise<(match: string) => string> | ((match: string) => string);
		};
	}

	let { source, replace }: Props = $props();

	const html = $derived.by(async () => {
		// replace 0 width characters
		const cleanedSource = source.replace(
			// eslint-disable-next-line no-misleading-character-class
			/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,
			''
		);

		const html = await marked.parse(cleanedSource);
		// const docs = await documents.value;

		if (replace) {
			const replacer = await replace.replacerFactory();
			const replaced = html.replaceAll(replace.regex, replacer);
			return DomPurify.sanitize(replaced);
		} else {
			return DomPurify.sanitize(html);
		}
	});
</script>

{#await html then html}
	<!-- this is fine since we purify the string -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html html}
{/await}
