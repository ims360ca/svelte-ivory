import '@testing-library/jest-dom/vitest';
import { fireEvent } from '@testing-library/svelte';
import { fn } from '@vitest/spy';
import { describe, expect, it } from 'vitest';
import { clickOutside } from './clickOutside';

describe('clickOutside', () => {
    it('should fire when an element outside the node is clicked', async () => {
        const node = document.createElement('div');
        document.body.appendChild(node);
        const otherNode = document.createElement('div');
        document.body.appendChild(otherNode);

        const callback = fn();
        clickOutside(node, callback);

        await fireEvent(otherNode, new MouseEvent('click'));

        expect(callback).toHaveBeenCalledOnce();
    });

    it('should not fire when the target is inside the node', async () => {
        const node = document.createElement('div');
        document.body.appendChild(node);
        const nestedNode = node.appendChild(document.createElement('div'));
        const otherNode = document.createElement('div');
        document.body.appendChild(otherNode);

        const callback = fn();
        clickOutside(node, callback);

        await fireEvent(nestedNode, new MouseEvent('click'));

        expect(callback).not.toHaveBeenCalled();
    });

    it('should fire when the callback is passed in as an object', async () => {
        const node = document.createElement('div');
        document.body.appendChild(node);
        const otherNode = document.createElement('div');
        document.body.appendChild(otherNode);

        const callback = fn();
        clickOutside(node, { callback });

        await fireEvent(otherNode, new MouseEvent('click'));

        expect(callback).toHaveBeenCalledOnce();
    });

    it('should not fire when the target is inside the passed target', async () => {
        const node = document.createElement('div');
        document.body.appendChild(node);

        const otherNode = document.createElement('div');
        document.body.appendChild(otherNode);
        const nestedNode = otherNode.appendChild(document.createElement('div'));

        const callback = fn();
        clickOutside(node, { callback, target: otherNode });

        await fireEvent(nestedNode, new MouseEvent('click'));
        await fireEvent(otherNode, new MouseEvent('click'));

        expect(callback).not.toHaveBeenCalled();
    });
});
