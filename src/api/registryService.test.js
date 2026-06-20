import { describe, it, expect, vi } from 'vitest';

vi.mock('../config/firebase', () => ({ db: {} }));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  onSnapshot: vi.fn(),
  orderBy: vi.fn(),
  writeBatch: vi.fn(),
  limit: vi.fn(),
  serverTimestamp: vi.fn(),
  increment: vi.fn((n) => n),
  getDoc: vi.fn(),
  runTransaction: vi.fn(),
}));

vi.mock('../utils/logic', () => ({
  SmokingCalculator: {
    calculateFinancials: vi.fn(() => ({ saved: 5, wasted: 2 })),
  },
}));

import { LOG_QUERY_LIMIT } from './registryService';

describe('RegistryService constants', () => {
  it('exports log query limit for UI truncation banner', () => {
    expect(LOG_QUERY_LIMIT).toBe(500);
  });
});
