import { describe, it, expect } from 'vitest';
import { ROUTES, TAB, tabToPath, pathToTab, isAppRoute } from '../constants/routes';

describe('routes', () => {
  it('maps tabs to paths', () => {
    expect(tabToPath(TAB.TRACK)).toBe(ROUTES.TRACK);
    expect(tabToPath(TAB.HISTORY)).toBe(ROUTES.HISTORY);
    expect(tabToPath(TAB.SETTINGS)).toBe(ROUTES.SETTINGS);
  });

  it('maps paths to tabs', () => {
    expect(pathToTab('/track')).toBe(TAB.TRACK);
    expect(pathToTab('/history')).toBe(TAB.HISTORY);
    expect(pathToTab('/settings')).toBe(TAB.SETTINGS);
    expect(pathToTab('/')).toBe(TAB.TRACK);
  });

  it('recognizes app routes', () => {
    expect(isAppRoute('/track')).toBe(true);
    expect(isAppRoute('/unknown')).toBe(false);
  });
});
