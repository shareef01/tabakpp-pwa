import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Input } from '../Common';
import { cn } from '../../utils/utils';

export const AuthScreen = React.memo(({ accent }) => {
  const [mode, setMode] = useState('LOGIN');
  const [e, setE] = useState('');
  const [p, setP] = useState('');
  const [n, setN] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ t: '', c: '' });

  const handle = async () => {
    setLoading(true); setMsg({ t: '', c: '' });
    try {
      if (mode === 'LOGIN') {
        await signInWithEmailAndPassword(auth, e, p);
      } else if (mode === 'REGISTER') {
        const c = await createUserWithEmailAndPassword(auth, e, p);
        await updateProfile(c.user, { displayName: n });
        await setDoc(doc(db, 'users', c.user.uid), { name: n, accent: accent || '#00D1FF', isDark: true, widgetSize: 'LARGE' });
      } else {
        await sendPasswordResetEmail(auth, e);
        setMsg({ t: 'SUCCESS', c: 'Reset email sent.' });
      }
    } catch (err) {
      setMsg({ t: 'FAULT', c: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center text-white font-inter overflow-hidden relative p-6" style={{'--accent': accent}}>

      {/* MINIMAL LOGO */}
      <div className="mb-12 flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-[24px] bg-accent flex items-center justify-center shadow-[0_0_30px_var(--accent)]">
          <span className="text-zinc-950 font-black text-4xl">+</span>
        </div>
        <h1 className="text-5xl font-[1000] tracking-tighter uppercase leading-none">TABAK</h1>
      </div>

      <div className="w-full max-w-[440px]">
        <div className="bg-neutral-900/40 backdrop-blur-3xl border border-white/5 p-10 md:p-12 rounded-[56px] shadow-2xl shadow-black/50 relative overflow-hidden font-inter w-full text-center">
           <div className="absolute inset-0 border border-white/[0.02] rounded-[56px] pointer-events-none" />

           <div className="relative bg-black/60 border border-white/10 p-1.5 rounded-full flex items-center h-14 w-full mb-10 overflow-hidden font-inter">
              <button onClick={() => setMode('LOGIN')} className={cn("relative flex-1 h-full text-[11px] font-[1000] uppercase tracking-[0.2em] transition-all duration-500 z-20 font-inter", mode === 'LOGIN' ? "text-zinc-950" : "text-white/40 hover:text-white/70")}>Sign In</button>
              <button onClick={() => setMode('REGISTER')} className={cn("relative flex-1 h-full text-[11px] font-[1000] uppercase tracking-[0.2em] transition-all duration-500 z-20 font-inter", mode === 'REGISTER' ? "text-zinc-950" : "text-white/40 hover:text-white/70")}>Sign Up</button>
              <motion.div
                 className="absolute left-1.5 h-[calc(100%-12px)] bg-accent rounded-full shadow-lg"
                 animate={{ x: mode === 'LOGIN' ? 0 : '100%', left: mode === 'LOGIN' ? '6px' : '-6px' }}
                 style={{ width: 'calc(50% - 6px)' }}
                 transition={{ type: 'spring', stiffness: 450, damping: 40 }}
              />
           </div>

           <div className="flex flex-col gap-8 relative z-10 font-inter text-center">
             {msg.c && <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className={cn("p-4 rounded-xl text-center font-black text-[10px] uppercase tracking-widest border", msg.t === 'FAULT' ? "bg-rose-600/10 text-rose-400 border-rose-600/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20")}>{msg.c}</motion.div>}

             <div className="flex flex-col gap-5 text-left font-inter">
               {mode === 'REGISTER' && <Input label="Name" value={n} onChange={setN} isDark />}
               <Input label="Email" type="email" value={e} onChange={setE} isDark />
               {mode !== 'RESET' && <Input label="Password" type="password" value={p} onChange={setP} isDark />}
             </div>

             <button
              className="group relative w-full h-18 bg-accent text-zinc-950 font-[1000] uppercase tracking-[0.4em] rounded-2xl active:scale-[0.98] transition-all overflow-hidden flex items-center justify-center text-[11px] mt-4 shadow-accent/20 shadow-xl"
              onClick={handle}
             >
               <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
               <div className="absolute inset-0 border-t border-white/50 rounded-2xl pointer-events-none" />

               <span className="relative z-10 flex items-center gap-3">
                 {loading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'LOGIN' ? 'Initialize' : (mode === 'REGISTER' ? 'Register' : 'Reset'))}
               </span>
             </button>

             <div className="flex flex-col items-center gap-4 mt-2 font-inter text-[10px] font-black uppercase tracking-widest text-white/40">
               {mode === 'LOGIN' && <button onClick={() => setMode('RESET')} className="hover:text-accent transition-colors">Forgot Password?</button>}
               {mode === 'RESET' && <button onClick={() => setMode('LOGIN')} className="hover:text-white transition-colors">Back to Login</button>}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
});
