import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, setPersistence, browserLocalPersistence, signOut } from 'firebase/auth';
import { ensureUserDocument, resolveGoogleRedirect } from '../api/authService';
import { refreshAuthToken } from '../api/firestoreAuth';

const AuthContext = createContext({
  user: null,
  loading: true,
  bootstrapError: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bootstrapError, setBootstrapError] = useState(null);

  useEffect(() => {
    let unsubscribe;
    let active = true;

    const bootstrapUser = async (currentUser) => {
      if (!currentUser) {
        if (active) {
          setUser(null);
          setBootstrapError(null);
        }
        return;
      }
      try {
        await refreshAuthToken();
        await ensureUserDocument(currentUser);
        if (active) {
          setUser(currentUser);
          setBootstrapError(null);
        }
      } catch (error) {
        console.error('Profile bootstrap failed:', error);
        try {
          await signOut(auth);
        } catch {
          /* ignore sign-out failure */
        }
        if (active) {
          setUser(null);
          setBootstrapError(error?.message || 'Profile setup failed. Please sign in again.');
        }
      }
    };

    const initAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        await resolveGoogleRedirect();
        await auth.authStateReady();
      } catch (error) {
        console.error('Auth init failure:', error);
      }

      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        await bootstrapUser(currentUser);
        if (active) setLoading(false);
      }, (error) => {
        console.error('Auth error:', error);
        if (active) setLoading(false);
      });
    };

    initAuth();

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    bootstrapError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
