import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import Modal from './Modal.svelte';

const testId = 'modal';
const contentTestId = 'modal-content';

const children = createRawSnippet(() => ({
	render: () => `<p data-testId="${contentTestId}">Content</p>`
}));

describe('Layout/Modal', () => {
	it('renders', async () => {
		let b_open = $state(true);
		render(Modal, {
			b_open,
			testId,
			children
		});
		const modal = screen.getByTestId(testId);
		expect(modal).toBeVisible();
		const content = screen.getByTestId(contentTestId);
		expect(content).toBeVisible();
	});

	it('closes when clicking outside', async () => {
		let b_open = $state(true);
		render(Modal, {
			b_open,
			testId,
			children
		});
		const modal = screen.getByTestId(testId);
		const parentNode = modal.parentElement;
		expect(parentNode).not.toBeNull();
		await fireEvent(parentNode!, new MouseEvent('click'));

		expect(modal).not.toBeVisible();
	});
});
