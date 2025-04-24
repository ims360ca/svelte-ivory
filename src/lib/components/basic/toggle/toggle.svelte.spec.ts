import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { fn } from '@vitest/spy';
import { describe, expect, it } from 'vitest';
import Toggle from './Toggle.svelte';

const testId = 'toggle';

describe('Basic/Toggle', () => {
    it('fires click event when clicked', async () => {
        const callback = fn();
        render(Toggle, { testId, onclick: callback });

        const toggle = screen.getByTestId(testId);
        expect(toggle).toBeVisible();
        toggle.click();
        expect(callback).toHaveBeenCalledOnce();
    });
});
