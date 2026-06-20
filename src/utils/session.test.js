import { describe, it, expect } from 'vitest';
import { hasOpenSession } from './logic';

describe('hasOpenSession', () => {
  it('returns false for empty or zero-valued counts', () => {
    expect(hasOpenSession({})).toBe(false);
    expect(hasOpenSession(null)).toBe(false);
    expect(hasOpenSession({ a: 0, b: 0 })).toBe(false);
  });

  it('returns true when any counter is positive', () => {
    expect(hasOpenSession({ a: 0, b: 3 })).toBe(true);
    expect(hasOpenSession({ x: 1 })).toBe(true);
  });
});
