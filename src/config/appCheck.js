import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const getSiteKey = (env) => String(env.VITE_FIREBASE_APP_CHECK_KEY || '').trim();

/** Enable Firebase App Check debug tokens (local dev). See .env.example */
const enableDebugToken = (env) => {
  if (typeof globalThis === 'undefined') return;

  const explicit = String(env.VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN || '').trim();
  globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN = explicit || true;

  if (!explicit) {
    console.info(
      '[app-check] Debug mode — register the token printed below in Firebase Console → App Check → your web app → Manage debug tokens'
    );
  }
};

/**
 * Initializes App Check when VITE_FIREBASE_APP_CHECK_KEY is set.
 * Returns the App Check instance or null when skipped (tests / missing key).
 */
export const initAppCheck = (app, env = import.meta.env) => {
  if (env.MODE === 'test') return null;

  const siteKey = getSiteKey(env);
  if (!siteKey) {
    if (env.PROD) {
      console.error(
        '[app-check] Missing VITE_FIREBASE_APP_CHECK_KEY. Register reCAPTCHA v3 in Firebase Console → App Check, add the site key to .env, and rebuild.'
      );
    }
    return null;
  }

  const useDebug = env.DEV || env.VITE_FIREBASE_APP_CHECK_DEBUG === 'true';
  if (useDebug) enableDebugToken(env);

  return initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
};
