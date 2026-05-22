"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Sparkles, Calculator, Hotel, Send } from "lucide-react";

export default function BulkOrder() {
  const { showToast } = useApp();
  const [org, setOrg] = useState("");
  const [quantity, setQuantity] = useState("50");
  const [glassType, setGlassType] = useState("Amber Gold Tumblers");
  const [message, setMessage] = useState("");

  const calculatedQuote = Math.round(Number(quantity) * 280); // Bulk discount baseline price of ₹280 per glass

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!org || !message) {
      showToast("Please specify your company/hotel name and curation goals.", "error");
      return;
    }
    showToast(`Bulk curation quote query registered! An agent will call within 12 hours.`, "success");
    setOrg("");
    setMessage("");
  };

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-muted/50 border-b border-primary/10 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <span className="text-[9px] text-primary tracking-[0.25em] uppercase font-bold">Hospitality & B2B Curation</span>
          <h1 className="font-serif text-2xl md:text-4xl text-secondary font-bold">Bulk Curation</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
        {/* Quote Calculator */}
        <div className="border border-primary/10 rounded-2xl p-6 bg-background space-y-6">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Estimated Bulk Pricing</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Select Glassware Design</label>
              <select
                value={glassType}
                onChange={(e) => setGlassType(e.target.value)}
                className="w-full bg-background border border-primary/20 text-xs px-2 py-2.5 rounded-lg focus:outline-none focus:border-primary text-secondary"
              >
                <option value="Amber Gold Tumblers">Amber Gold Tumblers</option>
                <option value="Royal Wine Goblets">Royal Wine Goblets</option>
                <option value="Ribbed Cocktail Coupes">Ribbed Cocktail Coupes</option>
                <option value="Iridescent Coffee Mugs">Iridescent Coffee Mugs</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Desired Quantity (Minimum 50)</label>
              <input
                type="number"
                min="50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-background border border-primary/20 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-primary text-secondary"
              />
            </div>

            <div className="border-t border-primary/10 pt-4 flex justify-between items-center bg-primary/5 p-4 rounded-xl">
              <div>
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">Estimated Quote</span>
                <span className="text-[10px] text-primary block leading-relaxed font-light">Custom packaging & logistics included</span>
              </div>
              <span className="font-serif text-xl font-bold text-secondary">₹{calculatedQuote.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Requirements form */}
        <div className="border border-primary/10 rounded-2xl p-6 bg-background space-y-6">
          <div className="flex items-center gap-2">
            <Hotel className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Atelier B2B Concierge Form</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Establishment / Company Name</label>
              <input
                type="text"
                placeholder="E.g. Pinterest Cafe Mumbai"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                className="w-full bg-background border border-primary/20 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-primary text-secondary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Describe your custom design goals</label>
              <textarea
                placeholder="Do you require specific gold gilding logos, visual shapes, or tailored box wrapping structures?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-background border border-primary/20 text-xs p-3 rounded-lg focus:outline-none focus:border-primary text-secondary h-24 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-secondary text-secondary-foreground text-xs uppercase tracking-widest font-bold hover:bg-primary hover:text-secondary transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shadow"
            >
              <Send className="w-3.5 h-3.5" /> Request Quotation Sheet
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
