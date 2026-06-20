/**
 * Layout tokens + fluid widget scale (SMALL / MEDIUM / LARGE).
 * CSS variables are applied on the app shell via getWidgetScaleVars().
 */
export const WIDGET_SCALE_VARS = {
  SMALL: {
    '--tracker-min': '14.5rem',
    '--tracker-max': '22rem',
    '--gauge-w': 'clamp(9rem, 38vw, 10.75rem)',
    '--gauge-h': 'clamp(1.625rem, 4.2vw, 1.875rem)',
    '--ring-size': 'clamp(4.75rem, 20vw, 5.5rem)',
    '--counter-fs': 'clamp(2.5rem, 11vw, 3.25rem)',
    '--tracker-btn-h': '2.75rem',
    '--tracker-pad-x': 'clamp(1rem, 3.5vw, 1.25rem)',
    '--tracker-pad-y': 'clamp(1rem, 3vw, 1.25rem)',
    '--tracker-gap': 'clamp(0.875rem, 2.5vw, 1.25rem)',
    '--tracker-label-fs': '0.5rem',
  },
  MEDIUM: {
    '--tracker-min': '17rem',
    '--tracker-max': '28rem',
    '--gauge-w': 'clamp(10.5rem, 42vw, 13.5rem)',
    '--gauge-h': 'clamp(1.875rem, 4.8vw, 2.375rem)',
    '--ring-size': 'clamp(5.5rem, 22vw, 7rem)',
    '--counter-fs': 'clamp(3rem, 13vw, 4.5rem)',
    '--tracker-btn-h': '3rem',
    '--tracker-pad-x': 'clamp(1.125rem, 3.5vw, 1.5rem)',
    '--tracker-pad-y': 'clamp(1.125rem, 3vw, 1.5rem)',
    '--tracker-gap': 'clamp(1rem, 2.8vw, 1.5rem)',
    '--tracker-label-fs': '0.5625rem',
  },
  LARGE: {
    '--tracker-min': '19rem',
    '--tracker-max': '34rem',
    '--gauge-w': 'clamp(12rem, 48vw, 17.5rem)',
    '--gauge-h': 'clamp(2.125rem, 5.5vw, 3rem)',
    '--ring-size': 'clamp(6.25rem, 26vw, 8rem)',
    '--counter-fs': 'clamp(3.375rem, 14vw, 5.5rem)',
    '--tracker-btn-h': '3.25rem',
    '--tracker-pad-x': 'clamp(1.25rem, 4vw, 1.75rem)',
    '--tracker-pad-y': 'clamp(1.25rem, 3.5vw, 1.75rem)',
    '--tracker-gap': 'clamp(1.125rem, 3vw, 2rem)',
    '--tracker-label-fs': '0.625rem',
  },
};

export const getWidgetScaleVars = (size = 'MEDIUM') =>
  WIDGET_SCALE_VARS[size] || WIDGET_SCALE_VARS.MEDIUM;

export const UI = {
  CANVAS: 'app-shell h-[100dvh] w-full flex flex-col bg-[#09090B] text-[#FAFAFA] selection:bg-accent/30 overflow-hidden relative [--nav-dock-height:3.25rem]',


  HEADER_WRAPPER: 'w-full border-b border-white/[0.03] bg-[#09090B]/80 backdrop-blur-2xl shrink-0 z-[200] sticky top-0 pt-[env(safe-area-inset-top)]',
  HEADER_INNER: 'max-w-7xl mx-auto flex items-center justify-between h-14 xs:h-16 md:h-[4.5rem] px-4 sm:px-6 md:px-8',

  MAX_CONTAINER: 'max-w-[1400px] mx-auto w-full pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:pl-6 sm:pr-6 md:pl-8 md:pr-8 xl:pl-10 xl:pr-10 pt-3 sm:pt-5 md:pt-6 lg:pt-8 pb-[calc(var(--nav-dock-height)+env(safe-area-inset-bottom)+1rem)]',

  /** Auto-fit grid — column count follows screen width + widget size vars */
  TRACKER_GRID: 'tracker-grid w-full max-w-[1400px] mx-auto justify-items-center items-start',

  TRACK_DASHBOARD: 'track-dashboard w-full flex flex-col items-center',

  CARD: 'bg-[#121214]/60 backdrop-blur-3xl border border-white/[0.08] rounded-[24px] xs:rounded-[28px] sm:rounded-[32px] md:rounded-[36px] xl:rounded-[40px] flex flex-col items-stretch transition-all duration-500',

  TRACKER_CARD: 'tracker-card bg-[#121214]/75 backdrop-blur-3xl border border-white/[0.09] shadow-[0_12px_40px_rgba(0,0,0,0.45)] rounded-[22px] xs:rounded-[26px] sm:rounded-[30px] md:rounded-[34px] xl:rounded-[38px]',

  PRIMARY_DATA: 'text-[#FAFAFA] drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]',

  LABEL: 'text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-zinc-400 leading-none',

  INTERACTIVE_SCALE: 'active:scale-[0.94] transition-all duration-200 ease-out',

  INPUT: 'h-12 px-5 rounded-2xl border bg-black/40 border-white/[0.08] text-[#FAFAFA] focus:border-accent/60 focus:ring-1 focus:ring-accent/30 outline-none font-bold text-sm transition-all',

  BUTTON_BASE: 'min-h-[50px] px-8 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center transition-all active:scale-95 disabled:opacity-30',

  MODAL_OVERLAY: 'fixed inset-0 z-[5000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 isolate pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]',

  /** Shared modal panel — radius/padding aligned across overlays */
  MODAL_SHELL: 'bg-[#121214]/95 border border-white/[0.1] rounded-[32px] w-full shadow-2xl overflow-hidden mx-auto',

  SURFACE: 'bg-[#121214]/80 backdrop-blur-2xl border border-white/[0.09]',

  NAV_BAR_DOCK: 'nav-dock fixed bottom-0 inset-x-0 z-[500] pointer-events-none flex justify-center px-4 pb-[max(0.625rem,env(safe-area-inset-bottom))]',
  NAV_BAR_INNER: 'nav-dock-bar pointer-events-auto relative flex items-center w-full max-w-[11.5rem] p-1 rounded-full border border-white/[0.09] bg-[#141416]/92 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]',


  GIANT_NUM: 'font-[900] tracking-tighter tabular-nums leading-none [font-size:clamp(3rem,16vw,9rem)]',
};
