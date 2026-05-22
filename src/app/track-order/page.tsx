"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Sparkles, Package, ClipboardCheck, ArrowRight, Truck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const { orders } = useApp();
  const [searchId, setSearchId] = useState(searchParams.get("id") || "");
  const [activeOrder, setActiveOrder] = useState<any>(
    orders.find((o) => o.id === searchParams.get("id")) || null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const order = orders.find((o) => o.id === searchId.trim().toUpperCase());
    if (order) {
      setActiveOrder(order);
    } else {
      setActiveOrder(null);
    }
  };

  // 5 fulfillment stages
  const stages = [
    { key: "placed", label: "Order Placed", desc: "Coordinates received by atelier" },
    { key: "processing", label: "Atelier Curation", desc: "Mouth-blown Firozabad bubble wrapping" },
    { key: "dispatched", label: "Blue Dart Handover", desc: "Air transit hub dispatch initiated" },
    { key: "out_for_delivery", label: "Out for Delivery", desc: "Delhivery dispatch arriving at door" },
    { key: "delivered", label: "Curation Complete", desc: "Enjoy your luxury drinkware" },
  ];

  const getStageRank = (status: string) => {
    const ranks: { [key: string]: number } = {
      placed: 0,
      processing: 1,
      dispatched: 2,
      out_for_delivery: 3,
      delivered: 4,
    };
    return ranks[status] ?? 0;
  };

  const currentRank = activeOrder ? getStageRank(activeOrder.status) : 0;

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-muted/50 border-b border-primary/10 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <span className="text-[9px] text-primary tracking-[0.25em] uppercase font-bold">Atelier Logistics</span>
          <h1 className="font-serif text-2xl md:text-4xl text-secondary font-bold">Track Shipment</h1>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-12 text-left">
        {/* Search */}
        <div className="border border-primary/10 rounded-2xl p-6 bg-background space-y-4">
          <span className="text-[10px] uppercase tracking-widest font-bold text-primary block">
            Enter Reference Coordinates
          </span>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="E.g. GC-123456"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 bg-background border border-primary/20 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-primary text-secondary uppercase"
            />
            <button
              type="submit"
              className="px-6 bg-secondary text-secondary-foreground text-[10px] uppercase tracking-widest font-bold hover:bg-primary hover:text-secondary transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              Track Order <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[9px] text-muted-foreground font-light leading-relaxed">
            Reference invoice IDs are generated instantly on placing orders and sent to customer account files.
          </p>
        </div>

        {activeOrder ? (
          <div className="space-y-8">
            {/* Header info */}
            <div className="border border-primary/15 rounded-2xl p-6 bg-background flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-primary block">
                  Reference invoice
                </span>
                <h3 className="font-serif text-lg font-bold text-secondary">{activeOrder.id}</h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase tracking-widest font-bold text-primary block">
                  Invoice Status
                </span>
                <span className="text-xs text-secondary font-bold uppercase tracking-wider">
                  {stages[currentRank].label}
                </span>
              </div>
            </div>

            {/* Stepper */}
            <div className="relative pl-8 space-y-8 border-l border-primary/20 py-2 ml-4">
              {stages.map((stage, idx) => {
                const isCompleted = idx < currentRank;
                const isCurrent = idx === currentRank;
                const isPending = idx > currentRank;

                return (
                  <div key={stage.key} className="relative">
                    {/* Circle marker */}
                    <div
                      className={`absolute -left-[41px] top-0.5 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-secondary border-secondary text-white"
                          : isCurrent
                          ? "bg-primary border-primary text-secondary-foreground glow-gold"
                          : "bg-background border-primary/20 text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <span className="text-[8px] font-bold">{idx + 1}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span
                        className={`text-xs uppercase tracking-wider font-bold block ${
                          isPending ? "text-muted-foreground font-medium" : "text-secondary"
                        }`}
                      >
                        {stage.label}
                        {isCurrent && (
                          <span className="ml-2 bg-primary/15 border border-primary/30 text-primary text-[7px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest animate-pulse">
                            Active Step
                          </span>
                        )}
                      </span>
                      <p className="text-[10px] text-muted-foreground font-light leading-relaxed">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          searchId && (
            <div className="border border-destructive/20 bg-destructive/5 rounded-xl p-4 text-center text-xs text-secondary font-semibold">
              No matching orders found under reference ID &ldquo;{searchId.toUpperCase()}&rdquo;. Verify your entry
              or check your dashboard account log.
            </div>
          )
        )}
      </section>

      <Footer />
    </main>
  );
}

export default function TrackOrder() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
