import Tab from './Tab.svelte';
import TabPanel from './TabPanel.svelte';
import { default as TabsComponent } from './Tabs.svelte';

const Tabs = Object.assign(TabsComponent, {
    Tab: Tab,
    Panel: TabPanel
});

export default Tabs;
export { type TabProps } from './Tab.svelte';
export { type TabPanelProps } from './TabPanel.svelte';
export { getTabContext, type TabContext, type TabsProps } from './Tabs.svelte';
