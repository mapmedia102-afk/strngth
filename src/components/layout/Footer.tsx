import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  const shopLinks = [
    { name: "All Glassware", href: "/shop" },
    { name: "Collections", href: "/collections" },
    { name: "Bulk Orders", href: "/bulk-order" },
    { name: "Gift Sets", href: "/shop?category=Drinkware%20gift%20sets" },
  ];
  const supportLinks = [
    { name: "Track Order", href: "/track-order" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact Us", href: "/contact" },
    { name: "Influencer Program", href: "/influencer" },
  ];
  const legalLinks = [
    { name: "Shipping Policy", href: "/shipping-policy" },
    { name: "Refund Policy", href: "/refund" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="group">
              <span className="font-serif text-2xl tracking-[0.18em] font-semibold text-secondary-foreground group-hover:text-primary transition-colors">GLOCASA</span>
              <span className="block text-[7px] tracking-[0.45em] text-muted-foreground mt-0.5 uppercase">Luxury Glassware</span>
            </Link>
            <p className="text-[10px] text-muted-foreground font-light leading-relaxed max-w-xs">Premium hand-blown borosilicate glassware crafted by Firozabad artisans. Designed for the modern Indian home.</p>
            <div className="flex items-center gap-2 text-[9px] text-primary font-bold uppercase tracking-widest"><Sparkles className="w-3 h-3 animate-pulse" /> Made in India</div>
          </div>
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-widest font-bold text-primary block">Shop</span>
            <div className="space-y-2">{shopLinks.map((l) => (<Link key={l.name} href={l.href} className="block text-xs text-muted-foreground hover:text-secondary-foreground transition-colors font-light">{l.name}</Link>))}</div>
          </div>
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-widest font-bold text-primary block">Support</span>
            <div className="space-y-2">{supportLinks.map((l) => (<Link key={l.name} href={l.href} className="block text-xs text-muted-foreground hover:text-secondary-foreground transition-colors font-light">{l.name}</Link>))}</div>
          </div>
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-widest font-bold text-primary block">Legal</span>
            <div className="space-y-2">{legalLinks.map((l) => (<Link key={l.name} href={l.href} className="block text-xs text-muted-foreground hover:text-secondary-foreground transition-colors font-light">{l.name}</Link>))}</div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground font-light">
          <span>© {new Date().getFullYear()} GLOCASA. All rights reserved. Noida, India.</span>
          <span>Crafted with ❤️ for aesthetic Indian homes</span>
        </div>
      </div>
    </footer>
  );
}
