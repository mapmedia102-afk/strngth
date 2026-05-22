"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Truck, ShieldCheck, Clock } from "lucide-react";

export default function ShippingPolicy() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-muted/50 border-b border-primary/10 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <span className="text-[9px] text-primary tracking-[0.25em] uppercase font-bold">Logistics & Curation Guidelines</span>
          <h1 className="font-serif text-2xl md:text-4xl text-secondary font-bold">Shipping Policy</h1>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-8 text-left text-xs font-light text-muted-foreground leading-relaxed">
        <div className="space-y-3">
          <h2 className="font-serif text-base font-bold text-secondary uppercase tracking-wide">1. Hand-blown dispatch stages</h2>
          <p>
            Because each GLOCASA piece is custom mouth-blown by Indian glass craftsmen, we process orders within 1 to 2 business days. During this time, each glass goes through a rigorous visual bubble-inspection test and custom bubble-insulated foam box packing.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-base font-bold text-secondary uppercase tracking-wide">2. Delivery courier partners</h2>
          <p>
            We use premier logistics networks to ensure transit security for delicate glassware items:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Delhivery Surface Courier:</strong> Standard dispatch option across 24,000 pincodes in India. Standard delivery arrives within 4-6 business days. Free on orders above ₹1,499; flat ₹150 below.
            </li>
            <li>
              <strong>Blue Dart Express Air Courier:</strong> Premium express dispatch option. Priority air transit arrives at doorsteps within 2 business days. Complimentary upgrade on high-order curations over ₹1,499.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-base font-bold text-secondary uppercase tracking-wide">3. Fracture Transit Cover</h2>
          <p>
            Every single shipment is covered under our 100% Curation Transit Cover. If any cup or coaster arrives fractured, chipped, or broken due to delivery impacts, email our concierge desk at concierge@glocasa.in with visual proof of the carton within 10 days, and a brand-new mouth-blown replacement set will be dispatched immediately.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
