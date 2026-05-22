"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Sparkles, Trophy, Award, Landmark, MapPin, Truck, ArrowRight } from "lucide-react";

export default function CustomerDashboard() {
  const { user, orders } = useApp();

  // Loyalty calculations: ₹10 spent = 1 Loyalty Point
  const pointsEarnedFromOrders = orders.reduce((sum, o) => sum + Math.floor(o.total / 10), 0);
  const totalPoints = user.loyaltyPoints + pointsEarnedFromOrders;

  // Tiers list: Bronze (< 500 pts), Silver (500 - 1500 pts), Gold (> 1500 pts)
  const loyaltyTier = totalPoints >= 1500 ? "Gold Curator" : totalPoints >= 500 ? "Silver Curator" : "Bronze Curator";
  const tierColor =
    totalPoints >= 1500
      ? "text-primary border-primary bg-primary/5"
      : totalPoints >= 500
      ? "text-slate-400 border-slate-300 bg-slate-50"
      : "text-amber-700 border-amber-500/30 bg-amber-500/5";

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-muted/50 border-b border-primary/10 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <span className="text-[9px] text-primary tracking-[0.25em] uppercase font-bold">Your Account Atelier</span>
          <h1 className="font-serif text-2xl md:text-4xl text-secondary font-bold">Customer Profile</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-12 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Left: Profile Meta and Loyalty ledger */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Bio Card */}
            <div className="border border-primary/10 rounded-2xl p-6 bg-background space-y-4">
              <div>
                <span className="text-[9px] text-primary uppercase font-bold tracking-widest block">Client Profile</span>
                <h3 className="font-serif text-lg font-bold text-secondary">{user.name}</h3>
                <span className="text-xs text-muted-foreground font-light">{user.email}</span>
              </div>

              <div className="border-t border-primary/5 pt-4">
                <span className="text-[10px] uppercase tracking-widest font-bold text-secondary block mb-2">Saved Addresses</span>
                <div className="space-y-2">
                  {user.addresses.map((addr, idx) => (
                    <div key={idx} className="flex gap-2 items-start text-xs font-light text-muted-foreground leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{addr}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Loyalty tier ledger */}
            <div className="border border-primary/10 rounded-2xl p-6 bg-background space-y-4 relative overflow-hidden">
              <div className="absolute top-4 right-4 animate-pulse">
                <Award className="w-6 h-6 text-primary" />
              </div>

              <div>
                <span className="text-[9px] text-primary uppercase font-bold tracking-widest block">Loyalty Tier Ledger</span>
                <h4 className="font-serif text-base font-bold text-secondary mt-1">{loyaltyTier}</h4>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Curator Points Balance</span>
                  <span className="font-bold text-secondary">{totalPoints} Points</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden border border-primary/5">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${Math.min(100, (totalPoints / 2000) * 100)}%` }}
                  />
                </div>
                <p className="text-[9px] text-muted-foreground font-light leading-relaxed">
                  Earn 1 Curator Point for every ₹10 spent. Unlock private champagne drops and complimentary priority Blue Dart express air upgrades at Gold level.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Past Order History log */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-primary/10 rounded-2xl bg-background p-6 space-y-6">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider block">Your Order Log ({orders.length})</span>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground font-light space-y-4">
                  <p>You haven't checked out any mouth-blown collections under your profile ledger yet.</p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 border border-secondary px-6 py-2.5 text-xs uppercase tracking-widest font-semibold text-secondary hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300"
                  >
                    Explore Shop <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-primary/5">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-light"
                    >
                      <div className="space-y-1">
                        <span className="font-serif font-bold text-secondary block">{order.id}</span>
                        <span className="text-[9px] text-muted-foreground block">
                          Total paid: <strong>₹{order.total}</strong> | Dispatch status: <strong className="uppercase text-primary">{order.status}</strong>
                        </span>
                      </div>

                      <Link
                        href={`/track-order?id=${order.id}`}
                        className="text-[10px] text-primary font-bold uppercase tracking-wider inline-flex items-center gap-1 hover:text-secondary transition-colors"
                      >
                        Track Shipment <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
