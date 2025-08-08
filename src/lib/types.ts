import type { HTMLAttributes } from 'svelte/elements';
import type { TransitionConfig } from 'svelte/transition';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IvoryComponent<RootElement extends EventTarget>
    extends HTMLAttributes<RootElement> {}

export interface TransitionProps {
    inTransition?: (node: Element) => TransitionConfig;
    outTransition?: (node: Element) => TransitionConfig;
}
