import type { Metadata, Viewport } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ServiceWorkerRegistration from "@/components/strngth/ServiceWorkerRegistration";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#03030a",
};

export const metadata: Metadata = {
  title: "Strngth — Fitness RPG",
  description: "Level up your fitness. Track workouts, earn XP, climb the ranks.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Strngth",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#03030a",
    "msapplication-TileImage": "/icons/icon-144x144.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }} suppressHydrationWarning>
        {/* Inline script runs before any module JS, so registers before Next.js dev overlay */}
        <script dangerouslySetInnerHTML={{__html:`(function(){function s(v){if(!v)return false;var m=v.message||'',t=v.stack||'';return v.name==='AbortError'||/aborted a request/i.test(m)||/chrome-extension:\\/\\//i.test(t)||/client is offline/i.test(m)||/\\[code=unavailable\\]/i.test(m)||/Could not reach Cloud Firestore/i.test(m);}window.addEventListener('error',function(e){if(s(e.error)||/aborted a request/i.test(e.message||'')){e.preventDefault();e.stopImmediatePropagation();}},true);window.addEventListener('unhandledrejection',function(e){if(s(e.reason)){e.preventDefault();e.stopImmediatePropagation();}},true);})();`}} />
        <AppProvider>
          {children}
        </AppProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
