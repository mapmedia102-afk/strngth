"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Collections() {
  const collections = [
    {
      id: "pinterest-cafe",
      name: "Pinterest Café Aesthetic",
      desc: "Warm tones, fluted vertical ridges, and double-wall illusions made for home brewers.",
      category: "Coffee mugs",
      bgGradient: "from-amber-100/60 to-orange-100/30",
      itemCount: 4,
    },
    {
      id: "24k-gold-royale",
      name: "24K Gold-Rimmed Royale",
      desc: "Delicate liquid gold hand-painted borders atop pristine crystal borosilicate goblets.",
      category: "Wine glasses",
      bgGradient: "from-yellow-100/60 to-amber-200/30",
      itemCount: 3,
    },
    {
      id: "imperial-bar-cart",
      name: "Imperial Bar Cart",
      desc: "Weighted whiskey decanters and heavy geometric tumblers designed for elegant evenings.",
      category: "Drinkware gift sets",
      bgGradient: "from-stone-200/60 to-amber-100/30",
      itemCount: 2,
    },
    {
      id: "bespoke-gifting",
      name: "Bespoke Gifting Chests",
      desc: "Elegantly curated luxury pairs complete with robust protective foam velvet casings.",
      category: "Glass tumblers",
      bgGradient: "from-rose-100/50 to-pink-100/30",
      itemCount: 3,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-muted/50 border-b border-primary/10 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <span className="text-[9px] text-primary tracking-[0.25em] uppercase font-bold">Curated Portfolios</span>
          <h1 className="font-serif text-2xl md:text-4xl text-secondary font-bold">Atelier Collections</h1>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col, idx) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group bg-background border border-primary/15 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500"
            >
              {/* Glass Art Box Visualizer */}
              <div className={`aspect-[16/10] bg-gradient-to-tr ${col.bgGradient} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/5" />
                <div className="absolute top-4 left-4 flex items-center gap-1 bg-background/80 px-3 py-1 rounded-full text-[9px] font-bold text-secondary uppercase tracking-widest border border-primary/10">
                  <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                  <span>{col.itemCount} Atelier Items</span>
                </div>
                
                {/* Handcrafted fluted visual */}
                <div className="w-20 h-40 border-2 border-white/60 rounded-b-3xl bg-white/20 shadow-[0_12px_32px_rgba(255,255,255,0.45)] group-hover:scale-105 transition-transform duration-500" />
              </div>

              {/* Editorial context */}
              <div className="p-6 space-y-3">
                <span className="text-[9px] text-primary uppercase font-bold tracking-widest">{col.category} Series</span>
                <h3 className="font-serif text-xl font-bold text-secondary">{col.name}</h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">{col.desc}</p>
                <div className="pt-2">
                  <Link
                    href={`/shop?category=${encodeURIComponent(col.category)}`}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    Explore Atelier Line <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
