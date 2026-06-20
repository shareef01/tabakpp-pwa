import { describe, it, expect } from 'vitest';

import { SmokingCalculator, getTrackingDate, aggregateDailyChartTotals } from './logic';



describe('getTrackingDate', () => {

  it('uses same calendar date after day-start hour', () => {

    const when = new Date(2026, 5, 21, 8, 30, 0);

    expect(getTrackingDate(when, 6)).toBe('2026-06-21');

  });



  it('rolls back before day-start hour (night owl)', () => {

    const when = new Date(2026, 5, 21, 3, 30, 0);

    expect(getTrackingDate(when, 6)).toBe('2026-06-20');

  });

});



describe('SmokingCalculator', () => {

  const mockConfigs = [

    { id: 'c1', limit: 20, pricePerUnit: 0.5, type: 'CIGARETTE', isFinanciallyTracked: true, isPrimaryTracked: true },

    { id: 'c2', limit: 5, pricePerUnit: 0, type: 'SIMPLE', isFinanciallyTracked: true, isPrimaryTracked: true },

  ];



  it('calculates spent vs headroom per session snapshot', () => {

    const { wasted, saved } = SmokingCalculator.calculateFinancials({ counts: { c1: 2, c2: 2 } }, mockConfigs, 1.0);

    expect(wasted).toBe(3);

    expect(saved).toBe(12);

  });



  it('merges manual entries on the same day for chart totals', () => {
    const logs = [
      { logDate: '2026-01-01', counts: { c1: 5 } },
      { logDate: '2026-01-01', counts: { c1: 3 } },
    ];
    expect(aggregateDailyChartTotals(logs)).toEqual([{ date: '2026-01-01', total: 8 }]);
  });

  it('merges manual entries on the same day for lifetime savings', () => {

    const logs = [

      { logDate: '2026-01-01', counts: { c1: 5 } },

      { logDate: '2026-01-01', counts: { c1: 3 } },

    ];

    const m = SmokingCalculator.getGlobalMetrics(logs, mockConfigs, {}, '2026-01-02', 0.5);

    expect(m.savedLifetime).toBe(8.5);

  });



  it('prefers End Day archive over manual entry on the same chart day', () => {

    const logs = [

      { id: '2026-01-01_DAY', logDate: '2026-01-01', origin: 'DAY_RESET', counts: { c1: 4 } },

      { id: '2026-01-01_M123_ab', logDate: '2026-01-01', isManual: true, counts: { c1: 10 } },

    ];

    expect(aggregateDailyChartTotals(logs)).toEqual([{ date: '2026-01-01', total: 4 }]);

  });



  it('uses open session only for dashboard spend and remaining', () => {

    const logs = [{ logDate: '2026-01-01', counts: { c1: 12 } }];

    const m = SmokingCalculator.getGlobalMetrics(logs, mockConfigs, { c1: 2 }, '2026-01-02', 0.5);

    expect(m.count).toBe(2);

    expect(m.spentToday).toBe(1);

    expect(m.savedLifetime).toBe(6.5);

  });



  it('counts open tracking day as in-control when session is empty', () => {

    const logs = [

      { logDate: '2026-01-02', counts: { c1: 5 } },

      { logDate: '2026-01-01', counts: { c1: 5 } },

    ];

    const streak = SmokingCalculator.calculateStreak(logs, mockConfigs, {}, '2026-01-03');

    expect(streak).toBe(3);

  });



  it('breaks streak on a gap day with no archive', () => {

    const logs = [

      { logDate: '2026-01-05', counts: { c1: 5 } },

      { logDate: '2026-01-03', counts: { c1: 5 } },

    ];

    const streak = SmokingCalculator.calculateStreak(logs, mockConfigs, {}, '2026-01-05');

    expect(streak).toBe(1);

  });



  it('breaks streak when a protocol exceeds its own limit', () => {

    const logs = [{ logDate: '2026-01-01', counts: { c1: 25 } }];

    const streak = SmokingCalculator.calculateStreak(logs, mockConfigs, {}, '2026-01-01');

    expect(streak).toBe(0);

  });



  it('returns zero streak when last archive is too old and session is empty', () => {

    const logs = [{ logDate: '2026-01-01', counts: { c1: 5 } }];

    const streak = SmokingCalculator.calculateStreak(logs, mockConfigs, {}, '2026-01-10');

    expect(streak).toBe(0);

  });

});


