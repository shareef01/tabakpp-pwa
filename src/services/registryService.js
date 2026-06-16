import {
  collection, doc, setDoc, updateDoc, deleteDoc,
  query, onSnapshot, orderBy, writeBatch, limit, serverTimestamp
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

  updateDailyLog: async (uid, date, counts) => {
    if (!uid || !date) throw new Error("INVALID_PAYLOAD");
    const ref = doc(db, 'users', uid, 'logs', date);
    // Use setDoc with merge to ensure the document exists
    return setDoc(ref, {
      counts,
      lastSync: serverTimestamp()
    }, { merge: true });
  }
};
