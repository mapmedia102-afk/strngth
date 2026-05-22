"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RefundPolicy() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-muted/50 border-b border-primary/10 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <span className="text-[9px] text-primary tracking-[0.25em] uppercase font-bold">Atelier Guarantee</span>
          <h1 className="font-serif text-2xl md:text-4xl text-secondary font-bold">Refund & Return Policy</h1>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-8 text-left text-xs font-light text-muted-foreground leading-relaxed">
        <div className="space-y-3">
          <h2 className="font-serif text-base font-bold text-secondary uppercase tracking-wide">10-Day Replacements & Returns</h2>
          <p>
            At GLOCASA, we want you to experience utmost visual joy with our mouth-blown masterpieces. We offer an easy <strong>10-Day Replacement Window</strong> from the date of package delivery.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-base font-bold text-secondary uppercase tracking-wide">Transit Damage Coverage</h2>
          <p>
            Glass is inherently delicate, and even with our triple-layered bubble box wrap, visual hairline cracks can occasionally occur in long transit runs.
          </p>
          <p>
            In the event that your drinkware set arrives fractured, simply email us at <strong>concierge@glocasa.in</strong> with pictures of the damaged items and your reference order ID (GC-XXXXXX) within 10 days. We will dispatch a brand-new identical set of mouth-blown glasses completely free of cost. No return of the broken shards is required.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-base font-bold text-secondary uppercase tracking-wide">Change of Mind Curation Swap</h2>
          <p>
            If you decide the color, size, or pattern of your ordered glassware does not perfectly match your dining room aesthetic, you may request a swap for another collection within 10 days of delivery. For aesthetic swaps, the glassware must be absolutely unused and returned in its original bubble carton packaging. A flat processing fee of ₹150 applies for return logistics pickup.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
