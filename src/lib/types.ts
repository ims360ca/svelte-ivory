import type { HTMLAttributes } from 'svelte/elements';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IvoryComponent<RootElement extends EventTarget>
    extends HTMLAttributes<RootElement> {}
