/**
 * SmokingCalculator
 * Pure utility functions for health and economic calculations.
 * Filtered for financial isolation.
 */
export const SmokingCalculator = {
  getTotalCount: (log, configs) => {
    if (!log || !log.counts) return 0;
    return configs.reduce((sum, config) => sum + (log.counts[config.id] || 0), 0);
  },

  getTotalLimit: (configs) => {
    return Math.max(1, configs.reduce((sum, config) => sum + config.limit, 0));
  },

  calculateStreak: (logs, configs) => {
    if (!logs || logs.length === 0) return 0;
    const smokingConfigs = configs.filter(c => ['CIGARETTE', 'RYO_ROLL'].includes(c.type));
    if (smokingConfigs.length === 0) return 0;
    const totalLimit = smokingConfigs.reduce((sum, c) => sum + c.limit, 0);
    const sortedLogs = [...logs].sort((a, b) => b.logDate.localeCompare(a.logDate));
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(now.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];
    const lastLogDate = sortedLogs[0].logDate;
    if (lastLogDate !== today && lastLogDate !== yesterday) return 0;
    let streak = 0;
    let expectedDate = new Date(lastLogDate);
    for (const log of sortedLogs) {
      const logDateString = new Date(log.logDate).toISOString().split('T')[0];
      const expectedDateString = expectedDate.toISOString().split('T')[0];
      if (logDateString !== expectedDateString) break;
      const daySmokingTotal = smokingConfigs.reduce((sum, c) => sum + (log.counts?.[c.id] || 0), 0);
      if (daySmokingTotal <= totalLimit) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else { break; }
    }
    return streak;
  },

  /**
   * REFINED FINANCIAL CALCULATIONS (Task 3)
   * Only includes counters where isFinanciallyTracked === true.
   */
  calculateFinancials: (log, configs, globalUnitPrice) => {
    if (!log || !log.counts) return { wasted: 0, saved: 0 };

    // 1. Identify trackable configs
    const trackedConfigs = configs.filter(c => c.isFinanciallyTracked);

    // 2. Calculate Wasted
    const wasted = trackedConfigs.reduce((sum, c) => {
      const count = log.counts[c.id] || 0;
      const price = c.pricePerUnit || globalUnitPrice;
      return sum + (count * price);
    }, 0);

    // 3. Calculate Saved (based on quota vs actual for tracked items)
    const saved = trackedConfigs.reduce((sum, c) => {
      const count = log.counts[c.id] || 0;
      const limit = c.limit || 0;
      const price = c.pricePerUnit || globalUnitPrice;
      return sum + (Math.max(0, limit - count) * price);
    }, 0);

    return { wasted, saved };
  },

  calculateLifeLostMinutes: (logs, configs) => {
    const smokingIds = (configs || []).filter(c => ['CIGARETTE', 'RYO_ROLL'].includes(c.type)).map(c => c.id);
    return logs.reduce((sum, log) => {
      const dailySmoking = Object.entries(log.counts || {})
        .filter(([id]) => smokingIds.includes(id))
        .reduce((s, [_, count]) => s + count, 0);
      return sum + (dailySmoking * 11);
    }, 0);
  },

  getRank: (xp) => {
    if (xp < 100) return "Apprentice";
    if (xp < 500) return "Scout";
    if (xp < 1500) return "Veteran";
    if (xp < 5000) return "Master";
    return "Legend";
  },

  calculateXP: (logs, streak) => {
    const totalDays = logs.length;
    const totalLogs = logs.reduce((sum, log) => sum + Object.values(log.counts || {}).reduce((a, b) => a + b, 0), 0);
    return (totalDays * 10) + (streak * 15) + (totalLogs * 2);
  }
};
