import { tick } from 'svelte';

/**
 * Places the element in a diffrent place in the DOM
 *
 * **Use sparingy as it can make the DOM structure confusing**
 */
export function portal(el: HTMLElement, target: HTMLElement | string = 'body') {
    let targetEl;
    async function update(newTarget: HTMLElement | string) {
        target = newTarget;
        if (typeof target === 'string') {
            targetEl = document.querySelector(target);
            if (targetEl === null) {
                await tick();
                targetEl = document.querySelector(target);
            }
            if (targetEl === null) {
                throw new Error(`No element found matching css selector: "${target}"`);
            }
        } else if (target instanceof HTMLElement) {
            targetEl = target;
        } else {
            throw new TypeError(
                `Unknown portal target type: ${
                    target === null ? 'null' : typeof target
                }. Allowed types: string (CSS selector) or HTMLElement.`
            );
        }
        targetEl.appendChild(el);
        el.hidden = false;
    }

    function destroy() {
        if (el.parentNode) el.parentNode.removeChild(el);
    }

    update(target);
    return {
        update,
        destroy
    };
}
