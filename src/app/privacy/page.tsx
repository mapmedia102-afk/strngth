"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-muted/50 border-b border-primary/10 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <span className="text-[9px] text-primary tracking-[0.25em] uppercase font-bold">Secure Data Atelier</span>
          <h1 className="font-serif text-2xl md:text-4xl text-secondary font-bold">Privacy Policy</h1>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-8 text-left text-xs font-light text-muted-foreground leading-relaxed">
        <div className="space-y-3">
          <h2 className="font-serif text-base font-bold text-secondary uppercase tracking-wide">1. Information We Secure</h2>
          <p>
            When you purchase glassware or sign up for our loyalty points system, we collect personal contact details, including your email, phone number, and delivery coordinates. All information is secured using industry-standard AES encryption methods.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-base font-bold text-secondary uppercase tracking-wide">2. How We Optimize Your Experience</h2>
          <p>
            Your information is used solely to coordinate courier shipping milestones (via Blue Dart or Delhivery), manage your points ledger, apply active promo codes, and notify you of upcoming seasonal glassware collections. We never sell your personal information to third-party databases.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-base font-bold text-secondary uppercase tracking-wide">3. Payment Safety</h2>
          <p>
            We process all financial transactions through direct secure merchant payment gateways (UPI, Razorpay, or credit cards). Your full card details or UPI credentials never touch our local database servers.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
