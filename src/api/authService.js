import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { DEFAULT_DAY_START_HOUR } from '../utils/logic';
import { assertFirestoreUid } from './firestoreAuth';

export const BRAND_ACCENT = '#FF5F5F';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const buildDefaultUserProfile = ({ name, avatar = null } = {}) => ({
  name: name || 'User',
  accent: BRAND_ACCENT,
  widgetSize: 'MEDIUM',
  purchaseType: 'PACK',
  activeCounts: {},
  unitPrice: 0.5,
  pouchPrice: 0,
  estimatedYield: 20,
  dayStartHour: DEFAULT_DAY_START_HOUR,
  lifetimeAggregates: { saved: 0, wasted: 0 },
  ...(avatar ? { avatar } : {}),
});

export const patchUserProfileDefaults = (data = {}) => {
  const patch = {};
  if (!data || typeof data.activeCounts !== 'object' || data.activeCounts === null) {
    patch.activeCounts = {};
  }
  if (!data?.lifetimeAggregates) patch.lifetimeAggregates = { saved: 0, wasted: 0 };
  if (data?.unitPrice === undefined) patch.unitPrice = 0.5;
  if (data?.pouchPrice === undefined) patch.pouchPrice = 0;
  if (data?.estimatedYield === undefined) patch.estimatedYield = 20;
  if (data?.dayStartHour === undefined) patch.dayStartHour = DEFAULT_DAY_START_HOUR;
  if (!data?.widgetSize) patch.widgetSize = 'MEDIUM';
  if (!data?.accent) patch.accent = BRAND_ACCENT;
  if (!data?.purchaseType) patch.purchaseType = 'PACK';
  return patch;
};

export const ensureUserDocument = async (user) => {
  if (!user?.uid) return false;

  await assertFirestoreUid(user.uid);

  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  const name = user.displayName || user.email?.split('@')[0] || 'User';

  if (!snap.exists()) {
    await setDoc(userRef, buildDefaultUserProfile({ name, avatar: user.photoURL || null }));
    return true;
  }

  const patch = patchUserProfileDefaults(snap.data());
  if (!snap.data()?.name) patch.name = name;
  if (Object.keys(patch).length > 0) {
    await setDoc(userRef, patch, { merge: true });
  }
  return false;
};

export const completeGoogleSignIn = async (credential) => {
  if (!credential?.user) return null;
  await ensureUserDocument(credential.user);
  return credential.user;
};

const prefersRedirect = () => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent || '';
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
  return isMobile || isStandalone;
};

export const signInWithGoogle = async () => {
  if (prefersRedirect()) {
    await signInWithRedirect(auth, googleProvider);
    return { redirected: true };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    await completeGoogleSignIn(result);
    return { redirected: false, user: result.user };
  } catch (err) {
    if (err?.code === 'auth/popup-blocked' || err?.code === 'auth/operation-not-supported-in-this-environment') {
      await signInWithRedirect(auth, googleProvider);
      return { redirected: true };
    }
    throw err;
  }
};

export const resolveGoogleRedirect = async () => {
  const result = await getRedirectResult(auth);
  if (!result) return null;
  return completeGoogleSignIn(result);
};
