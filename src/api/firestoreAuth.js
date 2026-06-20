import { auth } from '../config/firebase';

/** Refresh auth token once after sign-in (call from AuthContext only). */
export const refreshAuthToken = async () => {
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user) return null;
  await user.getIdToken(true);
  return user;
};

/** Verify the signed-in user matches the Firestore path uid before writes. */
export const assertFirestoreUid = async (uid) => {
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user || user.uid !== uid) throw new Error('UNAUTHORIZED');
  return user;
};
