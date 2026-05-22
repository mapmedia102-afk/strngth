"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Sparkles, Flame, ShieldAlert, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-muted/50 border-b border-primary/10 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        <div className="max-w-3xl mx-auto px-4 space-y-4 relative">
          <span className="text-[9px] text-primary tracking-[0.25em] uppercase font-bold">The Heritage of Firozabad</span>
          <h1 className="font-serif text-3xl md:text-5xl text-secondary font-bold leading-tight">
            Mouth-Blown Borosilicate Masterpieces
          </h1>
          <p className="text-xs text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
            GLOCASA was born from a singular passion: bringing premium, mouth-blown borosilicate craftsmanship from India's ancient glass capitals directly to modern lifestyle tables.
          </p>
        </div>
      </section>

      {/* Brand pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="border border-primary/10 rounded-2xl p-6 bg-background space-y-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-semibold text-secondary">Artisanal Hearth Fire</h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Every cup is meticulously blown by artisans holding centuries-old lineage in glass molding, making every ribbed fold and edge absolutely unique.
          </p>
        </div>

        <div className="border border-primary/10 rounded-2xl p-6 bg-background space-y-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-semibold text-secondary">Lead-Free Health Purity</h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            We use premium borosilicate glass, entirely non-toxic, heat-resistant, microwave safe, and 100% free of heavy leads or chemical glaze.
          </p>
        </div>

        <div className="border border-primary/10 rounded-2xl p-6 bg-background space-y-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-semibold text-secondary">The Gold-Rimmed Royale</h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Our premium selections are gilded with real 24-karat gold liquid rims, adding an ethereal regal border that elevates drink aesthetic standards.
          </p>
        </div>
      </section>

      {/* Narrative grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
        <div className="border border-primary/15 rounded-3xl bg-background overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          {/* Glass design motif */}
          <div className="bg-muted p-12 flex items-center justify-center min-h-[300px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/30 to-purple-100/20" />
            <div className="w-24 h-48 border-4 border-primary/40 rounded-b-3xl bg-background/30 backdrop-blur-md relative shadow-2xl flex items-end p-4">
              <div className="w-full bg-primary/20 h-1/3 rounded-b-2xl animate-pulse" />
            </div>
          </div>

          {/* Details */}
          <div className="p-8 md:p-12 space-y-6 flex flex-col justify-center text-left">
            <span className="text-[9px] text-primary tracking-[0.2em] uppercase font-bold">Uncompromising Standard</span>
            <h2 className="font-serif text-xl md:text-3xl text-secondary font-bold leading-tight">
              Designed for visual brilliance, built for daily luxury.
            </h2>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              We reject the monotonous, bulk plastic-molded cups that populate most dining cabinets. A glass isn't merely a vessel; it defines the temperature, visual dispersion, and spiritual enjoyment of your fine cold brews, vintage wines, and floral teas.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground text-xs uppercase tracking-widest font-bold hover:bg-primary hover:text-secondary transition-colors duration-300 shadow"
              >
                Explore Bestsellers <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
