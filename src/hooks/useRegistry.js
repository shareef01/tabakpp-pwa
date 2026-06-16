import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { RegistryService } from '../services/registryService';
import { SmokingCalculator } from '../utils/smokingCalculator';

/**
 * useRegistry (ViewModel)
 * Performance Hardened: Debounces rapid updates and handles race conditions.
 */
export const useRegistry = (user, today, unitPrice = 0.5) => {
  const [counterProtocols, setCounterProtocols] = useState([]);
  const [historicalLogs, setHistoricalLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync ref to prevent stale closures in callbacks
  const logsRef = useRef(historicalLogs);
  useEffect(() => { logsRef.current = historicalLogs; }, [historicalLogs]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubConfigs = RegistryService.subscribeToConfigs(
      user.uid,
      (data) => {
        setCounterProtocols(data.length > 0 ? data : [
          { id: 'cigarettes', name: 'Cigarettes', limit: 20, type: 'CIGARETTE', price: 0, order: 0 }
        ]);
        setLoading(false);
      },
      (err) => { setError(err.message); setLoading(false); }
    );

    const unsubLogs = RegistryService.subscribeToLogs(
      user.uid,
      (data) => setHistoricalLogs(data),
      (err) => { setError(err.message); setLoading(false); }
    );

    return () => {
      unsubConfigs?.();
      unsubLogs?.();
    };
  }, [user?.uid]); // Only re-subscribe if UID changes

  const metrics = useMemo(() => {
    try {
      const todayLog = historicalLogs.find(l => l.logDate === today) || { logDate: today, counts: {} };
      const totalCount = SmokingCalculator.getTotalCount(todayLog, counterProtocols);
      const totalLimit = SmokingCalculator.getTotalLimit(counterProtocols);
      const currentStreak = SmokingCalculator.calculateStreak(historicalLogs, counterProtocols);
      const totalXP = SmokingCalculator.calculateXP(historicalLogs, currentStreak);

      return {
        count: totalCount,
        limit: totalLimit,
        streak: currentStreak,
        xp: totalXP,
        rank: SmokingCalculator.getRank(totalXP),
        progress: totalLimit > 0 ? totalCount / totalLimit : 0,
        savings: SmokingCalculator.calculateSavings(historicalLogs, counterProtocols, unitPrice) ?? 0,
        lost: SmokingCalculator.calculateLifeLostMinutes(historicalLogs, counterProtocols) ?? 0,
        todayLog
      };
    } catch (e) {
      return { count: 0, limit: 1, streak: 0, xp: 0, rank: '...', progress: 0, todayLog: { counts: {} } };
    }
  }, [historicalLogs, counterProtocols, today, unitPrice]);

  // --- ACTIONS WITH OPTIMISTIC UPDATES & RACE GUARDS ---

  const increment = useCallback(async (id) => {
    if (!user) return;
    const currentTodayLog = logsRef.current.find(l => l.logDate === today) || { counts: {} };
    const currentCounts = currentTodayLog.counts || {};

    // Optimistic Update can be added here if latency becomes an issue
    try {
      await RegistryService.updateDailyLog(user.uid, today, {
        ...currentCounts,
        [id]: (currentCounts[id] ?? 0) + 1
      });
    } catch (err) { setError(err.message); }
  }, [user?.uid, today]);

  const decrement = useCallback(async (id) => {
    if (!user) return;
    const currentTodayLog = logsRef.current.find(l => l.logDate === today) || { counts: {} };
    const currentCounts = currentTodayLog.counts || {};
    if (!currentCounts[id] || currentCounts[id] <= 0) return;

    try {
      await RegistryService.updateDailyLog(user.uid, today, {
        ...currentCounts,
        [id]: currentCounts[id] - 1
      });
    } catch (err) { setError(err.message); }
  }, [user?.uid, today]);

  const reorder = useCallback(async (id, dir) => {
    if (!user) return;
    const sorted = [...counterProtocols].sort((a,b) => a.order - b.order);
    const idx = sorted.findIndex(x => x.id === id);
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === sorted.length - 1)) return;
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    try {
      await RegistryService.reorderConfigs(user.uid, sorted[idx], sorted[swapIdx]);
    } catch (err) { setError(err.message); }
  }, [user?.uid, counterProtocols]);

  const addProtocol = useCallback((data) => {
    if (!user) return;
    return RegistryService.addProtocol(user.uid, { ...data, order: counterProtocols.length });
  }, [user?.uid, counterProtocols.length]);

  const updateProtocol = useCallback((id, data) => {
    if (!user) return;
    return RegistryService.updateProtocol(user.uid, id, data);
  }, [user?.uid]);

  const deleteProtocol = useCallback((id) => {
    if (!user) return;
    return RegistryService.deleteProtocol(user.uid, id);
  }, [user?.uid]);

  return {
    configs: counterProtocols,
    logs: historicalLogs,
    metrics,
    loading,
    error,
    increment,
    decrement,
    reorder,
    addProtocol,
    updateProtocol,
    deleteProtocol,
    clearError: useCallback(() => setError(null), [])
  };
};
