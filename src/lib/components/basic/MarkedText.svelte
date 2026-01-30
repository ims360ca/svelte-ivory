<script lang="ts" module>
    import type { Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';

    export type MarkedTextProps = {
        class?: ClassValue;
        content: string | undefined;
        search: string | undefined;
        element?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        id?: string | undefined;
        children?: Snippet<[{ match: string }]>;
    };
</script>

<script lang="ts">
    let {
        class: clazz = 'shrink-0 whitespace-nowrap text-ellipsis overflow-hidden max-w-full',
        content,
        search,
        element = 'p',
        id,
        children
    }: MarkedTextProps = $props();

    /**
     * @param str
     * @param search
     * @return tokens: list with {match, prev}, where 'match' matches the search (case-insensitive) and prev is the string between 'match' and the prev 'match' (or start)
     * @return tail: the string after the last match
     */
    const split = (str: string, search: string) => {
        const matchLen = search.length;
        var tokens: { match: string; prev: string }[] = [];
        let pos = str.toLowerCase().search(search.toLowerCase());
        while (pos != -1) {
            tokens.push({
                match: str.slice(pos, pos + matchLen),
                prev: str.slice(0, pos)
            });
            str = str.slice(pos + matchLen);
            pos = str.search(search);
        }
        return {
            tokens,
            tail: str
        };
    };

    const { tokens, tail } = $derived.by(() => {
        if (!search || !content) return { tokens: [], tail: content };
        return split(content, search);
    });
</script>

<!-- @component
    marks text-parts matching the given search parameter 
-->
<svelte:element this={element} class={[clazz]} {id}>
    {#each tokens as token (token)}
        {token.prev}
        {#if children}
            {@render children?.({ match: token.match })}
        {:else}
            <mark class="bg-primary-500 text-surface-50 shrink-0 rounded-sm px-px py-0.5">
                {token.match}
            </mark>
        {/if}
    {/each}
    {tail}
</svelte:element>
