/** App route paths (BrowserRouter) */
export const ROUTES = {
  TRACK: '/track',
  HISTORY: '/history',
  SETTINGS: '/settings',
};

/** Internal tab ids used by Header dropdown */
export const TAB = {
  TRACK: 'track',
  HISTORY: 'history',
  SETTINGS: 'control',
};

const TAB_TO_PATH = {
  [TAB.TRACK]: ROUTES.TRACK,
  [TAB.HISTORY]: ROUTES.HISTORY,
  [TAB.SETTINGS]: ROUTES.SETTINGS,
};

const PATH_TO_TAB = {
  [ROUTES.TRACK]: TAB.TRACK,
  [ROUTES.HISTORY]: TAB.HISTORY,
  [ROUTES.SETTINGS]: TAB.SETTINGS,
};

export const tabToPath = (tab) => TAB_TO_PATH[tab] || ROUTES.TRACK;

export const pathToTab = (pathname) => {
  const base = (pathname || '').split('?')[0].replace(/\/$/, '') || '/';
  if (base === '/' || base === '') return TAB.TRACK;
  return PATH_TO_TAB[base] || TAB.TRACK;
};

export const isAppRoute = (pathname) => {
  const base = (pathname || '').split('?')[0].replace(/\/$/, '') || '/';
  return base === '/' || Object.values(ROUTES).includes(base);
};
