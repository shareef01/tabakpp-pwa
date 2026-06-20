/**

 * TABAK++ LOGIC ENGINE

 *

 * Open session (activeCounts) = current period since last End Day.

 * End Day archives to history with a tracking date + timestamp, then resets counters.

 * Tracking date uses a configurable day-start hour for night-owl schedules.

 */



const SMOKING_TYPES = ['CIGARETTE', 'RYO_ROLL', 'JOINT_KING'];

export const DEFAULT_DAY_START_HOUR = 6;

/** True when any live counter has a value > 0 */
export const hasOpenSession = (activeCounts) =>
  Object.values(activeCounts || {}).some((v) => (Number(v) || 0) > 0);



const addDays = (dateStr, delta) => {

  const d = new Date(`${dateStr}T12:00:00`);

  d.setDate(d.getDate() + delta);

  return d.toISOString().split('T')[0];

};



const formatLocalDate = (date) => {

  const y = date.getFullYear();

  const m = String(date.getMonth() + 1).padStart(2, '0');

  const d = String(date.getDate()).padStart(2, '0');

  return `${y}-${m}-${d}`;

};



/** Which tracking day a moment belongs to (local time, rolls back before dayStartHour). */

export const getTrackingDate = (when = new Date(), dayStartHour = DEFAULT_DAY_START_HOUR) => {

  const hour = Math.max(0, Math.min(23, Number(dayStartHour) || 0));

  const local = new Date(when);

  if (local.getHours() < hour) {

    local.setDate(local.getDate() - 1);

  }

  return formatLocalDate(local);

};



/** Archived day totals — End Day archive wins per date; else merge manual/other logs. */
const isDayArchiveLog = (log) =>
  log?.origin === 'DAY_RESET' ||
  (typeof log?.id === 'string' && log.id.endsWith('_DAY'));

const aggregateLoggedCounts = (logs) => {
  const byDate = {};
  const dayArchives = {};
  const otherByDate = {};

  if (!Array.isArray(logs)) return byDate;

  logs.forEach((log) => {
    const date = log?.logDate;
    if (!date) return;

    if (isDayArchiveLog(log)) {
      dayArchives[date] = { ...(log.counts || {}) };
      return;
    }

    if (!otherByDate[date]) otherByDate[date] = {};
    Object.entries(log?.counts || {}).forEach(([id, val]) => {
      otherByDate[date][id] = (otherByDate[date][id] || 0) + Math.max(0, Number(val) || 0);
    });
  });

  const allDates = new Set([...Object.keys(dayArchives), ...Object.keys(otherByDate)]);
  allDates.forEach((date) => {
    byDate[date] = dayArchives[date] ? { ...dayArchives[date] } : { ...(otherByDate[date] || {}) };
  });

  return byDate;
};

