<script lang="ts">
    import type { Snippet } from 'svelte';
    import { portal } from '../../../utils/actions/index';

    interface Props {
        children: Snippet;
        target?: string | HTMLElement;
    }

    let { children, target = 'body' }: Props = $props();
</script>

<!-- 
    @component
    A portal, renders its children in a different DOM element.

    Wrapps the `use:portal` action.

    **Use sparingy as it can make the DOM structure confusing**
-->
<div use:portal={target} hidden>
    {@render children()}
</div>
