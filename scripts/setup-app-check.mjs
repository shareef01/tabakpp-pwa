/**
 * One-shot App Check console setup via Firebase REST API.
 * Requires: firebase login (same account that owns tabakpp-ff036)
 *
 * Usage: node scripts/setup-app-check.mjs [debug-token-uuid]
 */
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const auth = require('firebase-tools/lib/auth.js');
const scopes = require('firebase-tools/lib/scopes.js');

const PROJECT_NUMBER = '651175477527';
const APP_ID = '1:651175477527:web:6bfdc238b5927ed09b3752';
const APP_ENCODED = encodeURIComponent(APP_ID);
const BASE = 'https://firebaseappcheck.googleapis.com/v1';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, '.env');

async function getAccessToken() {
  const account = auth.getGlobalDefaultAccount();
  if (!account?.tokens?.refresh_token) {
    throw new Error('Not logged in. Run: firebase login');
  }
  const tokens = await auth.getAccessToken(account.tokens.refresh_token, [scopes.CLOUD_PLATFORM]);
  return tokens.access_token;
}

async function api(accessToken, path, method, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let payload = text;
  try {
    payload = JSON.parse(text);
  } catch {
    /* plain text */
  }
  if (!res.ok) {
    const detail = typeof payload === 'string' ? payload : JSON.stringify(payload);
    throw new Error(`${method} ${path} → ${res.status}: ${detail}`);
  }
  return payload;
}

function upsertEnvDebugToken(token) {
  const line = `VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN=${token}`;
  let content = readFileSync(envPath, 'utf8');
  if (/^VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN=/m.test(content)) {
    content = content.replace(/^VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN=.*$/m, line);
  } else {
    content = `${content.trimEnd()}\n\n# Pinned App Check debug token (registered in Firebase Console)\n${line}\n`;
  }
  writeFileSync(envPath, content, 'utf8');
}

async function main() {
  const debugToken = (process.argv[2] || randomUUID()).trim();
  console.log('[app-check] Using Firebase account from firebase login…');
  const accessToken = await getAccessToken();

  console.log('[app-check] Registering debug token…');
  await api(
    accessToken,
    `/projects/${PROJECT_NUMBER}/apps/${APP_ENCODED}/debugTokens`,
    'POST',
    { displayName: 'tabakpp-pwa local dev', token: debugToken }
  );
  console.log(`[app-check] Debug token registered: ${debugToken}`);

  console.log('[app-check] Setting Firestore App Check to Monitoring (UNENFORCED)…');
  const service = await api(
    accessToken,
    `/projects/${PROJECT_NUMBER}/services/firestore.googleapis.com?updateMask=enforcementMode`,
    'PATCH',
    {
      name: `projects/${PROJECT_NUMBER}/services/firestore.googleapis.com`,
      enforcementMode: 'UNENFORCED',
    }
  );
  console.log(`[app-check] Firestore enforcement: ${service.enforcementMode}`);

  console.log('[app-check] Checking reCAPTCHA v3 provider config…');
  try {
    const recaptcha = await api(
      accessToken,
      `/projects/${PROJECT_NUMBER}/apps/${APP_ENCODED}/recaptchaV3Config`,
      'GET'
    );
    console.log('[app-check] reCAPTCHA v3 provider is configured.');
    if (recaptcha.siteSecret) {
      console.log('[app-check] Secret key is set on the provider.');
    }
  } catch (err) {
    console.warn(`[app-check] Could not verify reCAPTCHA config: ${err.message}`);
    console.warn('[app-check] Paste the reCAPTCHA secret key in Firebase Console → App Check → pwatabak → Save.');
  }

  upsertEnvDebugToken(debugToken);
  console.log('[app-check] Updated .env with VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN');
  console.log('[app-check] Done. Run npm run dev — local Firestore should work with the pinned token.');
}

main().catch((err) => {
  console.error('[app-check] Setup failed:', err.message);
  process.exit(1);
});
