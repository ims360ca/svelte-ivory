import type { Action } from 'svelte/action';

export const resize: Action<
    HTMLElement,
    { resized: (mouseX: number) => void; dragging: (dragging: boolean) => void }
> = (node: HTMLElement, { resized, dragging }) => {
    const onResize = (e: PointerEvent) => {
        resized(e.clientX);
    };

    const onResizeEnd = () => {
        dragging(false);
        window.removeEventListener('pointermove', onResize);
        window.removeEventListener('pointerup', onResizeEnd);
        window.removeEventListener('pointercancel', onResizeEnd);

        document.getElementsByTagName('html')[0].style.userSelect = '';
    };

    const onResizeStart = () => {
        dragging(true);
        window.addEventListener('pointermove', onResize);
        window.addEventListener('pointerup', onResizeEnd);
        window.addEventListener('pointercancel', onResizeEnd);

        document.getElementsByTagName('html')[0].style.userSelect = 'none';
    };
    node.addEventListener('pointerdown', onResizeStart);

    return {
        destroy() {
            node.removeEventListener('pointerdown', onResizeStart);
        }
    };
};
