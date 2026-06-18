import React, { useState, useMemo, useEffect, useCallback, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, BarChart3, Settings, AlertCircle, Loader2 } from 'lucide-react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { auth, db } from './firebase';

// --- UTILS ---
import { hexToRgbValues } from './utils/formatters';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// --- CONTEXT & HOOKS ---
import { AuthProvider, useAuth } from './context/AuthContext';
import { useRegistry } from './hooks/useRegistry';

// --- SHARED COMPONENTS ---
import { TopBanner } from './components/layout/TopBanner';
import { LogoutModal } from './components/modals/Modals';
import { DashboardSkeleton } from './components/dashboard/DashboardSkeleton';
import { ProtocolFormOverlay } from './components/modals/ProtocolFormOverlay';
import { EditOverlay } from './components/modals/EditOverlay';
import { UI } from './components/Common';

// --- LAZY LOADED SCREENS ---
const lazyWithRetry = (componentImport) => lazy(async () => {
  try {
    return await componentImport();
  } catch (error) {
    console.error("Chunk loading failed, forcing hard refresh...", error);
    window.location.reload();
    return { default: () => null };
  }
});

const AuthScreen = lazyWithRetry(() => import('./components/auth/AuthScreen').then(m => ({ default: m.AuthScreen })));
const TrackerCard = lazyWithRetry(() => import('./components/dashboard/TrackerCard').then(m => ({ default: m.TrackerCard })));
const MetricBanner = lazyWithRetry(() => import('./components/dashboard/MetricBanner').then(m => ({ default: m.MetricBanner })));
const HistoryScreen = lazyWithRetry(() => import('./components/history/HistoryScreen').then(m => ({ default: m.HistoryScreen })));
const SettingsScreen = lazyWithRetry(() => import('./components/settings/SettingsScreen').then(m => ({ default: m.SettingsScreen })));

// --- GLOBAL CONSTANTS ---
const APP_VERSION = "30.1.5-POLISHED";

// --- GLOBAL COMPONENTS ---

const LoadingView = () => (
  <div className="min-h-screen w-full bg-[#020202] flex flex-col items-center justify-center space-y-8 text-white font-inter">
    <Loader2 className="animate-spin text-accent" size={64} strokeWidth={3} />
    <span className="text-xs font-black tracking-[1em] uppercase text-white/20 animate-pulse">Syncing</span>
  </div>
);

