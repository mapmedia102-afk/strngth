'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Mail, Lock, Eye, EyeOff, Loader2, X } from 'lucide-react';
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

// ── Inline legal content ───────────────────────────────────────────────────────

const TERMS_SECTIONS = [
  { title: '1. Acceptance of Terms', body: 'By accessing or using STRNGTH, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app.' },
  { title: '2. Use of the Service', body: 'STRNGTH is a fitness tracking application intended for personal, non-commercial use. You agree to use the service only for lawful purposes and in a manner that does not infringe the rights of others. You must be at least 13 years old to use this service.' },
  { title: '3. User Accounts', body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately of any unauthorised use of your account.' },
  { title: '4. Health & Fitness Disclaimer', body: 'STRNGTH provides workout tracking and gamification features for informational purposes only. Content in the app does not constitute medical advice. Always consult a qualified healthcare professional before beginning any exercise programme. You assume full responsibility for any risks associated with your physical activity.' },
  { title: '5. Intellectual Property', body: 'All content, features, and functionality of STRNGTH — including graphics, logos, and software — are the exclusive property of STRNGTH and are protected by applicable intellectual property laws.' },
  { title: '6. Data & Privacy', body: 'Your use of STRNGTH is also governed by our Privacy Policy, which is incorporated into these Terms by reference. We collect and process data as described in the Privacy Policy.' },
  { title: '7. Limitation of Liability', body: 'To the maximum extent permitted by law, STRNGTH shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.' },
  { title: '8. Changes to Terms', body: 'We may update these Terms from time to time. Continued use of the app after changes constitutes your acceptance of the revised Terms. We will notify users of material changes through the app.' },
  { title: '9. Contact', body: 'For questions about these Terms, contact us at support@strngth.app.' },
];

const PRIVACY_SECTIONS = [
  { title: '1. Information We Collect', body: 'We collect information you provide directly — such as your name, email address, and fitness data (workouts, sets, reps, personal records). We also collect usage data to improve the app experience.' },
  { title: '2. How We Use Your Information', body: 'We use your data to provide and improve the STRNGTH service, personalise your experience, track your fitness progress, award XP and badges, and send relevant notifications (if enabled). We do not sell your personal data to third parties.' },
  { title: '3. Data Storage', body: 'Your data is stored securely using Firebase (Google Cloud). Workout history and profile data are stored in Firestore with offline persistence on your device. Authentication is handled by Firebase Auth with industry-standard encryption.' },
  { title: '4. Data Sharing', body: 'We do not sell or rent your personal information. We may share data with trusted service providers (e.g. Firebase/Google) strictly to operate the service. We may disclose data if required by law.' },
  { title: '5. Your Rights', body: 'You can export your data at any time from Profile → Settings → Export Data. You can delete your account and all associated data by contacting us. You can control notification preferences from Profile → Settings → Notifications.' },
  { title: '6. Privacy Settings', body: 'STRNGTH provides in-app privacy controls under Profile → Settings → Privacy. You can toggle public profile visibility, leaderboard appearance, and workout activity sharing at any time.' },
  { title: "7. Children's Privacy", body: 'STRNGTH is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, contact us immediately.' },
  { title: '8. Cookies & Analytics', body: 'The app may use minimal analytics to understand usage patterns and improve performance. No tracking cookies are used for advertising purposes.' },
  { title: '9. Changes to This Policy', body: 'We may update this Privacy Policy periodically. We will notify you of significant changes through the app. Your continued use after changes constitutes acceptance of the updated policy.' },
  { title: '10. Contact Us', body: 'For privacy-related questions or data requests, contact us at privacy@strngth.app.' },
];

function LegalModal({ title, subtitle, sections, onClose }: {
  title: string;
  subtitle: string;
  sections: { title: string; body: string }[];
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'var(--gym-bg)' }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-4 border-b flex-shrink-0"
        style={{
          borderColor: 'var(--gym-border)',
          paddingTop: 'max(18px, env(safe-area-inset-top))',
        }}
      >
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
          style={{ background: 'var(--gym-surface-subtle)', border: '1px solid var(--gym-border)' }}
        >
          <X size={17} style={{ color: 'var(--gym-text)' }} />
        </button>
        <div>
          <p className="text-[10px] font-black tracking-widest" style={{ color: CYAN }}>STRNGTH</p>
          <h2 className="text-base font-black" style={{ color: 'var(--gym-text)', fontFamily: 'var(--gym-font-display-loaded, Orbitron, monospace)' }}>
            {title}
          </h2>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5" style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}>
        <p className="text-xs" style={{ color: 'var(--gym-text-muted)' }}>Last updated: June 2026</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--gym-text-dim)' }}>{subtitle}</p>
        {sections.map(s => (
          <div key={s.title}>
            <h3 className="text-sm font-black mb-1.5" style={{ color: 'var(--gym-text)', fontFamily: 'var(--gym-font-display-loaded, Orbitron, monospace)' }}>
              {s.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--gym-text-dim)' }}>{s.body}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function SignInPage() {
  const router = useRouter();
  const completeOnboarding = useStrngthStore(s => s.completeOnboarding);
  const setOnboarding = useStrngthStore(s => s.setOnboarding);
  const onboardingName = useStrngthStore(s => s.onboarding.name);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [touched, setTouched]   = useState(false);
  const [status, setStatus]     = useState<{ msg: string; type: 'error' | 'info' | 'success' } | null>(null);
  const [loading, setLoading]   = useState<'' | 'email' | 'google'>('');
  const [legal, setLegal]       = useState<'terms' | 'privacy' | null>(null);

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
    try {
      await signInWithEmailAndPassword(auth, email, password);
      finishLogin();
      return;
    } catch (e) {
      const code = (e as { code?: string }).code ?? '';
      if ((e as { name?: string }).name === 'AbortError') return;
      const noAccount = code === 'auth/user-not-found' || code === 'auth/invalid-credential';
      if (!noAccount) {
        setLoading('');
        setStatus({ msg: authError(code), type: 'error' });
        return;
      }
    }
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
    <>
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
          {loading === 'email' ? <Loader2 size={18} className="animate-spin" /> : 'CONTINUE'}
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
          <button onClick={() => setLegal('terms')} style={{ color: CYAN, textDecoration: 'underline' }}>
            Terms of Service
          </button>
          {' '}and{' '}
          <button onClick={() => setLegal('privacy')} style={{ color: CYAN, textDecoration: 'underline' }}>
            Privacy Policy
          </button>.
        </p>
      </div>

      {/* Legal modals — slide up over the page, no navigation */}
      <AnimatePresence>
        {legal === 'terms' && (
          <LegalModal
            key="terms"
            title="Terms of Service"
            subtitle="These Terms of Service govern your use of the STRNGTH fitness application. Please read them carefully."
            sections={TERMS_SECTIONS}
            onClose={() => setLegal(null)}
          />
        )}
        {legal === 'privacy' && (
          <LegalModal
            key="privacy"
            title="Privacy Policy"
            subtitle="Your privacy matters to us. This policy explains what data STRNGTH collects, how it is used, and the controls you have over it."
            sections={PRIVACY_SECTIONS}
            onClose={() => setLegal(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
