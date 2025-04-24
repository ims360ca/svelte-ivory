export function focusTrap(node: HTMLElement, enabled: boolean) {
    const elementWhitelist =
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';
    let firstElement: HTMLElement;
    let lastElement: HTMLElement;

    function onFirstElemKeydown(e: KeyboardEvent): void {
        if (e.shiftKey && e.code === 'Tab') {
            e.preventDefault();
            lastElement.focus();
        }
    }

    function onLastElemKeydown(e: KeyboardEvent): void {
        if (!e.shiftKey && e.code === 'Tab') {
            e.preventDefault();
            firstElement.focus();
        }
    }

    function scanElements(fromObserver: boolean) {
        if (enabled === false) return;
        const focusableElems: HTMLElement[] = Array.from(node.querySelectorAll(elementWhitelist));
        if (focusableElems.length) {
            // Set first/last focusable elements
            firstElement = focusableElems[0];
            lastElement = focusableElems[focusableElems.length - 1];
            // Auto-focus first focusable element only when not called from mutation observer
            if (!fromObserver) firstElement.focus();
            // Listen for keydown on first & last element
            firstElement.addEventListener('keydown', onFirstElemKeydown);
            lastElement.addEventListener('keydown', onLastElemKeydown);
        }
    }
    scanElements(false);

    function cleanUp(): void {
        if (firstElement) firstElement.removeEventListener('keydown', onFirstElemKeydown);
        if (lastElement) lastElement.removeEventListener('keydown', onLastElemKeydown);
    }

    // Re-determine focusable elements when mutations are observed
    const onObservationChange = (mutationRecords: MutationRecord[], observer: MutationObserver) => {
        if (mutationRecords.length) {
            cleanUp();
            scanElements(true);
        }
        return observer;
    };
    const observer = new MutationObserver(onObservationChange);
    observer.observe(node, { childList: true, subtree: true });

    // Lifecycle
    return {
        update(newArgs: boolean) {
            enabled = newArgs;
            if (newArgs) scanElements(false);
            else cleanUp();
        },
        destroy() {
            cleanUp();
            observer.disconnect();
        }
    };
}