const NavBtn = React.memo(({ id, icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className="relative flex-1 py-4 flex flex-col items-center gap-1.5 group transition-all duration-300 text-white h-full border-none bg-transparent">
    {/* ACTIVE STATE: Subtle glowing accent line above icon */}
    <motion.div
      initial={false}
      animate={{
        opacity: active ? 1 : 0,
        scaleX: active ? 1 : 0,
        y: active ? 0 : -4
      }}
      className="absolute top-0 w-8 h-1 rounded-b-full bg-accent shadow-[0_4px_12px_var(--accent)]"
    />

    <Icon
      size={24}
      className={cn(
        "transition-all duration-300",
        active ? "text-accent scale-110 drop-shadow-[0_0_15px_var(--accent-rgb)]" : "text-neutral-500 group-hover:text-neutral-300"
      )}
      strokeWidth={active ? 3 : 2}
    />

    {/* ACTIVE STATE: Revealed small text label */}
    <span className={cn(
      "text-[9px] font-[1000] uppercase tracking-widest transition-all duration-300",
      active ? "text-white opacity-100 translate-y-0" : "text-neutral-500 opacity-0 translate-y-1"
    )}>
      {label}
    </span>
  </button>
));

// --- ERROR BOUNDARY ---
class GlobalErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#020202] flex flex-col items-center justify-center p-8 text-center text-white font-inter">
          <div className="p-6 bg-danger/10 rounded-3xl border border-danger/20 mb-8"><AlertCircle size={48} className="text-danger" /></div>
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Architecture Failure</h2>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="px-8 h-14 rounded-full bg-white text-black font-black uppercase tracking-widest">Reset System</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- ARCHITECTURAL CORE ---

const AppContent = () => {
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const localBuildId = localStorage.getItem('tabak_build_id');
    const serverBuildId = String(typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : 'initial');

    if (localBuildId && localBuildId !== serverBuildId) {
      if ('caches' in window) {
        caches.keys().then(names => {
          for (let name of names) caches.delete(name);
        });
      }
      localStorage.setItem('tabak_build_id', serverBuildId);
      sessionStorage.clear();
      window.location.replace(window.location.origin + window.location.pathname + '?v=' + serverBuildId);
    } else {
      localStorage.setItem('tabak_build_id', serverBuildId);
    }
  }, []);

  const [settings, setSettings] = useState({
    accent: localStorage.getItem('tabak_accent') || '#00D1FF',
    widgetSize: 'MEDIUM',
    avatar: null,
    name: '',
    unitPrice: 0.5
  });

  const responsiveUser = useMemo(() => ({
    ...user,
    displayName: settings.name || user?.displayName,
    photoURL: settings.avatar || user?.photoURL
  }), [user, settings.name, settings.avatar]);

  const [isHydrated, setIsHydrated] = useState(false);
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const registry = useRegistry(user, today, settings.unitPrice);

  const {
    configs, logs, metrics, loading: registryLoading, error: registryError,
    increment, decrement, reorder, addProtocol, updateProtocol, deleteProtocol
  } = registry || { configs: [], logs: [], metrics: {}, loading: true, error: null };

  const [activeTab, setActiveTab] = useState('track');
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editProtocol, setEditProtocol] = useState(null);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(doc(db, 'users', user.uid), (s) => {
      if (s.exists()) {
        const d = s.data();
        if (d.accent) localStorage.setItem('tabak_accent', d.accent);
        setSettings(p => ({
          ...p,
          accent: d.accent || '#00D1FF',
          widgetSize: d.widgetSize || 'MEDIUM',
          avatar: d.avatar || null,
          name: d.name || user.displayName || '',
          unitPrice: d.unitPrice ?? 0.5
        }));
      }
      setIsHydrated(true);
    });
  }, [user]);

  const onUpdateSettings = useCallback(async (upd) => {
    if (!user || !auth.currentUser) return;
    try {
      if (upd.name || upd.avatar) {
        await updateProfile(auth.currentUser, { displayName: upd.name, photoURL: upd.avatar });
      }
      await updateDoc(doc(db, 'users', user.uid), upd);
    } catch (e) { console.error(e); }
  }, [user]);

  if (authLoading) return <LoadingView />;

  return (
    <div className="min-h-screen w-full bg-[#020202] text-white font-inter selection:bg-accent/30 overflow-x-hidden flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]" style={{ '--accent': settings.accent, '--accent-rgb': hexToRgbValues(settings.accent) }}>
      {!user ? (
        <Suspense fallback={<LoadingView />}>
          <AuthScreen accent={settings.accent} />
        </Suspense>
      ) : (
        <>
          <TopBanner user={responsiveUser} onNavigate={setActiveTab} widgetSize={settings.widgetSize} onUpdateSettings={onUpdateSettings} onRequestLogout={() => setShowLogout(true)} />

          <main className="flex-1 overflow-y-auto pt-6 pb-28 md:pb-24 transition-all duration-300 overflow-x-hidden">
            <div className={UI.MAX_CONTAINER}>
              <Suspense fallback={<LoadingView />}>
                <AnimatePresence mode="wait">
                  {activeTab === 'track' && (
                    <motion.div key="track" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                      {registryError && <div className="mb-8 p-4 bg-danger/10 border border-danger/20 rounded-2xl text-danger text-[10px] font-[1000] uppercase text-center mb-8">Sync Error: {registryError}</div>}

                      {!isHydrated || registryLoading ? (
                        <DashboardSkeleton widgetSize={settings.widgetSize} />
                      ) : (
                        <div className="flex flex-col gap-10 w-full">
                           <div className="w-full">
                              <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 md:gap-8 transition-all duration-300 items-stretch">
                                {configs.sort((a,b)=>a.order-b.order).map((c, i) => (
                                  <TrackerCard key={c.id} config={c} count={(metrics.todayLog?.counts || {})[c.id] || 0} onInc={() => increment(c.id)} onDec={() => decrement(c.id)} index={i} globalSize={settings.widgetSize} />
                                ))}
                              </div>
                           </div>

                           <div className="w-full">
                              <MetricBanner m={metrics} widgetSize={settings.widgetSize} />
                           </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                  {activeTab === 'history' && <HistoryScreen logs={logs} m={metrics} onEdit={setEditTarget} userId={user.uid} today={today} />}
                  {activeTab === 'control' && <SettingsScreen configs={configs} user={responsiveUser} settings={settings} onAdd={() => setShowAdd(true)} onReo={reorder} onEditP={setEditProtocol} onUpd={onUpdateSettings} onDel={deleteProtocol} />}
                </AnimatePresence>
              </Suspense>
            </div>
          </main>

          <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-neutral-900/80 backdrop-blur-3xl border-t border-white/[0.05] pb-[env(safe-area-inset-bottom)] px-6 h-20">
            <div className="max-w-[1200px] mx-auto flex items-center justify-around h-full text-white">
              <NavBtn id="track" icon={LayoutGrid} label="Track" active={activeTab === 'track'} onClick={() => setActiveTab('track')} />
              <NavBtn id="history" icon={BarChart3} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
              <NavBtn id="control" icon={Settings} label="Settings" active={activeTab === 'control'} onClick={() => setActiveTab('control')} />
            </div>
          </nav>

          <AnimatePresence>
            {showLogout && <LogoutModal isOpen={showLogout} onClose={() => setShowLogout(false)} onConfirm={() => { setShowLogout(false); auth.signOut(); }} />}
            {showAdd && <ProtocolFormOverlay isOpen={showAdd} onClose={() => setShowAdd(false)} onApply={async (d) => { await addProtocol(d); setShowAdd(false); }} title="Create" />}
            {editProtocol && <ProtocolFormOverlay isOpen={!!editProtocol} onClose={() => setEditProtocol(null)} onApply={async (d) => { await updateProtocol(editProtocol.id, d); setEditProtocol(null); }} title="Edit" initialData={editProtocol} />}
            {editTarget && <EditOverlay log={editTarget} configs={configs} onClose={() => setEditTarget(null)} user={responsiveUser} />}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

const App = () => (
  <GlobalErrorBoundary>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </GlobalErrorBoundary>
);

export default App;
