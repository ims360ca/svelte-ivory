import Tab from './Tab.svelte';
import TabPanel from './TabPanel.svelte';
import { default as TabsComponent } from './Tabs.svelte';

const Tabs = Object.assign(TabsComponent, {
    Tab: Tab,
    Panel: TabPanel
});

export default Tabs;
