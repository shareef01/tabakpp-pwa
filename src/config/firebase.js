import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initAppCheck } from "./appCheck";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (import.meta.env.DEV) {
  const missing = Object.entries(firebaseConfig).filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) {
    console.warn(`[firebase] Missing env vars: ${missing.join(', ')}. Copy .env.example to .env`);
  }
  if (!import.meta.env.VITE_FIREBASE_APP_CHECK_KEY) {
    console.warn('[firebase] App Check disabled — set VITE_FIREBASE_APP_CHECK_KEY in .env (see .env.example)');
  }
}

const app = initializeApp(firebaseConfig);
initAppCheck(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
