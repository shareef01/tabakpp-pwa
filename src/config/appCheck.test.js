import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockInitializeAppCheck = vi.fn(() => ({ token: 'mock' }));
const mockReCaptchaV3Provider = vi.fn(function ReCaptchaV3Provider(key) {
  this.key = key;
});

vi.mock('firebase/app-check', () => ({
  initializeAppCheck: (...args) => mockInitializeAppCheck(...args),
  ReCaptchaV3Provider: mockReCaptchaV3Provider,
}));

const prodEnv = {
  MODE: 'production',
  PROD: true,
  DEV: false,
  VITE_FIREBASE_APP_CHECK_KEY: '',
};

describe('initAppCheck', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN;
  });

  it('skips initialization in test mode', async () => {
    const { initAppCheck } = await import('./appCheck');
    expect(initAppCheck({ name: 'test' }, { ...prodEnv, MODE: 'test', VITE_FIREBASE_APP_CHECK_KEY: 'key' })).toBeNull();
    expect(mockInitializeAppCheck).not.toHaveBeenCalled();
  });

  it('skips when site key is missing in production', async () => {
    const { initAppCheck } = await import('./appCheck');
    expect(initAppCheck({ name: 'test' }, prodEnv)).toBeNull();
    expect(mockInitializeAppCheck).not.toHaveBeenCalled();
  });

  it('initializes ReCaptcha v3 provider when site key is present', async () => {
    const app = { name: 'tabakpp' };
    const { initAppCheck } = await import('./appCheck');
    const result = initAppCheck(app, { ...prodEnv, VITE_FIREBASE_APP_CHECK_KEY: 'recaptcha-site-key' });
    expect(mockReCaptchaV3Provider).toHaveBeenCalledWith('recaptcha-site-key');
    expect(mockInitializeAppCheck).toHaveBeenCalledWith(app, {
      provider: expect.objectContaining({ key: 'recaptcha-site-key' }),
      isTokenAutoRefreshEnabled: true,
    });
    expect(result).toEqual({ token: 'mock' });
  });

  it('enables debug token in dev when site key is present', async () => {
    const { initAppCheck } = await import('./appCheck');
    initAppCheck(
      { name: 'tabakpp' },
      { ...prodEnv, DEV: true, PROD: false, VITE_FIREBASE_APP_CHECK_KEY: 'recaptcha-site-key' }
    );
    expect(globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN).toBe(true);
  });
});
