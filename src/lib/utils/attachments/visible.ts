import type { Attachment } from 'svelte/attachments';

export const onFirstVisible =
    (params: { callback: () => void; options?: Partial<IntersectionObserverInit> }): Attachment =>
    (node) => {
        const observer = new IntersectionObserver(
            (e) => {
                if (!e[0].isIntersecting) {
                    return;
                }

                params.callback();
            },
            { root: null, threshold: 1, ...params.options }
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    };
