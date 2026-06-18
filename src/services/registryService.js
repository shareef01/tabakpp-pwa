import {
  collection, doc, setDoc, updateDoc, deleteDoc,
  query, onSnapshot, orderBy, writeBatch, limit, serverTimestamp, increment
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * RegistryService (Model Layer)
 * Hardened for Security and Query Efficiency.
 */
export const RegistryService = {

  // --- CONFIGURATIONS (Protocols) ---

  subscribeToConfigs: (uid, onSuccess, onError) => {
    if (!uid) return () => {};
    const q = query(
      collection(db, 'users', uid, 'configs'),
      orderBy('order', 'asc')
    );
    return onSnapshot(q, (s) => {
      onSuccess(s.docs.map(d => ({ id: d.id, ...d.data() })));
    }, onError);
  },

  addProtocol: async (uid, data) => {
    if (!uid) throw new Error("UNAUTHORIZED_ACCESS");
    const ref = doc(collection(db, 'users', uid, 'configs'));
    return setDoc(ref, {
      ...data,
      createdAt: serverTimestamp()
    });
  },

  updateProtocol: async (uid, pid, data) => {
    if (!uid || !pid) throw new Error("INVALID_REFERENCE");
    return updateDoc(doc(db, 'users', uid, 'configs', pid), {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  deleteProtocol: async (uid, pid) => {
    if (!uid || !pid) throw new Error("INVALID_REFERENCE");
    return deleteDoc(doc(db, 'users', uid, 'configs', pid));
  },

  reorderConfigs: async (uid, c1, c2) => {
    const b = writeBatch(db);
    b.update(doc(db, 'users', uid, 'configs', c1.id), { order: c2.order });
    b.update(doc(db, 'users', uid, 'configs', c2.id), { order: c1.order });
    return b.commit();
  },

  // --- LOGS (Daily Records) ---

  subscribeToLogs: (uid, onSuccess, onError) => {
    if (!uid) return () => {};
    const q = query(
      collection(db, 'users', uid, 'logs'),
      orderBy('logDate', 'desc'),
      limit(31) // Optimization: Fetch only the last month of activity
    );
    return onSnapshot(q, (s) => {
      onSuccess(s.docs.map(d => ({ logDate: d.id, ...d.data() })));
    }, onError);
  },

  /**
   * Atomic Counter Update
   * Uses Firestore updateDoc with dot-notation and increment() for true atomicity.
   * Handles "upsert" by falling back to setDoc if the daily log doesn't exist.
   */
  incrementCounter: async (uid, date, counterId, amount = 1) => {
    if (!uid || !date || !counterId) throw new Error("INVALID_PAYLOAD");
    const ref = doc(db, 'users', uid, 'logs', date);

    try {
      // Attempt atomic nested update using dot-notation
      await updateDoc(ref, {
        [`counts.${counterId}`]: increment(amount),
        lastSync: serverTimestamp()
      });
    } catch (e) {
      // If the document doesn't exist (first click of the day), we must initialize it
      if (e.code === 'not-found') {
        await setDoc(ref, {
          counts: { [counterId]: Math.max(0, amount) },
          logDate: date,
          lastSync: serverTimestamp()
        }, { merge: true });
      } else {
        throw e;
      }
    }
  },

  updateDailyLog: async (uid, date, counts) => {
    if (!uid || !date) throw new Error("INVALID_PAYLOAD");
    const ref = doc(db, 'users', uid, 'logs', date);
    return setDoc(ref, {
      counts,
      lastSync: serverTimestamp()
    }, { merge: true });
  }
};
