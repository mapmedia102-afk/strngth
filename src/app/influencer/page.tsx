"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Sparkles, Camera, Award, Send } from "lucide-react";

export default function InfluencerClub() {
  const { showToast } = useApp();
  const [handle, setHandle] = useState("");
  const [followers, setFollowers] = useState("10k - 50k");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle || !message) {
      showToast("Please provide your social handle and details.", "error");
      return;
    }
    showToast(`Creator application registered! We will review your portfolio within 24 hours.`, "success");
    setHandle("");
    setMessage("");
  };

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-muted/50 border-b border-primary/10 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <span className="text-[9px] text-primary tracking-[0.25em] uppercase font-bold">Creator Atelier</span>
          <h1 className="font-serif text-2xl md:text-4xl text-secondary font-bold">Influencer Partners</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
        {/* Pitch info */}
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="text-[9px] text-primary tracking-[0.2em] uppercase font-bold">Pinterest Curation Hub</span>
            <h2 className="font-serif text-xl md:text-2xl text-secondary font-bold">Join the GLOCASA Creator Club</h2>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Love capturing warm tea transitions, sparkling golden cocktails, or cozy aesthetic cafe reels? Partner with us to receive seasonal mouth-blown glassware drops, custom discount promo links, and commission royalties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-primary/10 rounded-xl p-5 bg-background space-y-2">
              <Camera className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block">PR Package Drops</span>
              <p className="text-[9px] text-muted-foreground font-light leading-relaxed">
                Complimentary glassware curations dropped at your studio door for content aesthetic backdrops.
              </p>
            </div>

            <div className="border border-primary/10 rounded-xl p-5 bg-background space-y-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block">10% Royalties</span>
              <p className="text-[9px] text-muted-foreground font-light leading-relaxed">
                Earn 10% cash payout commission on every sale made using your customized audience code.
              </p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="border border-primary/10 rounded-2xl p-6 bg-background space-y-6">
          <span className="text-[10px] uppercase tracking-widest font-bold text-primary block">Apply for Curation Drop</span>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Social Handle (Instagram / YouTube / Pinterest)</label>
              <input
                type="text"
                placeholder="E.g. @hetvaghani"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-background border border-primary/20 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-primary text-secondary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Audience Size</label>
              <select
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
                className="w-full bg-background border border-primary/20 text-xs px-2 py-2.5 rounded-lg focus:outline-none focus:border-primary text-secondary"
              >
                <option value="10k - 50k">10k - 50k Followers</option>
                <option value="50k - 100k">50k - 100k Followers</option>
                <option value="100k+">100k+ Followers</option>
                <option value="Aesthetic Creator (<10k)">Aesthetic micro-creator (&lt;10k)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Describe your aesthetic feed</label>
              <textarea
                placeholder="Share links to reels or explain what themes you create (e.g. coffee brewing, slow living vlog, bar mixology)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-background border border-primary/20 text-xs p-3 rounded-lg focus:outline-none focus:border-primary text-secondary h-24 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-secondary text-secondary-foreground text-xs uppercase tracking-widest font-bold hover:bg-primary hover:text-secondary transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shadow"
            >
              <Send className="w-3.5 h-3.5" /> Submit Creator Portfolio
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
