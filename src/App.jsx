import React, { useState, useMemo, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, PlusCircle } from 'lucide-react';
import { updateProfile, signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import { RegistryService } from './api/registryService';

import './styles/fidelity.css';
import { getTrackingDate, DEFAULT_DAY_START_HOUR, formatDateDisplay, readStoredAccent, persistAccentColor, accentCssVars, normalizeAccentColor } from './utils/logic';
import { UI, getWidgetScaleVars } from './constants/ui';
import { ROUTES, pathToTab, tabToPath } from './constants/routes';
import { BRAND_ACCENT } from './api/authService';

import { AuthProvider, useAuth } from './context/AuthContext';
import { useRegistry } from './hooks/useRegistry';

import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { LogoutModal } from './features/shared/LogoutModal';
import { ConfirmModal } from './features/shared/ConfirmModal';
import { Toast } from './features/shared/Toast';
import { DashboardSkeleton } from './features/dashboard/components/DashboardSkeleton';
import { ProtocolForm } from './features/shared/ProtocolForm';
import { EditLogOverlay } from './features/history/components/EditLogOverlay';

const lazyWithRetry = (componentImport) => lazy(async () => {
  try { return await componentImport(); }
  catch { window.location.reload(); return { default: () => null }; }
});

const AuthScreen = lazyWithRetry(() => import('./features/auth/AuthScreen').then(m => ({ default: m.AuthScreen })));
const TrackerCard = lazyWithRetry(() => import('./features/dashboard/components/TrackerCard').then(m => ({ default: m.TrackerCard })));
const MetricBanner = lazyWithRetry(() => import('./features/dashboard/components/MetricBanner').then(m => ({ default: m.MetricBanner })));
const HistoryScreen = lazyWithRetry(() => import('./features/history/HistoryScreen').then(m => ({ default: m.HistoryScreen })));
const SettingsScreen = lazyWithRetry(() => import('./features/settings/SettingsScreen').then(m => ({ default: m.SettingsScreen })));

const LoadingView = () => (
  <div className="h-[100dvh] w-full bg-[#09090B] flex flex-col items-center justify-center text-[#FAFAFA] font-inter overflow-hidden relative" aria-busy="true" aria-label="Loading">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6 relative z-10">
      <div className="w-32 h-[1.5px] bg-white/[0.04] relative overflow-hidden rounded-full">
        <motion.div initial={{ left: '-100%' }} animate={{ left: '100%' }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-0 w-1/2 h-full bg-accent" />
      </div>
      <span className="text-[9px] font-black tracking-[0.6em] uppercase text-zinc-500 animate-pulse">Loading…</span>
    </motion.div>
  </div>
);

const TabSkeleton = () => (
  <div className="w-full space-y-6 animate-pulse" aria-hidden="true">
    <div className="h-48 rounded-[32px] bg-white/[0.02] border border-white/[0.04]" />
    <div className="h-32 rounded-[32px] bg-white/[0.02] border border-white/[0.04]" />
  </div>
);

const EmptyDashboard = React.memo(({ onAdd }) => (
  <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-20 text-center space-y-6 px-8 max-w-md mx-auto">
    <div className="w-24 h-24 rounded-[36px] bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/10"><PlusCircle size={48} strokeWidth={1} /></div>
    <div className="space-y-2">
      <h2 className="text-lg font-bold text-white">Add your first tracker</h2>
      <p className="text-sm text-zinc-500 leading-relaxed">Create a tracker for each product you want to log — cigarettes, RYO, pouches, and more.</p>
    </div>
    <button type="button" onClick={onAdd} className="h-14 px-12 rounded-[24px] bg-accent text-zinc-950 font-black uppercase tracking-[0.2em] text-[11px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50">Add tracker</button>
  </div>
));

class FeatureErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, resetKey: 0 }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error(`FEATURE_ERROR [${this.props.name}]:`, error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-danger/5 border border-danger/10 rounded-[40px] m-4">
          <AlertCircle size={32} className="text-danger mb-4" aria-hidden="true" />
          <p className="text-sm text-zinc-400 mb-6 max-w-xs">Something went wrong loading this section. Try reloading it.</p>
          <button type="button" onClick={() => this.setState((s) => ({ hasError: false, resetKey: s.resetKey + 1 }))} className="px-8 h-12 rounded-2xl bg-white text-black font-black uppercase text-[9px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50">Reload</button>
        </div>
      );
    }
    return <div key={this.state.resetKey}>{this.props.children}</div>;
  }
}

class GlobalErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-[100dvh] w-full bg-[#09090B] flex flex-col items-center justify-center gap-6 px-8 text-center">
          <p className="text-sm text-zinc-400 max-w-xs">The app hit an unexpected error. You can reset and return to Track.</p>
          <button type="button" onClick={() => { this.setState({ hasError: false }); window.location.href = '/track'; }} className="px-10 h-14 rounded-full bg-white text-black font-black uppercase text-[10px]">Reset app</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent = () => {
  const { user, loading: authLoading, bootstrapError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = pathToTab(location.pathname);

  const [previewDayStartHour, setPreviewDayStartHour] = useState(null);
  const [trackingDay, setTrackingDay] = useState(() => getTrackingDate(new Date(), DEFAULT_DAY_START_HOUR));
  const [settingsError, setSettingsError] = useState(null);
  const shellReadyRef = useRef(false);

  const registry = useRegistry(user, trackingDay, previewDayStartHour);
  const {
    configs = [], logs = [], metrics = {}, userProfile = {}, activeCounts = {}, loading = false, error = null,
    dayStartHour = DEFAULT_DAY_START_HOUR,
    endingDay = false, logsTruncated = false,
    increment, decrement, reorder, addProtocol, updateProtocol, deleteProtocol, endDay, createManualEntry, deleteLog, clearError,
  } = registry || {};

  const effectiveDayStartHour = previewDayStartHour ?? dayStartHour;

  useEffect(() => {
    if (!loading && user) shellReadyRef.current = true;
  }, [loading, user]);

  useEffect(() => {
    const refresh = () => setTrackingDay(getTrackingDate(new Date(), effectiveDayStartHour));
    refresh();

    const tick = setInterval(refresh, 30_000);

    const now = new Date();
    const nextBoundary = new Date(now);
    nextBoundary.setSeconds(0, 0);
    nextBoundary.setMinutes(0);
    nextBoundary.setHours(effectiveDayStartHour);
    while (nextBoundary.getTime() <= now.getTime()) {
      nextBoundary.setDate(nextBoundary.getDate() + 1);
    }
    const boundaryTimer = setTimeout(refresh, nextBoundary.getTime() - now.getTime() + 100);

    return () => {
      clearInterval(tick);
      clearTimeout(boundaryTimer);
    };
  }, [effectiveDayStartHour]);

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editProtocol, setEditProtocol] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [showEndDayConfirm, setShowEndDayConfirm] = useState(false);
  const [toast, setToast] = useState(null);
  const [offline, setOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine);
  const [themeAccent, setThemeAccent] = useState(() => readStoredAccent(BRAND_ACCENT));

  useEffect(() => {
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const showToast = useCallback((message, options = {}) => {
    setToast(typeof message === 'string' ? { message, ...options } : message);
  }, []);

  const navigateTab = useCallback((tab) => navigate(tabToPath(tab)), [navigate]);

  const handleIncrement = useCallback((config) => {
    increment(config.id);
    showToast({ message: `+1 ${config.name}`, onUndo: () => decrement(config.id) });
  }, [increment, decrement, showToast]);

  useEffect(() => {
    if (userProfile?.accent && user?.uid) {
      persistAccentColor(userProfile.accent, user.uid);
      setThemeAccent(userProfile.accent);
    }
  }, [userProfile?.accent, user?.uid]);

  useEffect(() => {
    if (!user && !authLoading) {
      setThemeAccent(readStoredAccent(BRAND_ACCENT));
    }
  }, [user, authLoading]);

  const profileLoaded = Boolean(user && !loading);

  const resolvedAccent = user
    ? (userProfile?.accent || (profileLoaded ? readStoredAccent(BRAND_ACCENT, user.uid) : BRAND_ACCENT))
    : themeAccent;

  const accentStyle = useMemo(() => accentCssVars(resolvedAccent), [resolvedAccent]);

  useEffect(() => {
    Object.entries(accentStyle).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [accentStyle]);

  const currentSettings = useMemo(() => ({
    accent: resolvedAccent,
    widgetSize: userProfile?.widgetSize || 'MEDIUM',
    avatar: userProfile?.avatar || user?.photoURL || null,
    name: userProfile?.name || user?.displayName || '',
    unitPrice: userProfile?.unitPrice ?? 0.5,
    pouchPrice: userProfile?.pouchPrice ?? 0,
    estimatedYield: userProfile?.estimatedYield ?? 20,
    dayStartHour: userProfile?.dayStartHour ?? DEFAULT_DAY_START_HOUR,
    purchaseType: userProfile?.purchaseType || 'PACK',
  }), [resolvedAccent, userProfile, user]);

  const onUpdSettings = useCallback(async (upd) => {
    if (!user || !auth.currentUser) return;
    try {
      const authUpd = {};
      if (upd.name !== undefined) authUpd.displayName = upd.name;
      // Auth photoURL is too short for base64; Firestore holds the avatar.
      if (upd.avatar !== undefined && !String(upd.avatar).startsWith('data:')) {
        authUpd.photoURL = upd.avatar;
      }
      if (Object.keys(authUpd).length) {
        await updateProfile(auth.currentUser, authUpd);
      }
      if (upd.accent && user.uid) {
        const safeAccent = normalizeAccentColor(upd.accent);
        persistAccentColor(safeAccent, user.uid);
        setThemeAccent(safeAccent);
        upd.accent = safeAccent;
      }
      await RegistryService.updateUserProfile(user.uid, upd);
      setSettingsError(null);
      showToast('Settings saved');
    } catch (e) {
      const msg = e?.message || 'Settings update failed';
      setSettingsError(msg);
      showToast({ message: msg, variant: 'error' });
      throw e;
    }
  }, [user, showToast]);

  const handleEndDay = useCallback(async () => {
    try {
      await endDay();
      setShowEndDayConfirm(false);
      showToast('Day archived — counters reset');
    } catch (e) {
      const msg = e?.message || 'Failed to end day';
      setSettingsError(msg);
      showToast({ message: msg, variant: 'error' });
      setShowEndDayConfirm(false);
    }
  }, [endDay, showToast]);

  const handleLogout = useCallback(() => {
    if (user?.uid) persistAccentColor(resolvedAccent, user.uid);
    persistAccentColor(resolvedAccent);
    setThemeAccent(resolvedAccent);
    setPreviewDayStartHour(null);
    setShowLogout(false);
    signOut(auth);
  }, [resolvedAccent, user?.uid]);

  const displayError = error || settingsError;
  const dismissError = useCallback(() => { clearError(); setSettingsError(null); }, [clearError]);

  if (authLoading) {
    return (
      <div className={UI.CANVAS} style={accentStyle}>
        <LoadingView />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`${UI.CANVAS} overflow-y-auto`} style={accentStyle}>
        {bootstrapError && (
          <div className="shrink-0 mx-auto w-full max-w-[420px] px-4 pt-3">
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {bootstrapError}
            </div>
          </div>
        )}
        <Suspense fallback={<LoadingView />}><AuthScreen /></Suspense>
      </div>
    );
  }

  const tabFallback = shellReadyRef.current ? <TabSkeleton /> : <LoadingView />;

  const trackView = (
    <motion.div key="track" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col items-center">
      <FeatureErrorBoundary name="Track">
        <div className={UI.TRACK_DASHBOARD}>
          {loading ? <DashboardSkeleton widgetSize={currentSettings.widgetSize} /> : (
            configs.length === 0 ? <EmptyDashboard onAdd={() => setShowAdd(true)} /> : (
              <div className={UI.TRACKER_GRID}>
                {[...configs].sort((a, b) => (a.order || 0) - (b.order || 0)).map((c, i) => (
                  <TrackerCard key={c.id} index={i} config={c} count={activeCounts[c.id] || 0} onInc={() => handleIncrement(c)} onDec={() => decrement(c.id)} globalSize={currentSettings.widgetSize} />
                ))}
              </div>
            )
          )}
          {configs.length > 0 && <MetricBanner m={metrics} />}
        </div>
      </FeatureErrorBoundary>
    </motion.div>
  );

  const historyView = (
    <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
      <FeatureErrorBoundary name="History">
        <HistoryScreen loading={loading} logs={logs} configs={configs} m={metrics} onEdit={setEditTarget} onDeleteLog={deleteLog} today={trackingDay} onManualEntry={createManualEntry} onError={setSettingsError} onAddProtocol={() => setShowAdd(true)} />
      </FeatureErrorBoundary>
    </motion.div>
  );

  const settingsView = (
    <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
      <FeatureErrorBoundary name="Settings">
        <SettingsScreen
          configs={configs}
          user={{ ...user, displayName: currentSettings.name, photoURL: currentSettings.avatar }}
          settings={currentSettings}
          activeCounts={activeCounts}
          onAdd={() => setShowAdd(true)}
          onReo={reorder}
          onEditP={setEditProtocol}
          onUpd={onUpdSettings}
          onDel={deleteProtocol}
          onError={setSettingsError}
          onPreviewDayStart={setPreviewDayStartHour}
        />
      </FeatureErrorBoundary>
    </motion.div>
  );

  return (
    <div
      className={UI.CANVAS}
      data-widget-size={currentSettings.widgetSize}
      style={{
        ...accentStyle,
        ...getWidgetScaleVars(currentSettings.widgetSize),
      }}
    >
      {logsTruncated && (
        <div className="shrink-0 mx-auto w-full max-w-[1400px] px-4 pt-2">
          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-amber-200/90">
            History shows the latest 500 entries. Lifetime savings use server totals.
          </div>
        </div>
      )}
      {displayError && (
        <div className="shrink-0 mx-auto w-full max-w-[1400px] px-4 pt-2">
          <div className="flex items-start justify-between gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            <span className="selectable leading-snug">{displayError}</span>
            <button type="button" onClick={dismissError} aria-label="Dismiss error" className="shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center text-rose-400 hover:text-white text-xs font-semibold">Dismiss</button>
          </div>
        </div>
      )}
      {offline && (
        <div className="shrink-0 mx-auto w-full max-w-[1400px] px-4 pt-2">
          <div className="rounded-2xl border border-zinc-500/30 bg-zinc-500/10 px-4 py-3 text-sm text-zinc-300" role="status">
            You&apos;re offline. Counts will sync when connection returns.
          </div>
        </div>
      )}
      <>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <Header
            user={{ ...user, displayName: currentSettings.name, photoURL: currentSettings.avatar }}
            onNavigate={navigateTab}
            onRequestLogout={() => setShowLogout(true)}
            onRequestEndDay={() => setShowEndDayConfirm(true)}
            endDayPending={endingDay}
            trackingDayLabel={formatDateDisplay(trackingDay)}
          />
          <main id="main-content" aria-label="Main content" className="app-scroll-main flex-1 min-h-0 w-full pt-2">
            <div className={UI.MAX_CONTAINER}>
              <Suspense fallback={tabFallback}>
                <Routes location={location}>
                  <Route path={ROUTES.TRACK} element={trackView} />
                  <Route path={ROUTES.HISTORY} element={historyView} />
                  <Route path={ROUTES.SETTINGS} element={settingsView} />
                  <Route path="/" element={<Navigate to={ROUTES.TRACK} replace />} />
                  <Route path="*" element={<Navigate to={ROUTES.TRACK} replace />} />
                </Routes>
              </Suspense>
            </div>
          </main>
          <BottomNav activeTab={activeTab} onNavigate={navigate} />
          <ProtocolForm isOpen={showAdd} onClose={() => setShowAdd(false)} onApply={async (d) => { await addProtocol(d); setShowAdd(false); }} title="New tracker" />
          {editProtocol && (
            <ProtocolForm isOpen={!!editProtocol} onClose={() => setEditProtocol(null)} onApply={async (d) => { await updateProtocol(editProtocol.id, d); setEditProtocol(null); }} title="Edit tracker" initialData={editProtocol} />
          )}
          <EditLogOverlay isOpen={!!editTarget} log={editTarget} configs={configs} onClose={() => setEditTarget(null)} user={user} unitPrice={currentSettings.unitPrice} onError={setSettingsError} />
          <ConfirmModal
            isOpen={showEndDayConfirm}
            onClose={() => setShowEndDayConfirm(false)}
            onConfirm={handleEndDay}
            title="End tracking day?"
            message="This archives today's counts to history and resets all counters. You can still edit the archive later."
            confirmText={endingDay ? 'Archiving…' : 'End day'}
            confirmDisabled={endingDay}
          />
          <LogoutModal isOpen={showLogout} onClose={() => setShowLogout(false)} onConfirm={handleLogout} />
          <Toast toast={toast} onDismiss={() => setToast(null)} />
      </>
    </div>
  );
};

const App = () => (
  <GlobalErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  </GlobalErrorBoundary>
);

export default App;
