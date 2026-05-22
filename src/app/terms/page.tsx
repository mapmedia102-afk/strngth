"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsOfService() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-muted/50 border-b border-primary/10 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <span className="text-[9px] text-primary tracking-[0.25em] uppercase font-bold">Atelier Code of Conduct</span>
          <h1 className="font-serif text-2xl md:text-4xl text-secondary font-bold">Terms of Service</h1>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-8 text-left text-xs font-light text-muted-foreground leading-relaxed">
        <div className="space-y-3">
          <h2 className="font-serif text-base font-bold text-secondary uppercase tracking-wide">1. Agreement to Terms</h2>
          <p>
            By accessing the GLOCASA website and purchasing our hand-blown lead-free borosilicate drinkware, you agree to comply with our shipping, refund, and loyalty points guidelines.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-base font-bold text-secondary uppercase tracking-wide">2. Product Characteristics</h2>
          <p>
            Because each borosilicate glass cup is crafted individually by human glassblowers using thermal hearths, slight micro-variations, subtle ripples, or tiny air bubbles are natural, expected characteristics of artisanal glass. These are not defects but markers of authentic craftsmanship.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-base font-bold text-secondary uppercase tracking-wide">3. Account Use</h2>
          <p>
            You are responsible for protecting the credentials of your customer profile, through which loyalty points and order references are tracked.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
