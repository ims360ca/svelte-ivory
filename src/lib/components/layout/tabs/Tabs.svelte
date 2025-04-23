<script lang="ts" module>
	import { getContext, onDestroy, setContext, type Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	interface TabContext {
		registerTab: (tab: string) => void;
		registerPanel: (panel: string) => void;
		selectedTab: string | undefined;
		tabs: string[];
		selectedPanel: string | undefined;
	}
	const TABS = {};

	function setTabContext(context: TabContext) {
		setContext<TabContext>(TABS, context);
	}

	export function getTabContext() {
		return getContext<TabContext>(TABS);
	}
</script>

<script lang="ts">
	type Props = {
		class?: ClassValue;
		children: Snippet;
	};

	let { class: clazz = '', children }: Props = $props();

	let index = $state(0);
	let allTabs: string[] = $state([]);
	let panels: string[] = $state([]);

	export const forward = () => {
		if (index >= panels.length - 1) {
			index = 0;
		} else {
			index++;
		}
	};

	export const back = () => {
		if (index === 0) {
			index = panels.length - 1;
		} else {
			index--;
		}
	};

	setTabContext({
		registerTab: (tab: string) => {
			allTabs.push(tab);
			onDestroy(() => {
				const i = allTabs.indexOf(tab);
				allTabs.splice(i, 1);
			});
		},

		registerPanel: (panel: string) => {
			panels.push(panel);
			index = index;
			onDestroy(() => {
				panels.filter((p) => p !== panel);
			});
		},

		get selectedTab() {
			return allTabs[index];
		},
		set selectedTab(tab: string) {
			index = allTabs.indexOf(tab);
		},
		get selectedPanel() {
			return panels[index];
		},
		set selectedPanel(panel: string) {
			index = panels.indexOf(panel);
		},
		tabs: allTabs
	});
</script>

<div class={[clazz]}>
	{@render children()}
</div>
