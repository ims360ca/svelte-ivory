import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { fn } from '@vitest/spy';
import { describe, expect, it } from 'vitest';
import { shortcut } from './shortcut.svelte';

describe('shortcut', () => {
    it('should call the callback when the key is pressed', async () => {
        const node = document.createElement('div');
        const keyCode = 'Enter';
        const callback = fn();
        shortcut({
            callback,
            code: keyCode
        })(node);
        await userEvent.keyboard(`{${keyCode}}`);
        expect(callback).toHaveBeenCalledOnce();
    });
});
