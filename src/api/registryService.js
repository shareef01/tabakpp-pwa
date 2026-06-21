import {
  collection, doc, setDoc, updateDoc, deleteDoc,
  query, onSnapshot, orderBy, writeBatch, limit, serverTimestamp,
  increment, runTransaction,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { SmokingCalculator } from '../utils/logic';
import { assertFirestoreUid } from './firestoreAuth';
import { buildDefaultUserProfile } from './authService';

/** Max log documents loaded for UI; metrics use server-side lifetimeAggregates beyond this. */
export const LOG_QUERY_LIMIT = 500;

const normalizeCounts = (counts) => {
  const normalized = {};
  Object.entries(counts || {}).forEach(([id, val]) => {
    const n = Math.max(0, Number(val) || 0);
    if (n > 0) normalized[id] = n;
  });
  return normalized;
};

/**
 * RegistryService (Model Layer)
 * Writes are transactional where races matter (counters, end day).
 */
export const RegistryService = {

  subscribeToConfigs: (uid, onSuccess, onError) => {
    if (!uid) return () => {};
    const q = query(collection(db, 'users', uid, 'configs'), orderBy('order', 'asc'));
    return onSnapshot(q, (s) => onSuccess(s.docs.map(d => ({ id: d.id, ...d.data() }))), onError);
  },

  addProtocol: async (uid, data) => {
    if (!uid) throw new Error('UNAUTHORIZED');
    await assertFirestoreUid(uid);
    const ref = doc(collection(db, 'users', uid, 'configs'));
    return setDoc(ref, { ...data, createdAt: serverTimestamp() });
  },

  updateProtocol: async (uid, pid, data) => {
    if (!uid || !pid) throw new Error('INVALID_REF');
    await assertFirestoreUid(uid);
    return updateDoc(doc(db, 'users', uid, 'configs', pid), { ...data, updatedAt: serverTimestamp() });
  },

  deleteProtocol: async (uid, pid) => {
    if (!uid || !pid) throw new Error('INVALID_REF');
    await assertFirestoreUid(uid);
    return deleteDoc(doc(db, 'users', uid, 'configs', pid));
  },

  reorderConfigs: async (uid, c1, c2) => {
    if (!uid || !c1 || !c2) throw new Error('INVALID_REORDER');
    await assertFirestoreUid(uid);
    const b = writeBatch(db);
    b.update(doc(db, 'users', uid, 'configs', c1.id), { order: c2.order });
    b.update(doc(db, 'users', uid, 'configs', c2.id), { order: c1.order });
    return b.commit();
  },

  subscribeToLogs: (uid, onSuccess, onError) => {
    if (!uid) return () => {};
    const q = query(
      collection(db, 'users', uid, 'logs'),
      orderBy('logDate', 'desc'),
      limit(LOG_QUERY_LIMIT)
    );
    return onSnapshot(q, (s) => {
      const logs = s.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => String(b.logDate || '').localeCompare(String(a.logDate || '')));
      onSuccess(logs, s.docs.length >= LOG_QUERY_LIMIT);
    }, onError);
  },

  updateUserProfile: async (uid, upd) => {
    if (!uid || !upd || typeof upd !== 'object') throw new Error('INVALID_PROFILE_UPDATE');
    await assertFirestoreUid(uid);
    return updateDoc(doc(db, 'users', uid), upd);
  },

  endDay: async (uid, logDate, { configs = [], unitPrice = 0.5, clientCounts = null } = {}) => {
    if (!uid || !logDate) throw new Error('INVALID_END_DAY_ARGS');
    await assertFirestoreUid(uid);

    return runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', uid);
      const userSnap = await transaction.get(userRef);
      const serverCounts = userSnap.exists() ? userSnap.data().activeCounts : {};
      let normalized = normalizeCounts(serverCounts);
      if (Object.keys(normalized).length === 0 && clientCounts) {
        normalized = normalizeCounts(clientCounts);
      }
      const timestamp = Date.now();
      const hasCounts = Object.keys(normalized).length > 0;

      if (!hasCounts) {
        throw new Error('NOTHING_TO_ARCHIVE');
      }

      const dayArchiveRef = doc(db, 'users', uid, 'logs', `${logDate}_DAY`);
      const existingSnap = await transaction.get(dayArchiveRef);
      const fin = SmokingCalculator.calculateFinancials({ counts: normalized }, configs, unitPrice);

      let mergedCounts = { ...normalized };
      if (existingSnap.exists()) {
        mergedCounts = { ...(existingSnap.data().counts || {}) };
        Object.entries(normalized).forEach(([id, val]) => {
          mergedCounts[id] = (mergedCounts[id] || 0) + val;
        });
      }

      transaction.set(dayArchiveRef, {
        counts: mergedCounts,
        logDate,
        finalizedAt: serverTimestamp(),
        clientTimestamp: timestamp,
        isArchive: true,
        origin: 'DAY_RESET',
      });

      if (userSnap.exists()) {
        const aggregates = userSnap.data().lifetimeAggregates;
        if (aggregates && typeof aggregates === 'object') {
          transaction.update(userRef, {
            activeCounts: {},
            lastDayResetAt: timestamp,
            'lifetimeAggregates.saved': increment(fin.saved),
            'lifetimeAggregates.wasted': increment(fin.wasted),
          });
        } else {
          transaction.update(userRef, {
            activeCounts: {},
            lastDayResetAt: timestamp,
            lifetimeAggregates: { saved: fin.saved, wasted: fin.wasted },
          });
        }
      } else {
        transaction.set(userRef, {
          ...buildDefaultUserProfile({ name: 'User' }),
          activeCounts: {},
          lastDayResetAt: timestamp,
          lifetimeAggregates: { saved: fin.saved, wasted: fin.wasted },
        });
      }
    });
  },

  createManualEntry: async (uid, date, counts, { configs = [], unitPrice = 0.5 } = {}) => {
    if (!uid || !date) throw new Error('INVALID_MANUAL_ENTRY');
    await assertFirestoreUid(uid);
    const normalized = normalizeCounts(counts);
    if (Object.keys(normalized).length === 0) throw new Error('EMPTY_MANUAL_ENTRY');

    return runTransaction(db, async (transaction) => {
      const entropy = Math.random().toString(36).substring(2, 7);
      const archiveRef = doc(db, 'users', uid, 'logs', `${date}_M${Date.now()}_${entropy}`);
      const userRef = doc(db, 'users', uid);
      const userSnap = await transaction.get(userRef);
      const fin = SmokingCalculator.calculateFinancials({ counts: normalized }, configs, unitPrice);

      transaction.set(archiveRef, {
        counts: normalized,
        logDate: date,
        finalizedAt: serverTimestamp(),
        isArchive: true,
        isManual: true,
        origin: 'MANUAL_ENTRY',
      });

      if (userSnap.exists()) {
        transaction.update(userRef, {
          'lifetimeAggregates.saved': increment(fin.saved),
          'lifetimeAggregates.wasted': increment(fin.wasted),
        });
      } else {
        transaction.set(userRef, {
          ...buildDefaultUserProfile({ name: 'User' }),
          lifetimeAggregates: { saved: fin.saved, wasted: fin.wasted },
        });
      }
    });
  },

  updateLiveCounter: async (uid, counterId, amount = 1) => {
    if (!uid || !counterId) return;
    await assertFirestoreUid(uid);

    const ref = doc(db, 'users', uid);
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(ref);
      const data = snap.exists() ? snap.data() : {};
      const counts = { ...(data.activeCounts || {}) };
      const current = Number(counts[counterId]) || 0;
      const next = Math.max(0, current + amount);
      if (next === current) return;

      counts[counterId] = next;

      if (snap.exists()) {
        transaction.update(ref, { activeCounts: counts });
      } else {
        transaction.set(ref, {
          ...buildDefaultUserProfile({ name: 'User' }),
          activeCounts: counts,
        });
      }
    });
  },

  updateHistoricalLog: async (uid, docId, counts, { configs = [], unitPrice = 0.5 } = {}) => {
    if (!uid || !docId) throw new Error('INVALID_LOG_UPDATE');
    await assertFirestoreUid(uid);
    const normalized = normalizeCounts(counts);

    return runTransaction(db, async (transaction) => {
      const logRef = doc(db, 'users', uid, 'logs', docId);
      const userRef = doc(db, 'users', uid);
      const logSnap = await transaction.get(logRef);
      const userSnap = await transaction.get(userRef);
      if (!logSnap.exists()) throw new Error('LOG_NOT_FOUND');

      const oldCounts = logSnap.data().counts || {};
      const oldFin = SmokingCalculator.calculateFinancials({ counts: oldCounts }, configs, unitPrice);
      const newFin = SmokingCalculator.calculateFinancials({ counts: normalized }, configs, unitPrice);
      const savedDelta = newFin.saved - oldFin.saved;
      const wastedDelta = newFin.wasted - oldFin.wasted;

      transaction.update(logRef, { counts: normalized, updatedAt: serverTimestamp() });

      if ((savedDelta !== 0 || wastedDelta !== 0) && userSnap.exists()) {
        transaction.update(userRef, {
          'lifetimeAggregates.saved': increment(savedDelta),
          'lifetimeAggregates.wasted': increment(wastedDelta),
        });
      }
    });
  },

  /** Re-create a previously deleted log (used by the History undo toast). */
  restoreLog: async (uid, log, { configs = [], unitPrice = 0.5 } = {}) => {
    if (!uid || !log?.id) throw new Error('INVALID_LOG_RESTORE');
    await assertFirestoreUid(uid);
    const { id, finalizedAt, updatedAt, counts, ...rest } = log;
    const normalized = normalizeCounts(counts);
    if (Object.keys(normalized).length === 0) throw new Error('EMPTY_LOG_RESTORE');

    return runTransaction(db, async (transaction) => {
      const logRef = doc(db, 'users', uid, 'logs', id);
      const userRef = doc(db, 'users', uid);
      const userSnap = await transaction.get(userRef);
      const fin = SmokingCalculator.calculateFinancials({ counts: normalized }, configs, unitPrice);

      transaction.set(logRef, {
        ...rest,
        counts: normalized,
        finalizedAt: serverTimestamp(),
      });

      if (userSnap.exists() && (fin.saved !== 0 || fin.wasted !== 0)) {
        transaction.update(userRef, {
          'lifetimeAggregates.saved': increment(fin.saved),
          'lifetimeAggregates.wasted': increment(fin.wasted),
        });
      }
    });
  },

  deleteLog: async (uid, docId, { configs = [], unitPrice = 0.5 } = {}) => {
    if (!uid || !docId) throw new Error('INVALID_LOG_DELETE');
    await assertFirestoreUid(uid);

    return runTransaction(db, async (transaction) => {
      const logRef = doc(db, 'users', uid, 'logs', docId);
      const userRef = doc(db, 'users', uid);
      const logSnap = await transaction.get(logRef);
      const userSnap = await transaction.get(userRef);
      if (!logSnap.exists()) throw new Error('LOG_NOT_FOUND');

      const oldCounts = logSnap.data().counts || {};
      const oldFin = SmokingCalculator.calculateFinancials({ counts: oldCounts }, configs, unitPrice);

      transaction.delete(logRef);

      if (userSnap.exists() && (oldFin.saved !== 0 || oldFin.wasted !== 0)) {
        transaction.update(userRef, {
          'lifetimeAggregates.saved': increment(-oldFin.saved),
          'lifetimeAggregates.wasted': increment(-oldFin.wasted),
        });
      }
    });
  },
};
