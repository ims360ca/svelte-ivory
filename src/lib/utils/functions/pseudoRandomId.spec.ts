import { describe, expect, it } from 'vitest';
import { pseudoRandomId } from './pseudoRandomId';

describe('pseudoRandomId', () => {
    it('generates different values', () => {
        const a = pseudoRandomId();
        const b = pseudoRandomId();
        expect(a).not.toBe(b);
    });

    it('generates values that start with the prefix', () => {
        const prefix = 'test-';
        const a = pseudoRandomId(prefix);
        const b = pseudoRandomId(prefix);
        expect(a.startsWith(prefix)).toBe(true);
        expect(b.startsWith(prefix)).toBe(true);
        expect(a).not.toBe(b);
    });
});
