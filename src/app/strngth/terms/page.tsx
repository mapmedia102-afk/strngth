'use client';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const CYAN = '#00d4ff';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using STRNGTH, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app.',
  },
  {
    title: '2. Use of the Service',
    body: 'STRNGTH is a fitness tracking application intended for personal, non-commercial use. You agree to use the service only for lawful purposes and in a manner that does not infringe the rights of others. You must be at least 13 years old to use this service.',
  },
  {
    title: '3. User Accounts',
    body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately of any unauthorised use of your account.',
  },
  {
    title: '4. Health & Fitness Disclaimer',
    body: 'STRNGTH provides workout tracking and gamification features for informational purposes only. Content in the app does not constitute medical advice. Always consult a qualified healthcare professional before beginning any exercise programme. You assume full responsibility for any risks associated with your physical activity.',
  },
  {
    title: '5. Intellectual Property',
    body: 'All content, features, and functionality of STRNGTH — including graphics, logos, and software — are the exclusive property of STRNGTH and are protected by applicable intellectual property laws.',
  },
  {
    title: '6. Data & Privacy',
    body: 'Your use of STRNGTH is also governed by our Privacy Policy, which is incorporated into these Terms by reference. We collect and process data as described in the Privacy Policy.',
  },
  {
    title: '7. Limitation of Liability',
    body: 'To the maximum extent permitted by law, STRNGTH shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.',
  },
  {
    title: '8. Changes to Terms',
    body: 'We may update these Terms from time to time. Continued use of the app after changes constitutes your acceptance of the revised Terms. We will notify users of material changes through the app.',
  },
  {
    title: '9. Contact',
    body: 'For questions about these Terms, contact us at support@strngth.app.',
  },
];

export default function TermsPage() {
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
            Terms of Service
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 pb-16 max-w-2xl mx-auto space-y-6">
        <p className="text-xs" style={{ color: 'var(--gym-text-muted)' }}>
          Last updated: June 2026
        </p>

        <p className="text-sm leading-relaxed" style={{ color: 'var(--gym-text-dim)' }}>
          These Terms of Service govern your use of the STRNGTH fitness application. Please read them carefully.
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
