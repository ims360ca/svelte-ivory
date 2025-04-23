import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { cookie } from './cookie';

describe('cookie', () => {
	it('sets correctly', () => {
		const name = 'test';
		const value = 'test';
		const days = 1;
		// this is a hack to get the value back that is actually being set
		const setCookie = cookie.set({ name, value, days });
		expect(setCookie).toBe(
			`${name}=${value}; expires=${new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000).toUTCString()}; path=/`
		);
	});

	it('gets correctly', () => {
		const name = 'test';
		const value = 'test';
		const days = 1;
		cookie.set({ name, value, days });
		expect(cookie.get(name)).toBe(value);
	});

	it("preserves existing cookie's path", () => {
		const cookie1 = {
			name: 'test',
			value: 'test'
		};
		const cookie2 = {
			name: 'test2',
			value: 'test2'
		};
		cookie.set(cookie1);
		cookie.set(cookie2);
		expect(cookie.get(cookie1.name)).toBe(cookie1.value);
		expect(cookie.get(cookie2.name)).toBe(cookie2.value);
	});

	it('updates cookies correctly', () => {
		const cookie1 = {
			name: 'test',
			value: 'test'
		};
		const cookie2 = {
			name: 'test2',
			value: 'test2'
		};
		cookie.set(cookie1);
		cookie.set(cookie2);
		cookie.set({ name: cookie1.name, value: 'newValue' });
		expect(cookie.get(cookie1.name)).toBe('newValue');
		expect(cookie.get(cookie2.name)).toBe(cookie2.value);
	});
});
