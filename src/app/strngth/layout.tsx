import type { Metadata, Viewport } from 'next';
import { Orbitron, Outfit } from 'next/font/google';
import './strngth.css';
import StrngthThemeWrapper from '@/components/strngth/StrngthThemeWrapper';
import StrngthChrome from '@/components/strngth/StrngthChrome';
import FirebaseSync from '@/components/strngth/FirebaseSync';
import ServiceWorkerRegistration from '@/components/strngth/ServiceWorkerRegistration';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--gym-font-display-loaded',
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--gym-font-body-loaded',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#00d4ff',
};

export const metadata: Metadata = {
  title: 'STRNGTH — Level Up Your Real Life',
  description: 'The ultimate gamified fitness RPG. Track workouts, earn XP, climb ranks, and become the strongest version of yourself.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'STRNGTH',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    apple: '/apple-touch-icon.png',
  },
};

export default function StrngthLayout({ children }: { children: React.ReactNode }) {
  return (
    <StrngthThemeWrapper
      className={`strngth ${orbitron.variable} ${outfit.variable}`}
    >
      <ServiceWorkerRegistration />
      <FirebaseSync />
      <StrngthChrome>{children}</StrngthChrome>
    </StrngthThemeWrapper>
  );
}
