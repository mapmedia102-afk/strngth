import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

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

export const metadata: Metadata = {
  title: "GLOCASA | Premium Glassware & Drinkware | Modern Indian Luxury",
  description: "Experience Apple-style luxury drinkware. Shop premium ribbed tumblers, café-aesthetic coffee mugs, and imperial gold crystal wine glasses. Made for aesthetic homes.",
  keywords: "premium glassware India, D2C drinkware, gold rimmed tumblers, aesthetic coffee mugs, wine glasses online, aesthetic kitchenware, GLOCASA, Indian home decor",
  authors: [{ name: "GLOCASA Luxury" }],
  openGraph: {
    title: "GLOCASA | Premium Glassware & Drinkware | Modern Indian Luxury",
    description: "Shop premium ribbed tumblers, café-aesthetic coffee mugs, and imperial gold crystal wine glasses. Crafted for aesthetic homes.",
    url: "https://glocasa.in",
    siteName: "GLOCASA Glassware",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans" suppressHydrationWarning>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
