<script lang="ts" module>
    export interface PortalConfig {
        defaultTarget: string;
    }

    const defaultConfig: PortalConfig = {
        defaultTarget: 'body'
    };

    let config = $state<PortalConfig>(defaultConfig);
    export function setConfig(newConfig: Partial<PortalConfig>) {
        config = { ...defaultConfig, ...newConfig };
    }
</script>

<script lang="ts">
    import type { Snippet } from 'svelte';
    import { portal } from '../../../utils/actions/index';

    interface Props {
        children: Snippet;
        target?: string | HTMLElement;
    }

    let { children, target }: Props = $props();
</script>

<!-- 
    @component
    A portal, renders its children in a different DOM element.

    Wrapps the `use:portal` action.

    **Use sparingy as it can make the DOM structure confusing**
-->
<div use:portal={target ?? config.defaultTarget} hidden>
    {@render children()}
</div>
