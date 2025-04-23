<script lang="ts" module>
	import clsx from 'clsx';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	export interface Props {
		children: Snippet;
		class?: ClassValue;
	}

	export function setClasses(c: ClassValue) {
		defaultClasses = c;
	}

	let defaultClasses = $state<ClassValue>('');
</script>

<script lang="ts">
	let { children, class: clazz }: Props = $props();
</script>

<!-- 
    @component
    A component for unified headings.  
    Classes that are set using the `setDefaultClasses` function will be applied to all headings,
    including the ones used in other components of this lib, e.g. the `Modal`.
    If you set the `defaultClasses`, make sure to call it before using a component that uses the heading component (e.g. your root `+layout.svelte`).
-->

<h2 class={twMerge(clsx('truncate text-lg font-bold select-none', defaultClasses, clazz))}>
	{@render children()}
</h2>