/** Daily unit totals for history chart (deduped by tracking day). */
export const aggregateDailyChartTotals = (logs = []) => {
  const logged = aggregateLoggedCounts(logs);
  return Object.entries(logged)
    .map(([date, counts]) => ({
      date,
      total: Object.values(counts).reduce((acc, val) => acc + (Math.max(0, Number(val) || 0)), 0),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};



const getUnitPrice = (config, defaultPrice) => {

  const custom = Number(config?.pricePerUnit);

  if (Number.isFinite(custom) && custom > 0) return custom;

  return Math.max(0, Number(defaultPrice) || 0.5);

};



const getStreakConfigs = (configs) => {

  const smoking = (configs || []).filter((c) => c && SMOKING_TYPES.includes(c.type));

  if (smoking.length > 0) return smoking;

  return (configs || []).filter((c) => c && c.isPrimaryTracked !== false);

};



const mergeCounts = (base, extra) => {

  const out = { ...(base || {}) };

  Object.entries(extra || {}).forEach(([id, val]) => {

    out[id] = (out[id] || 0) + Math.max(0, Number(val) || 0);

  });

  return out;

};



export const SmokingCalculator = {



  /** € spent and € headroom for one counts snapshot */

  calculateFinancials: (log, configs, defaultPrice = 0.5) => {

    if (!Array.isArray(configs) || configs.length === 0) return { wasted: 0, saved: 0 };

    const counts = log?.counts || {};



    let wasted = 0;

    let saved = 0;



    configs.forEach((c) => {

      if (!c || c.isFinanciallyTracked === false) return;



      const count = Math.max(0, Number(counts[c.id]) || 0);

      const limit = Math.max(0, Number(c.limit) || 0);

      const price = getUnitPrice(c, defaultPrice);



      wasted += count * price;

      saved += Math.max(0, limit - count) * price;

    });



    return { wasted, saved };

  },



  /**

   * Control streak: walk backward from the current tracking day.

   * Open session counts for today; archived logs for past days.

   */

  calculateStreak: (logs, configs, activeCounts, trackingDay) => {

    const streakConfigs = getStreakConfigs(Array.isArray(configs) ? configs : []);

    if (streakConfigs.length === 0 || !trackingDay) return 0;



    const logged = aggregateLoggedCounts(logs);

    const loggedDates = Object.keys(logged).sort((a, b) => b.localeCompare(a));



    const yesterday = addDays(trackingDay, -1);

    const mostRecent = loggedDates[0];

    const sessionOpen = hasOpenSession(activeCounts);



    if (loggedDates.length === 0 && !sessionOpen) return 0;

    if (mostRecent && mostRecent < yesterday && !sessionOpen) return 0;



    let streak = 0;

    let cursor = trackingDay;



    for (let i = 0; i < 366; i++) {

      const dayCounts = cursor === trackingDay

        ? mergeCounts(logged[cursor], activeCounts)

        : logged[cursor];



      if (cursor !== trackingDay && dayCounts === undefined) break;



      const withinLimits = streakConfigs.every((c) => {

        const count = Math.max(0, Number((dayCounts || {})[c.id]) || 0);

        return count <= Math.max(0, Number(c.limit) || 0);

      });



      if (!withinLimits) break;



      streak++;

      cursor = addDays(cursor, -1);

    }



    return streak;

  },



  calculateLifeLostMinutes: (logs, configs, activeCounts) => {

    const smokingIds = (Array.isArray(configs) ? configs : [])

      .filter((c) => c && SMOKING_TYPES.includes(c.type))

      .map((c) => c.id);

    if (smokingIds.length === 0) return 0;



    let total = 0;

    const logged = aggregateLoggedCounts(logs);
    Object.values(logged).forEach((dayCounts) => {
      smokingIds.forEach((id) => {
        total += Math.max(0, Number(dayCounts[id]) || 0);
      });
    });

    if (activeCounts) {

      smokingIds.forEach((id) => {

        total += Math.max(0, Number(activeCounts[id]) || 0);

      });

    }

    return total * 11;

  },



  calculateRecoveryMinutes: (logs, configs, activeCounts, trackingDay) => {

    const smokingConfigs = (Array.isArray(configs) ? configs : [])

      .filter((c) => c && SMOKING_TYPES.includes(c.type));

    if (smokingConfigs.length === 0) return 0;



    const logged = aggregateLoggedCounts(logs);

    let recovered = 0;



    Object.entries(logged).forEach(([date, counts]) => {

      if (date === trackingDay) return;

      smokingConfigs.forEach((c) => {

        const count = Math.max(0, Number(counts[c.id]) || 0);

        const limit = Math.max(0, Number(c.limit) || 0);

        recovered += Math.max(0, limit - count) * 11;

      });

    });



    smokingConfigs.forEach((c) => {

      const count = Math.max(0, Number((activeCounts || {})[c.id]) || 0);

      const limit = Math.max(0, Number(c.limit) || 0);

      recovered += Math.max(0, limit - count) * 11;

    });



    return recovered;

  },



  getGlobalMetrics: (logs, configs, activeCounts, trackingDay, userPrice = 0.5, lifetimeAggregates = null) => {

    const safeConfigs = Array.isArray(configs) ? configs : [];

    const primaryConfigs = safeConfigs.filter((c) => c && c.isPrimaryTracked !== false);

    const sessionCounts = activeCounts || {};

    const logged = aggregateLoggedCounts(logs);



    const primaryCount = primaryConfigs.reduce(

      (sum, c) => sum + Math.max(0, Number(sessionCounts[c.id]) || 0),

      0

    );

    const primaryLimit = primaryConfigs.reduce(

      (sum, c) => sum + Math.max(0, Number(c.limit) || 0),

      0

    );



    const streak = SmokingCalculator.calculateStreak(logs, safeConfigs, activeCounts, trackingDay);



    let savedLifetime = 0;

    Object.values(logged).forEach((dayCounts) => {

      savedLifetime += SmokingCalculator.calculateFinancials({ counts: dayCounts }, safeConfigs, userPrice).saved;

    });

    if (lifetimeAggregates?.saved != null && Number.isFinite(Number(lifetimeAggregates.saved))) {

      savedLifetime = Number(lifetimeAggregates.saved);

    }



    const sessionFin = SmokingCalculator.calculateFinancials({ counts: sessionCounts }, safeConfigs, userPrice);



    const lifeLost = SmokingCalculator.calculateLifeLostMinutes(logs, safeConfigs, activeCounts);

    const recovered = SmokingCalculator.calculateRecoveryMinutes(logs, safeConfigs, activeCounts, trackingDay);



    return {

      count: primaryCount,

      limit: primaryLimit,

      streak,

      spentToday: sessionFin.wasted,

      budgetLeftToday: sessionFin.saved,

      saved: sessionFin.saved,

      savedLifetime,

      progress: primaryLimit > 0 ? primaryCount / primaryLimit : 0,

      lifeLost,

      recovered,

    };

  },

};



export const sanitizeNumericInput = (val, min = 0, max = 1000000) => {

  const n = parseFloat(val);

  if (isNaN(n)) return min;

  return Math.min(Math.max(n, min), max);

};



export const sanitizeStringInput = (val, maxLen = 100) => {

  if (typeof val !== 'string') return '';

  return val.trim().slice(0, maxLen).replace(/[<>]/g, '');

};



export const formatCurrency = (val) => {

  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val || 0);

};



export const formatDateDisplay = (dateStr) => {

  if (!dateStr) return 'N/A';

  try {

    const d = new Date(`${dateStr}T12:00:00`);

    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();

  } catch (e) {

    return 'ERR_DATE';

  }

};



export const hexToRgbValues = (hex) => {

  if (!hex || hex[0] !== '#' || hex.length < 7) return '255, 95, 95';

  const r = parseInt(hex.slice(1, 3), 16);

  const g = parseInt(hex.slice(3, 5), 16);

  const b = parseInt(hex.slice(5, 7), 16);

  return `${r}, ${g}, ${b}`;

};

export const ACCENT_STORAGE_KEY = 'tabak_accent';
export const ACCENT_LAST_KEY = 'tabak_accent_last';

export const accentStorageKey = (uid) => (uid ? `${ACCENT_STORAGE_KEY}_${uid}` : ACCENT_LAST_KEY);

export const readStoredAccent = (fallback = '#FF5F5F', uid = null) => {
  try {
    const key = uid ? accentStorageKey(uid) : ACCENT_LAST_KEY;
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

export const persistAccentColor = (hex, uid = null) => {
  if (!hex) return;
  try {
    localStorage.setItem(uid ? accentStorageKey(uid) : ACCENT_LAST_KEY, hex);
  } catch {
    /* storage unavailable */
  }
};

/** Avoid pure white accent — unreadable on light borders and nav indicator */
export const normalizeAccentColor = (hex) => {
  const h = String(hex || '').trim().toUpperCase();
  if (h === '#FFFFFF' || h === '#FFF') return '#E4E4E7';
  return hex;
};

export const accentCssVars = (hex) => {
  const safe = normalizeAccentColor(hex);
  return {
    '--accent': safe,
    '--accent-rgb': hexToRgbValues(safe),
  };
};

