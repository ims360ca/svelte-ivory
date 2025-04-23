import { describe, expect, it } from 'vitest';
import { queryParams } from './queryParams';

describe('queryParams', () => {
	it('adds all query params', () => {
		const params = {
			a: 0,
			b: '2',
			c: 3
		};
		const query = queryParams(params);
		expect(query).toBe('?a=0&b=2&c=3');
	});

	it('removes nullish values', () => {
		const params = {
			a: 0,
			b: undefined,
			c: 3,
			d: null
		};
		const query = queryParams(params);
		expect(query).toBe('?a=0&c=3');
	});
});
