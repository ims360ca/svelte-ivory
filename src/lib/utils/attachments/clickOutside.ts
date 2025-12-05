import type { Attachment } from 'svelte/attachments';

interface ClickOutsideParams {
    /** Callback to be called when clicking outside of node */
    callback: (e: MouseEvent) => void;
    /** Callback is also not fired if the click target is inside this element */
    target?: Element;
}

export const clickOutside =
    (params: ((e: MouseEvent) => void) | ClickOutsideParams): Attachment =>
    (node) => {
        function handleClick(event: MouseEvent) {
            if (
                !(event.target instanceof Node) ||
                !node ||
                node.contains(event.target) ||
                event.defaultPrevented
            )
                return;

            if (typeof params === 'function') {
                params(event);
                return;
            }

            if (params.target?.contains(event.target)) return;
            params.callback(event);
        }

        document.addEventListener('click', handleClick, true);

        return () => {
            document.removeEventListener('click', handleClick, true);
        };
    };
