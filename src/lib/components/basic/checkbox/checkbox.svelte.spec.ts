import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { fn } from '@vitest/spy';
import { describe, expect, it } from 'vitest';
import { Checkbox } from '../index';

const testId = 'checkbox';

describe('Basic/Checkbox', () => {
    it('renders the checked icon', async () => {
        render(Checkbox, { testId, checked: true });

        const checkbox = screen.getByTestId(testId);
        expect(checkbox).toBeVisible();
        const icon = checkbox.querySelector('svg');
        expect(icon).toBeVisible();
    });

    it('fires click event when clicked', async () => {
        const callback = fn();
        render(Checkbox, { testId, onclick: callback });

        const checkbox = screen.getByTestId(testId);
        expect(checkbox).toBeVisible();
        checkbox.click();
        expect(callback).toHaveBeenCalledOnce();
    });

    it("doesn't fire click event when disabled", async () => {
        const callback = fn();
        render(Checkbox, { testId, onclick: callback, disabled: true });

        const checkbox = screen.getByTestId(testId);
        expect(checkbox).toBeVisible();
        await userEvent.click(checkbox);
        expect(callback).not.toHaveBeenCalled();
    });
});
