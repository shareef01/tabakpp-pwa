import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { ensureUserDocument, signInWithGoogle } from '../../api/authService';
import { Input } from '../../components/ui/Input';
import { cn } from '../../utils/system';

const GoogleMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const friendlyAuthError = (code) => {
  const map = {
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/user-not-found': 'No account found for this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/popup-closed-by-user': 'Sign-in cancelled.',
    'auth/account-exists-with-different-credential': 'This email uses a different sign-in method.',
    'auth/credential-already-in-use': 'This Google account is already linked.',
  };
  return map[code] || 'Something went wrong. Please try again.';
};


export const AuthScreen = React.memo(() => {
  const [mode, setMode] = useState('LOGIN');
  const [e, setE] = useState('');
  const [p, setP] = useState('');
  const [n, setN] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [msg, setMsg] = useState({ t: '', c: '' });

  const switchMode = (next) => {
    setMode(next);
    setMsg({ t: '', c: '' });
  };

  const validate = () => {
    if (!e.trim()) return 'Enter your email address.';
    if (mode === 'REGISTER' && !n.trim()) return 'Enter your name.';
    if (mode !== 'RESET' && !p) return 'Enter your password.';
    if (mode === 'REGISTER' && p.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  const handle = async (ev) => {
    ev?.preventDefault?.();
    if (loading || googleLoading) return;

    const err = validate();
    if (err) {
      setMsg({ t: 'error', c: err });
      return;
    }

    setLoading(true);
    setMsg({ t: '', c: '' });

    try {
      if (mode === 'LOGIN') {
        await signInWithEmailAndPassword(auth, e.trim(), p);
      } else if (mode === 'REGISTER') {
        const c = await createUserWithEmailAndPassword(auth, e.trim(), p);
        await updateProfile(c.user, { displayName: n.trim() });
        await ensureUserDocument(c.user);
      } else {
        await sendPasswordResetEmail(auth, e.trim());
        setMsg({ t: 'success', c: 'Check your inbox for a reset link.' });
      }
    } catch (err) {
      setMsg({ t: 'error', c: friendlyAuthError(err?.code) });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (loading || googleLoading) return;
    setGoogleLoading(true);
    setMsg({ t: '', c: '' });
    try {
      const result = await signInWithGoogle();
      if (result.redirected) return;
    } catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setMsg({ t: 'error', c: friendlyAuthError(err?.code) });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const submitLabel = mode === 'LOGIN' ? 'Sign in' : mode === 'REGISTER' ? 'Create account' : 'Send reset link';
  const fieldClass = '[&_label]:text-[11px] [&_label]:font-semibold [&_label]:tracking-wide [&_label]:text-zinc-400';
  const inputShape = 'h-12 rounded-2xl border-white/[0.08] bg-black/30 placeholder:text-zinc-600 focus:border-accent/40';

  return (
    <div className="auth-screen min-h-full w-full bg-[#09090B] text-white font-inter overflow-x-hidden">
      <div className="auth-screen-glow pointer-events-none fixed top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100vw,28rem)] aspect-square bg-accent/[0.06] blur-[110px]" />

      <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-4 py-6 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-[420px] flex flex-col items-center">
          <div className="auth-hero mb-6 sm:mb-10 md:mb-12 text-center select-none" aria-hidden="true">
            <div className="relative inline-flex flex-col items-center">
              <div className="pointer-events-none absolute -inset-x-12 -top-10 bottom-[-1rem] rounded-full bg-accent/[0.08] blur-3xl" />
              <div className="relative inline-flex items-end leading-none animate-brand">
                <span className="text-accent font-[1000] text-[5.5rem] sm:text-[6.5rem] md:text-[7rem] tracking-tighter drop-shadow-[0_0_48px_rgba(var(--accent-rgb),0.4)]">
                  t
                </span>
                <span className="mb-[0.55rem] sm:mb-[0.7rem] md:mb-[0.85rem] -ml-1.5 text-[2rem] sm:text-[2.35rem] md:text-[2.75rem] font-black italic text-accent/55 tracking-tight">
                  ++
                </span>
              </div>
            </div>
          </div>

          <div className="auth-card w-full rounded-[32px] sm:rounded-[36px] border border-white/[0.09] bg-[#121214]/80 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_28px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]">
            {mode === 'RESET' ? (
              <div className="mb-5 px-1">
                <h1 className="text-lg font-bold text-white">Reset password</h1>
                <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">We&apos;ll email you a link to choose a new password.</p>
              </div>
            ) : (
              <>
                <h1 className="sr-only">Sign in to T++</h1>
                <div className="relative mb-5 grid grid-cols-2 gap-1 rounded-2xl border border-white/[0.07] bg-black/50 p-1" role="tablist" aria-label="Authentication mode">
                <motion.div
                  className="absolute top-1 bottom-1 rounded-xl bg-accent shadow-[0_0_18px_-4px_rgba(var(--accent-rgb),0.45)]"
                  layout
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  style={{
                    width: 'calc(50% - 4px)',
                    left: mode === 'LOGIN' ? '4px' : 'calc(50%)',
                  }}
                />
                <button
                  type="button"
                  role="tab"
                  id="auth-tab-login"
                  aria-controls="auth-panel"
                  aria-selected={mode === 'LOGIN'}
                  onClick={() => switchMode('LOGIN')}
                  className={cn(
                    'relative z-10 h-11 rounded-xl text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent/50',
                    mode === 'LOGIN' ? 'text-zinc-950' : 'text-zinc-500 hover:text-zinc-300'
                  )}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  role="tab"
                  id="auth-tab-register"
                  aria-controls="auth-panel"
                  aria-selected={mode === 'REGISTER'}
                  onClick={() => switchMode('REGISTER')}
                  className={cn(
                    'relative z-10 h-11 rounded-xl text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent/50',
                    mode === 'REGISTER' ? 'text-zinc-950' : 'text-zinc-500 hover:text-zinc-300'
                  )}
                >
                  Sign up
                </button>
              </div>
              </>
            )}

            <form id="auth-panel" role="tabpanel" aria-labelledby={mode === 'REGISTER' ? 'auth-tab-register' : 'auth-tab-login'} className="flex flex-col gap-4 sm:gap-5" onSubmit={handle}>
              <AnimatePresence mode="wait">
                {msg.c && (
                  <motion.div
                    key={msg.c}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    role="alert"
                    className={cn(
                      'rounded-[14px] px-4 py-3 text-sm font-medium border leading-snug',
                      msg.t === 'error'
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    )}
                  >
                    {msg.c}
                  </motion.div>
                )}
              </AnimatePresence>

              {mode !== 'RESET' && (
                <>
                  <button
                    type="button"
                    disabled={googleLoading || loading}
                    onClick={handleGoogle}
                    aria-busy={googleLoading}
                    className="w-full h-12 rounded-2xl border border-white/[0.1] bg-white/[0.04] text-white text-sm font-semibold flex items-center justify-center gap-2.5 transition-all hover:bg-white/[0.07] active:scale-[0.98] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50"
                  >
                    {googleLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                        Signing in…
                      </>
                    ) : (
                      <>
                        <GoogleMark />
                        Continue with Google
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-[11px] font-medium text-zinc-600">or</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {mode === 'REGISTER' && (
                    <motion.div
                      key="name"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <Input
                        label="Name"
                        value={n}
                        onChange={setN}
                        placeholder="Your display name"
                        isDark
                        inputClassName={inputShape}
                        className={fieldClass}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={e}
                  onChange={setE}
                  placeholder="you@example.com"
                  isDark
                  inputClassName={inputShape}
                  className={fieldClass}
                />

                {mode !== 'RESET' && (
                  <Input
                    label="Password"
                    type="password"
                    autoComplete={mode === 'REGISTER' ? 'new-password' : 'current-password'}
                    value={p}
                    onChange={setP}
                    placeholder={mode === 'REGISTER' ? 'At least 6 characters' : 'Your password'}
                    isDark
                    inputClassName={inputShape}
                    className={fieldClass}
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full h-12 rounded-[14px] bg-accent text-zinc-950 text-sm font-bold shadow-[0_0_28px_-6px_rgba(var(--accent-rgb),0.45)] transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : submitLabel}
              </button>

              <div className="flex flex-col items-center gap-2 pt-1">
                {mode === 'LOGIN' && (
                  <button
                    type="button"
                    onClick={() => switchMode('RESET')}
                    className="text-xs sm:text-sm font-medium text-zinc-500 hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50 rounded-lg px-1"
                  >
                    Forgot password?
                  </button>
                )}
                {mode === 'RESET' && (
                  <>
                    <button
                      type="button"
                      onClick={() => switchMode('LOGIN')}
                      className="text-xs sm:text-sm font-medium text-zinc-500 hover:text-white transition-colors"
                    >
                      Back to sign in
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode('REGISTER')}
                      className="text-xs sm:text-sm font-medium text-zinc-500 hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50 rounded-lg px-1"
                    >
                      Create an account
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});
