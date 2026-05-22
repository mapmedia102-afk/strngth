"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send, HelpCircle } from "lucide-react";

export default function Contact() {
  const { showToast } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast("Please fill in all fields before sending.", "error");
      return;
    }
    showToast("Thank you! Your message has been sent to our concierge desk.", "success");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-muted/50 border-b border-primary/10 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <span className="text-[9px] text-primary tracking-[0.25em] uppercase font-bold">Concierge Support</span>
          <h1 className="font-serif text-2xl md:text-4xl text-secondary font-bold">Reach Out</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
        {/* Info columns */}
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="text-[9px] text-primary tracking-[0.2em] uppercase font-bold">Response Timelines</span>
            <h2 className="font-serif text-xl md:text-2xl text-secondary font-bold">How can we help?</h2>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Have an issue with shipping coordinates, bulk hotel requests, or coupon applications? Our dedicated concierge support evaluates inquiries within 12 hours.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block">Email Support</span>
                <span className="text-xs text-muted-foreground font-light">concierge@glocasa.in</span>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block">Hotline Concierge</span>
                <span className="text-xs text-muted-foreground font-light">+91 99203 45281 (Mon-Sat, 10 AM - 7 PM)</span>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block">Creative Showroom</span>
                <span className="text-xs text-muted-foreground font-light">
                  Fluted Glass Atelier, Level 3, Maker Maxity, Bandra Kurla Complex, Mumbai, MH - 400051
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="border border-primary/10 rounded-2xl p-6 md:p-8 bg-background space-y-6">
          <span className="text-[10px] uppercase tracking-widest font-bold text-primary block">Send Query Envelope</span>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Your Name</label>
              <input
                type="text"
                placeholder="Het Vaghani"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border border-primary/20 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-primary text-secondary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Your Email Address</label>
              <input
                type="email"
                placeholder="het@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-primary/20 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-primary text-secondary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Your Message</label>
              <textarea
                placeholder="What details would you like to inquire about?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-background border border-primary/20 text-xs p-3 rounded-lg focus:outline-none focus:border-primary text-secondary h-24 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-secondary text-secondary-foreground text-xs uppercase tracking-widest font-bold hover:bg-primary hover:text-secondary transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shadow"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch Inquiry
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
