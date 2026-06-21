# TABAK++ — Set up on a new computer

Use this guide after cloning the repo on another machine. **Secrets are never stored in git** — you must copy them manually from Firebase Console or from your current `.env` file.

---

## 1. Prerequisites

Install on the new computer:

| Tool | Version | Check |
|------|---------|--------|
| **Git** | any recent | `git --version` |
| **Node.js** | 18+ (20 LTS recommended) | `node --version` |
| **npm** | comes with Node | `npm --version` |

Optional (only if you will **deploy** to Firebase from this machine):

| Tool | Install |
|------|---------|
| **Firebase CLI** | `npm install -g firebase-tools` then `firebase login` |

---

## 2. Clone the repository

```bash
git clone https://github.com/shareef01/tabakpp-pwa.git
cd tabakpp-pwa
npm install
```

**Repo:** https://github.com/shareef01/tabakpp-pwa  
**Live app:** https://tabakpp.web.app  
**Firebase project ID:** `tabakpp-ff036` (see `.firebaserc`)

---

## 3. Environment variables (required)

### Create `.env`

```bash
cp .env.example .env
```

Edit `.env` and fill in every `VITE_FIREBASE_*` value.

### Where to get the keys

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select project **tabakpp-ff036**
3. Go to **Project settings** (gear) → **Your apps** → **Web app**
4. If no web app exists, click **Add app** → Web
5. Copy the config object fields into `.env`:

| `.env` variable | Firebase config field |
|-----------------|------------------------|
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `appId` |

### App Check (required for production-like local dev)

1. Firebase Console → **Build** → **App Check**
2. Register the **Web** app with **reCAPTCHA v3**
3. Copy the **site key** (public) → `VITE_FIREBASE_APP_CHECK_KEY` in `.env`  
   **Do not** put the reCAPTCHA **secret** in `.env` — it stays in Firebase Console only.

### Local development debug token

When App Check is enabled, local `npm run dev` needs a debug token:

1. Run `npm run dev` once
2. Open browser DevTools → Console
3. Find a line like: `App Check debug token: …`
4. Firebase Console → App Check → your web app → **Manage debug tokens** → Add that token

Or set a fixed token in `.env`:

```env
VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN=your-token-here
```

---

## 4. Copy secrets from your old computer (easiest)

On the machine that already works:

1. Copy the file `.env` (project root) to the new machine via USB, encrypted cloud, or password manager — **never commit it to git**
2. Place it at `tabakpp-pwa/.env`
3. Skip manual Firebase Console entry if values match

---

## 5. Run the app

```bash
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

### Verify

```bash
npm test -- --run    # 58 tests should pass
npm run build        # production build to dist/
```

---

## 6. Deploy (optional)

Only if this machine should publish to Firebase Hosting:

```bash
firebase login
npm run build
firebase deploy --only hosting,firestore:rules
```

You need **Firebase project access** on the Google account you log in with.

---

## 7. What is in git vs what you must bring

| In git (safe) | Not in git (you must provide) |
|---------------|-------------------------------|
| Source code, tests, Firestore rules | `.env` (all `VITE_*` keys) |
| `.env.example` (template, empty values) | Firebase CLI login session |
| `.firebaserc` (project id) | App Check debug token (for local dev) |
| `public/`, configs | |

**Never commit:** `.env`, `.env.local`, `node_modules/`, `dist/`, Firebase service account JSON.

---

## 8. Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank app / auth errors | Check `.env` — all `VITE_FIREBASE_*` filled; restart dev server after editing |
| Firestore permission denied | App Check: add debug token; ensure you're signed in |
| `Missing VITE_FIREBASE_APP_CHECK_KEY` in console | Add site key to `.env` or ignore in dev if App Check not enforced |
| PWA shows old broken build | Hard refresh or clear site data / unregister service worker |
| `npm install` fails | Use Node 18+; delete `node_modules` and retry |

---

## 9. Kotlin Multiplatform app (separate project)

If you also work on the **Android/KMP** client in Android Studio:

- That project may live in a **different folder/repo** — push it separately if it is not inside `tabakpp-pwa`
- Use the **same Firebase project** (`tabakpp-ff036`) and the same Firestore schema
- Android needs `google-services.json` from Firebase Console → Project settings → Your apps → **Android**
- iOS needs `GoogleService-Info.plist` from the **iOS** app entry
- Do not commit those files if they contain sensitive keys; add them locally per machine (or use CI secrets)

PWA reference for UI/logic:

- https://github.com/shareef01/tabakpp-pwa/tree/main/src
- Screenshots: `public/screenshots/`

---

## 10. Quick checklist (new machine)

- [ ] Git clone `https://github.com/shareef01/tabakpp-pwa.git`
- [ ] `npm install`
- [ ] Copy or create `.env` from `.env.example`
- [ ] Fill all `VITE_FIREBASE_*` + `VITE_FIREBASE_APP_CHECK_KEY`
- [ ] Register App Check debug token (local dev)
- [ ] `npm run dev` — sign in works
- [ ] `npm test -- --run` passes
- [ ] (Optional) `firebase login` + deploy

---

*Last updated for commit on `main`. Firebase project: `tabakpp-ff036`.*
