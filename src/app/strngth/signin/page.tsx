'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/strngth/firebase';
import { useStrngthStore } from '@/lib/strngth/store';

const CYAN = '#00d4ff';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function authError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':          return 'That email address looks invalid.';
    case 'auth/missing-password':       return 'Please enter your password.';
    case 'auth/weak-password':          return 'Password must be at least 6 characters.';
    case 'auth/wrong-password':         return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':      return 'Too many attempts — please try again later.';
    case 'auth/popup-closed-by-user':   return 'Google sign-in was cancelled.';
    case 'auth/popup-blocked':          return 'Popup blocked — allow popups and try again.';
    case 'auth/operation-not-allowed':  return 'This sign-in method is disabled in Firebase.';
    case 'auth/unauthorized-domain':    return 'This domain is not authorised in Firebase Auth settings.';
    case 'auth/network-request-failed': return 'Network error — check your connection and try again.';
    default:                            return 'Something went wrong. Please try again.';
  }
}

export default function SignInPage() {
  const router = useRouter();
  const completeOnboarding = useStrngthStore(s => s.completeOnboarding);
  const setOnboarding = useStrngthStore(s => s.setOnboarding);
  const onboardingName = useStrngthStore(s => s.onboarding.name);

  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [touched, setTouched] = useState(false);
  const [status, setStatus]   = useState<{ msg: string; type: 'error' | 'info' | 'success' } | null>(null);
  const [loading, setLoading] = useState<'' | 'email' | 'google'>('');

  const emailValid = EMAIL_RE.test(email);
  const pwValid    = password.length >= 6;
  const canSubmit  = emailValid && pwValid && !loading;

  function finishLogin(displayName?: string) {
    if (displayName) setOnboarding({ name: displayName });
    completeOnboarding();
    router.replace('/strngth/plans');
  }

  async function handleContinue() {
    setTouched(true);
    if (!canSubmit) return;

    if (!isFirebaseConfigured) {
      setStatus({ msg: 'Firebase is not configured. Add your NEXT_PUBLIC_FIREBASE_* keys.', type: 'error' });
      return;
    }

    setLoading('email');
    setStatus(null);

    // Step 1: try to sign in with existing account
    try {
      await signInWithEmailAndPassword(auth, email, password);
      finishLogin();
      return;
    } catch (e) {
      const code = (e as { code?: string }).code ?? '';
      if ((e as { name?: string }).name === 'AbortError') return;

      // If account does NOT exist, auto-create it
      const noAccount = code === 'auth/user-not-found' || code === 'auth/invalid-credential';
      if (!noAccount) {
        setLoading('');
        setStatus({ msg: authError(code), type: 'error' });
        return;
      }
    }

    // Step 2: no account found — create one automatically
    setStatus({ msg: 'No account found. Creating your account...', type: 'info' });

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const name = onboardingName.trim();
      if (name) {
        try { await updateProfile(cred.user, { displayName: name }); } catch { /* non-critical */ }
      }
      setStatus({ msg: 'Account created! Logging you in...', type: 'success' });
      finishLogin(name || undefined);
    } catch (e) {
      if ((e as { name?: string }).name === 'AbortError') return;
      setLoading('');
      setStatus({ msg: authError((e as { code?: string }).code ?? ''), type: 'error' });
    }
  }

  async function handleGoogle() {
    if (loading) return;
    if (!isFirebaseConfigured) {
      setStatus({ msg: 'Firebase is not configured.', type: 'error' });
      return;
    }
    setLoading('google');
    setStatus(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      finishLogin(result.user.displayName ?? undefined);
    } catch (e) {
      if ((e as { name?: string }).name === 'AbortError') return;
      setLoading('');
      setStatus({ msg: authError((e as { code?: string }).code ?? ''), type: 'error' });
    }
  }

  const fieldStyle = (invalid: boolean) => ({
    background: 'var(--gym-surface-subtle)',
    border: `1px solid ${invalid ? 'rgba(239,68,68,0.6)' : 'var(--gym-border-2)'}`,
    color: 'var(--gym-text)',
    caretColor: CYAN,
  } as const);

  const statusColors = {
    error:   { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)' },
    info:    { color: CYAN,      bg: 'rgba(0,212,255,0.06)',  border: 'rgba(0,212,255,0.2)'  },
    success: { color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
  };

  return (
    <div
      className="min-h-dvh flex flex-col px-6 max-w-lg mx-auto w-full"
      style={{ paddingTop: 'max(24px, env(safe-area-inset-top))', paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}
    >
      {/* Back */}
      <button
        onClick={() => router.push('/strngth/welcome')}
        aria-label="Back"
        className="w-8 h-8 flex items-center justify-center -ml-1 mb-6"
        style={{ color: 'var(--gym-text-dim)' }}
      >
        <ChevronLeft size={22} />
      </button>

      {/* Brand + heading */}
      <p className="text-[11px] font-black tracking-[0.3em] mb-2" style={{ color: CYAN }}>STRNGTH</p>
      <h1
        className="text-4xl font-black mb-1"
        style={{ color: 'var(--gym-text)', fontFamily: 'var(--gym-font-display-loaded, Orbitron, monospace)' }}
      >
        Welcome Back
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--gym-text-muted)' }}>
        Sign in to continue your journey.
      </p>

      {/* Fields */}
      <div className="space-y-3">
        {/* Email */}
        <div>
          <div className="relative">
            <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--gym-text-tertiary)' }} />
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setStatus(null); }}
              onBlur={() => setTouched(true)}
              placeholder="Email address"
              className="w-full h-14 pl-11 pr-4 rounded-2xl text-base outline-none"
              style={fieldStyle(touched && !emailValid && email.length > 0)}
            />
          </div>
          {touched && email.length > 0 && !emailValid && (
            <p className="text-[11px] mt-1.5 ml-1" style={{ color: '#ef4444' }}>Enter a valid email address</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--gym-text-tertiary)' }} />
            <input
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={e => { setPassword(e.target.value); setStatus(null); }}
              onBlur={() => setTouched(true)}
              onKeyDown={e => e.key === 'Enter' && handleContinue()}
              placeholder="Password (min. 6 characters)"
              className="w-full h-14 pl-11 pr-12 rounded-2xl text-base outline-none"
              style={fieldStyle(touched && !pwValid && password.length > 0)}
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--gym-text-tertiary)' }}
            >
              {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {touched && password.length > 0 && !pwValid && (
            <p className="text-[11px] mt-1.5 ml-1" style={{ color: '#ef4444' }}>Password must be at least 6 characters</p>
          )}
        </div>
      </div>

      {/* Status banner */}
      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 text-xs mt-4 rounded-xl px-3 py-2.5 leading-relaxed"
            style={{
              color: statusColors[status.type].color,
              background: statusColors[status.type].bg,
              border: `1px solid ${statusColors[status.type].border}`,
            }}
          >
            {status.type === 'info' && (
              <Loader2 size={13} className="animate-spin flex-shrink-0 mt-0.5" />
            )}
            {status.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue button */}
      <motion.button
        onClick={handleContinue}
        disabled={!!loading}
        whileTap={canSubmit ? { scale: 0.98 } : undefined}
        className="w-full py-4 rounded-2xl font-black text-base tracking-wide mt-5 flex items-center justify-center gap-2"
        style={
          canSubmit
            ? { background: CYAN, color: '#04141d', boxShadow: `0 0 24px ${CYAN}40`, fontFamily: 'var(--gym-font-display-loaded, Orbitron, monospace)' }
            : { background: `${CYAN}55`, color: '#04141d99', fontFamily: 'var(--gym-font-display-loaded, Orbitron, monospace)' }
        }
      >
        {loading === 'email'
          ? <Loader2 size={18} className="animate-spin" />
          : 'CONTINUE'
        }
      </motion.button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <span className="flex-1 h-px" style={{ background: 'var(--gym-border)' }} />
        <span className="text-xs" style={{ color: 'var(--gym-text-tertiary)' }}>or</span>
        <span className="flex-1 h-px" style={{ background: 'var(--gym-border)' }} />
      </div>

      {/* Google */}
      <motion.button
        onClick={handleGoogle}
        disabled={!!loading}
        whileTap={loading ? undefined : { scale: 0.98 }}
        className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3"
        style={{ background: `${CYAN}0d`, border: `1.5px solid ${CYAN}44`, color: 'var(--gym-text)' }}
      >
        {loading === 'google' ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.2-.1-2.3-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 5.1 29.5 3 24 3 16 3 9.1 7.6 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 45c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 36 26.7 37 24 37c-5.3 0-9.7-2.6-11.3-7l-6.5 5C9 40.3 15.9 45 24 45z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.3 5.2C41.4 36.5 44 31 44 24c0-1.2-.1-2.3-.4-3.5z" />
            </svg>
            Continue with Google
          </>
        )}
      </motion.button>

      <div className="flex-1 min-h-6" />

      {/* Policy */}
      <p className="text-center text-[11px] leading-relaxed mt-6" style={{ color: 'var(--gym-text-tertiary)' }}>
        By continuing you agree to STRNGTH&apos;s{' '}
        <a href="/strngth/terms" style={{ color: CYAN }}>Terms of Service</a>
        {' '}and{' '}
        <a href="/strngth/privacy" style={{ color: CYAN }}>Privacy Policy</a>.
      </p>
    </div>
  );
}
