import type { Action } from 'svelte/action';

export const onFirstVisible: Action<
    HTMLElement,
    {
        callback: () => void;
        options?: Partial<IntersectionObserverInit>;
    }
> = (node, input) => {
    const observer = new IntersectionObserver(
        (e) => {
            if (!e[0].isIntersecting) {
                return;
            }

            input.callback();
        },
        { root: null, threshold: 1, ...input.options }
    );

    observer.observe(node);

    return {
        destroy: () => {
            observer.disconnect();
        }
    };
};
