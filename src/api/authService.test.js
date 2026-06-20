import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSignInWithPopup = vi.fn();
const mockSignInWithRedirect = vi.fn();
const mockGetRedirectResult = vi.fn();
const mockGetDoc = vi.fn();
const mockSetDoc = vi.fn();

vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: vi.fn().mockImplementation(function GoogleAuthProvider() {
    this.setCustomParameters = vi.fn();
  }),
  signInWithPopup: (...args) => mockSignInWithPopup(...args),
  signInWithRedirect: (...args) => mockSignInWithRedirect(...args),
  getRedirectResult: (...args) => mockGetRedirectResult(...args),
}));

vi.mock('firebase/firestore', () => ({
  doc: (...args) => ({ path: args.join('/') }),
  getDoc: (...args) => mockGetDoc(...args),
  setDoc: (...args) => mockSetDoc(...args),
}));

vi.mock('../config/firebase', () => ({
  auth: {},
  db: {},
}));

vi.mock('./firestoreAuth', () => ({
  assertFirestoreUid: vi.fn().mockResolvedValue({ uid: 'u1' }),
  refreshAuthToken: vi.fn().mockResolvedValue({ uid: 'u1' }),
}));

import { buildDefaultUserProfile, ensureUserDocument, signInWithGoogle, resolveGoogleRedirect } from './authService';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetDoc.mockResolvedValue({ exists: () => false });
    mockSetDoc.mockResolvedValue(undefined);
  });

  it('buildDefaultUserProfile includes core fields', () => {
    const profile = buildDefaultUserProfile({ name: 'Alex' });
    expect(profile.name).toBe('Alex');
    expect(profile.activeCounts).toEqual({});
    expect(profile.purchaseType).toBe('PACK');
    expect(profile.lifetimeAggregates).toEqual({ saved: 0, wasted: 0 });
  });

  it('ensureUserDocument creates profile for new users', async () => {
    const created = await ensureUserDocument({
      uid: 'u1',
      displayName: 'Alex',
      email: 'alex@test.com',
      photoURL: 'https://example.com/p.jpg',
    });

    expect(created).toBe(true);
    expect(mockSetDoc).toHaveBeenCalled();
  });

  it('ensureUserDocument skips existing users with complete profile', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        name: 'Alex',
        activeCounts: {},
        lifetimeAggregates: { saved: 0, wasted: 0 },
        unitPrice: 0.5,
        widgetSize: 'MEDIUM',
        dayStartHour: 6,
        accent: '#FF5F5F',
        estimatedYield: 20,
        pouchPrice: 0,
        purchaseType: 'PACK',
      }),
    });
    const created = await ensureUserDocument({ uid: 'u1', displayName: 'Alex' });
    expect(created).toBe(false);
    expect(mockSetDoc).not.toHaveBeenCalled();
  });

  it('signInWithGoogle uses popup on desktop', async () => {
    mockSignInWithPopup.mockResolvedValue({ user: { uid: 'u1', displayName: 'Alex' } });
    const result = await signInWithGoogle();
    expect(mockSignInWithPopup).toHaveBeenCalled();
    expect(result.redirected).toBe(false);
  });

  it('resolveGoogleRedirect completes pending redirect sign-in', async () => {
    mockGetRedirectResult.mockResolvedValue({ user: { uid: 'u2', displayName: 'Sam' } });
    const user = await resolveGoogleRedirect();
    expect(user).toMatchObject({ uid: 'u2' });
    expect(mockSetDoc).toHaveBeenCalled();
  });
});
