"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is GLOCASA glassware safe to put in the microwave or dishwasher?",
      a: "Yes. All our products are crafted from 100% premium lead-free borosilicate glass, which tolerates thermal shifts between -20°C and 150°C. They are completely microwave safe. While they are dishwasher safe, we recommend hand washing gold-rimmed collections with mild soap to preserve their brilliance.",
    },
    {
      q: "What shipping logistics and fulfillment guidelines do you follow?",
      a: "For all orders over ₹1,499, we provide complimentary Blue Dart Express Air delivery (otherwise standard surface courier charges of ₹150 apply). Surface deliveries arrive in 4-6 business days, while express air parcels arrive within 2 business days.",
    },
    {
      q: "Are the gold rims painted, or do they feature genuine gold?",
      a: "Our signature gold-rimmed collections feature genuine 24K gold liquid hand-gilded onto the glass edges by master decorators. This ensures a deep metallic premium glow that won't flake or peel off.",
    },
    {
      q: "Can I customize variants or request bulk hospitality curation orders?",
      a: "Absolutely. We routinely supply custom mouth-blown sets to upscale cafes, hotels, boutique restaurants, and corporate gift hampers. Reach out via our /bulk-order workspace to get catalog quotes.",
    },
    {
      q: "What is your refund and return policy?",
      a: "We have an 'Easy 10-day return policy'. If any glass arrives with transit fractures or surface chips, email concierge@glocasa.in with visual proof, and we will ship out complimentary brand-new replacements immediately.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-muted/50 border-b border-primary/10 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <span className="text-[9px] text-primary tracking-[0.25em] uppercase font-bold">Support Database</span>
          <h1 className="font-serif text-2xl md:text-4xl text-secondary font-bold">Frequently Asked Questions</h1>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-6 text-left">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="border border-primary/10 rounded-2xl bg-background overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 flex justify-between items-center text-xs font-bold text-secondary uppercase tracking-wider text-left gap-4 hover:bg-muted/30 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  {faq.q}
                </span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
              </button>

              {isOpen && (
                <div className="p-5 pt-0 border-t border-primary/5 text-xs text-muted-foreground font-light leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </section>

      <Footer />
    </main>
  );
}
