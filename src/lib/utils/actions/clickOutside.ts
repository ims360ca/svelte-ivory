interface ClickOutsideParams {
    /** Callback to be called when clicking outside of node */
    callback: (e: MouseEvent) => void;
    /** Callback is also not fired if the click target is inside this element */
    target?: Element;
}

/** Dispatch event on click outside of node */
export function clickOutside(
    node: Element,
    params: ((e: MouseEvent) => void) | ClickOutsideParams
) {
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

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    };
}
