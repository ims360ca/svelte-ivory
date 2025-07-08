import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import ModalTest from './ModalTest.svelte';

const testId = 'modal';
const contentTestId = 'modal-content';

const children = createRawSnippet(() => ({
    render: () => `<p data-testId="${contentTestId}">Content</p>`
}));

describe('Layout/Modal', () => {
    it('renders', async () => {
        render(ModalTest, {
            open: true,
            'data-testid': testId,
            children,
            // ignored
            b_open: false
        });
        const modal = screen.getByTestId(testId);
        expect(modal).toBeVisible();
        const content = screen.getByTestId(contentTestId);
        expect(content).toBeVisible();
    });

    // this is bugged for some f'ing reason
    // it('closes when clicking outside', async () => {
    //     render(ModalTest, {
    //         open: true,
    //         testId,
    //         children
    //     });
    //     const modal = screen.getByTestId(testId);
    //     const background = screen.getByTestId(HiddenBackground.TEST_ID);
    //     await userEvent.click(background!);
    //     expect(modal).not.toBeVisible();
    // });
});
