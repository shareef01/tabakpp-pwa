import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { RegistryService } from '../api/registryService';
import { SmokingCalculator, getTrackingDate, DEFAULT_DAY_START_HOUR } from '../utils/logic';
import { assertFirestoreUid } from '../api/firestoreAuth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

const INITIAL_STATE = {
  configs: [],
  logs: [],
  metrics: { count: 0, limit: 0, streak: 0, spentToday: 0, budgetLeftToday: 0, saved: 0, savedLifetime: 0, progress: 0, lifeLost: 0, recovered: 0 },
  userProfile: {},
  activeCounts: {},
  loading: true,
  error: null,
};

export const useRegistry = (user, trackingDay, dayStartHourOverride) => {
  const [configs, setConfigs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeCounts, setActiveCounts] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [userReady, setUserReady] = useState(false);
  const [configsReady, setConfigsReady] = useState(false);
  const [error, setError] = useState(null);
  const [endingDay, setEndingDay] = useState(false);
  const [logsTruncated, setLogsTruncated] = useState(false);
  const counterMutationsRef = useRef(0);

  const dayStartHour = dayStartHourOverride ?? userProfile?.dayStartHour ?? DEFAULT_DAY_START_HOUR;

  useEffect(() => {
    if (!user) {
      counterMutationsRef.current = 0;
      setLoading(false);
      setUserReady(false);
      setConfigsReady(false);
      setConfigs([]);
      setLogs([]);
      setActiveCounts({});
      setUserProfile({});
      setLogsTruncated(false);
      setError(null);
      return;
    }

    setLoading(true);
    setUserReady(false);
    setConfigsReady(false);
    setError(null);

    let cancelled = false;
    let unsubs = [];

    const bindListeners = (uid) => {
      const unsubUser = onSnapshot(doc(db, 'users', uid), (s) => {
        if (s.exists()) {
          const data = s.data();
          if (counterMutationsRef.current === 0) {
            setActiveCounts({ ...(data.activeCounts || {}) });
          }
          const { activeCounts: _ac, ...profileFields } = data;
          setUserProfile(profileFields);
        } else {
          if (counterMutationsRef.current === 0) setActiveCounts({});
          setUserProfile({});
        }
        setUserReady(true);
      }, (err) => {
        setError(err.message);
        setUserReady(true);
      });

      const unsubConfigs = RegistryService.subscribeToConfigs(uid, (data) => {
        setConfigs(data || []);
        setConfigsReady(true);
      }, (err) => {
        setError(err.message);
        setConfigsReady(true);
      });

      const unsubLogs = RegistryService.subscribeToLogs(uid, (data, truncated) => {
        setLogs(data || []);
        setLogsTruncated(Boolean(truncated));
      }, (err) => setError(err.message));

      return [unsubUser, unsubConfigs, unsubLogs];
    };

    (async () => {
      try {
        const authed = await assertFirestoreUid(user.uid);
        if (cancelled || authed.uid !== user.uid) return;
        unsubs = bindListeners(authed.uid);
      } catch (e) {
        if (!cancelled) {
          setError(e.message);
          setUserReady(true);
          setConfigsReady(true);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      unsubs.forEach((unsub) => unsub());
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!user) return;
    if (userReady && configsReady) setLoading(false);
  }, [user, userReady, configsReady]);

  const metrics = useMemo(() => {
    try {
      const price = userProfile?.unitPrice ?? 0.5;
      return SmokingCalculator.getGlobalMetrics(
        logs,
        configs,
        activeCounts,
        trackingDay,
        price,
        userProfile?.lifetimeAggregates
      );
    } catch {
      return INITIAL_STATE.metrics;
    }
  }, [logs, configs, trackingDay, activeCounts, userProfile?.unitPrice, userProfile?.lifetimeAggregates]);

  const increment = useCallback(async (id) => {
    if (!user) return;
    counterMutationsRef.current += 1;
    setActiveCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    try {
      await RegistryService.updateLiveCounter(user.uid, id, 1);
    } catch (err) {
      setActiveCounts((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }));
      setError(err.message);
    } finally {
      counterMutationsRef.current -= 1;
    }
  }, [user?.uid]);

  const decrement = useCallback(async (id) => {
    if (!user) return;
    setActiveCounts((prev) => {
      if ((prev[id] || 0) <= 0) return prev;
      return { ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) };
    });
    counterMutationsRef.current += 1;
    try {
      await RegistryService.updateLiveCounter(user.uid, id, -1);
    } catch (err) {
      setActiveCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      setError(err.message);
    } finally {
      counterMutationsRef.current -= 1;
    }
  }, [user?.uid]);

  const endDay = useCallback(async () => {
    if (!user || endingDay) return;
    setEndingDay(true);
    const logDate = getTrackingDate(new Date(), dayStartHour);
    try {
      await RegistryService.endDay(user.uid, logDate, {
        configs,
        unitPrice: userProfile?.unitPrice ?? 0.5,
        clientCounts: activeCounts,
      });
      setActiveCounts({});
    } catch (err) {
      const msg = err?.message === 'NOTHING_TO_ARCHIVE'
        ? 'No counts to archive — tap + on a tracker first.'
        : (err.message || 'End day failed');
      setError(msg);
    } finally {
      setEndingDay(false);
    }
  }, [user, endingDay, dayStartHour, configs, userProfile?.unitPrice, activeCounts]);

  const createManualEntry = useCallback(async (date, counts) => {
    if (!user) return;
    try {
      await RegistryService.createManualEntry(user.uid, date, counts, {
        configs,
        unitPrice: userProfile?.unitPrice ?? 0.5,
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user?.uid, configs, userProfile?.unitPrice]);

  const deleteLog = useCallback(async (docId) => {
    if (!user) return;
    try {
      await RegistryService.deleteLog(user.uid, docId, {
        configs,
        unitPrice: userProfile?.unitPrice ?? 0.5,
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user?.uid, configs, userProfile?.unitPrice]);

  const addProtocol = useCallback(async (d) => {
    if (!user) throw new Error('UNAUTHORIZED');
    try {
      await RegistryService.addProtocol(user.uid, { ...d, order: configs.length });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user?.uid, configs.length]);

  const updateProtocol = useCallback(async (id, d) => {
    if (!user) throw new Error('UNAUTHORIZED');
    try {
      await RegistryService.updateProtocol(user.uid, id, d);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user?.uid]);

  const deleteProtocol = useCallback(async (id) => {
    if (!user) throw new Error('UNAUTHORIZED');
    try {
      await RegistryService.deleteProtocol(user.uid, id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user?.uid]);

  const reorder = useCallback(async (id, dir) => {
    if (!user) return;
    const sorted = [...configs].sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = sorted.findIndex(x => x.id === id);
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === sorted.length - 1)) return;
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    try {
      await RegistryService.reorderConfigs(user.uid, sorted[idx], sorted[swapIdx]);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user?.uid, configs]);

  return {
    configs: configs || [],
    logs: logs || [],
    metrics: metrics || INITIAL_STATE.metrics,
    userProfile: userProfile || {},
    activeCounts: activeCounts || {},
    dayStartHour,
    loading,
    endingDay,
    logsTruncated,
    error,
    increment,
    decrement,
    endDay,
    createManualEntry,
    deleteLog,
    addProtocol,
    updateProtocol,
    deleteProtocol,
    reorder,
    clearError: useCallback(() => setError(null), []),
  };
};
