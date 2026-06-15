import { useState, useEffect, useCallback, useMemo } from 'react';
import { RegistryService } from '../services/registryService';
import { SmokingCalculator } from '../utils/smokingCalculator';

/**
 * useRegistry (The ViewModel)
 * Performance Optimized: Ensures all methods are stable references (useCallback)
 * and all derived data is memoized (useMemo).
 */
export const useRegistry = (user, today) => {
  const [counterProtocols, setCounterProtocols] = useState([]);
  const [historicalLogs, setHistoricalLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    const unsubLogs = RegistryService.subscribeToLogs(
      user.uid,
      (data) => setHistoricalLogs(data),
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubConfigs?.();
      unsubLogs?.();
    };
  }, [user]);

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
        savings: SmokingCalculator.calculateSavings(historicalLogs, counterProtocols, 0.5) ?? 0,
        lost: SmokingCalculator.calculateLifeLostMinutes(historicalLogs) ?? 0,
        todayLog
      };
    } catch (e) {
      return { count: 0, limit: 1, streak: 0, xp: 0, rank: '...', progress: 0, todayLog: { counts: {} } };
    }
  }, [historicalLogs, counterProtocols, today]);

  const increment = useCallback(async (id) => {
    if (!user) return;
    const currentCounts = metrics.todayLog?.counts ?? {};
    try {
      await RegistryService.updateDailyLog(user.uid, today, { ...currentCounts, [id]: (currentCounts[id] ?? 0) + 1 });
    } catch (err) { setError(err.message); }
  }, [user, today, metrics.todayLog]);

  const decrement = useCallback(async (id) => {
    if (!user) return;
    const currentCounts = metrics.todayLog?.counts ?? {};
    if (!currentCounts[id] || currentCounts[id] <= 0) return;
    try {
      await RegistryService.updateDailyLog(user.uid, today, { ...currentCounts, [id]: currentCounts[id] - 1 });
    } catch (err) { setError(err.message); }
  }, [user, today, metrics.todayLog]);

  const reorder = useCallback(async (id, dir) => {
    if (!user) return;
    const sorted = [...counterProtocols].sort((a,b) => a.order - b.order);
    const idx = sorted.findIndex(x => x.id === id);
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === sorted.length - 1)) return;
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    try {
      await RegistryService.reorderConfigs(user.uid, sorted[idx], sorted[swapIdx]);
    } catch (err) { setError(err.message); }
  }, [user, counterProtocols]);

  const addProtocol = useCallback((data) => {
    if (!user) return;
    return RegistryService.addProtocol(user.uid, { ...data, order: counterProtocols.length });
  }, [user, counterProtocols.length]);

  const updateProtocol = useCallback((id, data) => {
    if (!user) return;
    return RegistryService.updateProtocol(user.uid, id, data);
  }, [user]);

  const deleteProtocol = useCallback((id) => {
    if (!user) return;
    return RegistryService.deleteProtocol(user.uid, id);
  }, [user]);

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
