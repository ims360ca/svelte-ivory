<script lang="ts" module>
    import { getContext, setContext, type Snippet } from 'svelte';

    interface Props {
        onclick?: () => void;
        href?: string;
        children: Snippet;
    }

    interface RowContext {
        readonly onclick?: () => void;
        readonly href?: string;
    }

    const CONTEXT = {};

    function setRowContext(context: RowContext) {
        setContext(CONTEXT, context);
    }

    export function getRowContext(): RowContext {
        return getContext(CONTEXT);
    }
</script>

<script lang="ts">
    let { onclick, href, children }: Props = $props();

    setRowContext({
        get onclick() {
            return onclick;
        },
        get href() {
            return href;
        }
    });
</script>

{@render children()}
