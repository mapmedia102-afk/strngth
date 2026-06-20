'use client';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const CYAN = '#00d4ff';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: 'We collect information you provide directly — such as your name, email address, and fitness data (workouts, sets, reps, personal records). We also collect usage data to improve the app experience.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use your data to provide and improve the STRNGTH service, personalise your experience, track your fitness progress, award XP and badges, and send relevant notifications (if enabled). We do not sell your personal data to third parties.',
  },
  {
    title: '3. Data Storage',
    body: 'Your data is stored securely using Firebase (Google Cloud). Workout history and profile data are stored in Firestore with offline persistence on your device. Authentication is handled by Firebase Auth with industry-standard encryption.',
  },
  {
    title: '4. Data Sharing',
    body: 'We do not sell or rent your personal information. We may share data with trusted service providers (e.g. Firebase/Google) strictly to operate the service. We may disclose data if required by law.',
  },
  {
    title: '5. Your Rights',
    body: 'You can export your data at any time from the Profile → Settings → Export Data option. You can delete your account and all associated data by contacting us. You can control notification preferences from Profile → Settings → Notifications.',
  },
  {
    title: '6. Privacy Settings',
    body: 'STRNGTH provides in-app privacy controls under Profile → Settings → Privacy. You can toggle public profile visibility, leaderboard appearance, and workout activity sharing at any time.',
  },
  {
    title: '7. Children\'s Privacy',
    body: 'STRNGTH is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, contact us immediately.',
  },
  {
    title: '8. Cookies & Analytics',
    body: 'The app may use minimal analytics to understand usage patterns and improve performance. No tracking cookies are used for advertising purposes.',
  },
  {
    title: '9. Changes to This Policy',
    body: 'We may update this Privacy Policy periodically. We will notify you of significant changes through the app. Your continued use after changes constitutes acceptance of the updated policy.',
  },
  {
    title: '10. Contact Us',
    body: 'For privacy-related questions or data requests, contact us at privacy@strngth.app.',
  },
];

export default function PrivacyPage() {
  const router = useRouter();
  return (
    <div className="min-h-dvh" style={{ background: 'var(--gym-bg)', color: 'var(--gym-text)' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 py-4 border-b"
        style={{
          background: 'var(--gym-bg)',
          borderColor: 'var(--gym-border)',
          paddingTop: 'max(16px, env(safe-area-inset-top))',
        }}
      >
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
          style={{ background: 'var(--gym-surface-subtle)', border: '1px solid var(--gym-border)' }}
        >
          <ChevronLeft size={20} style={{ color: 'var(--gym-text)' }} />
        </button>
        <div>
          <p className="text-[10px] font-black tracking-widest" style={{ color: CYAN }}>STRNGTH</p>
          <h1 className="text-base font-black" style={{ fontFamily: 'var(--gym-font-display-loaded, Orbitron, monospace)' }}>
            Privacy Policy
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 pb-16 max-w-2xl mx-auto space-y-6">
        <p className="text-xs" style={{ color: 'var(--gym-text-muted)' }}>
          Last updated: June 2026
        </p>

        <p className="text-sm leading-relaxed" style={{ color: 'var(--gym-text-dim)' }}>
          Your privacy matters to us. This policy explains what data STRNGTH collects, how it is used, and the controls you have over it.
        </p>

        {SECTIONS.map(s => (
          <div key={s.title}>
            <h2
              className="text-sm font-black mb-2"
              style={{ color: 'var(--gym-text)', fontFamily: 'var(--gym-font-display-loaded, Orbitron, monospace)' }}
            >
              {s.title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--gym-text-dim)' }}>
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
