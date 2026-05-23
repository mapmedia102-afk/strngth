"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShoppingBag, ArrowRight, Trash2, Ticket, Percent, Sparkles, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity, showToast } = useApp();
  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; discount: number } | null>(null);

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

  // Fulfillment policies: free Blue Dart express delivery over ₹1499, else standard courier ₹150
  const isFreeExpress = cartSubtotal >= 1499;
  const progressToFreeExpress = Math.min(100, (cartSubtotal / 1499) * 100);
  const neededForFreeExpress = Math.max(0, 1499 - cartSubtotal);

  // Apply Coupon logic
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const codeUpper = couponCode.trim().toUpperCase();

    if (codeUpper === "GLO200") {
      if (cartSubtotal >= 899) {
        setActiveCoupon({ code: "GLO200", discount: 200 });
        showToast("Coupon GLO200 applied successfully! ₹200 saved.", "success");
      } else {
        showToast("Coupon GLO200 requires minimum cart subtotal of ₹899.", "error");
      }
    } else if (codeUpper === "FESTIVE15") {
      if (cartSubtotal >= 1499) {
        const discountAmount = Math.round(cartSubtotal * 0.15);
        setActiveCoupon({ code: "FESTIVE15", discount: discountAmount });
        showToast(`Coupon FESTIVE15 applied! 15% off (saved ₹${discountAmount}).`, "success");
      } else {
        showToast("Coupon FESTIVE15 requires minimum cart subtotal of ₹1499.", "error");
      }
    } else {
      showToast("Invalid coupon code. Try GLO200 or FESTIVE15.", "error");
    }
  };

  const finalDiscount = activeCoupon ? activeCoupon.discount : 0;
  const shippingFee = isFreeExpress ? 0 : 150;
  const finalTotal = Math.max(0, cartSubtotal - finalDiscount + shippingFee);

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-muted/50 border-b border-primary/10 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <span className="text-[9px] text-primary tracking-[0.25em] uppercase font-bold">Shopping Atelier</span>
          <h1 className="font-serif text-2xl md:text-4xl text-secondary font-bold">Your Cart Workspace</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        {cart.length === 0 ? (
          <div className="py-24 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 text-muted-foreground font-light" />
            </div>
            <h3 className="font-serif text-lg text-secondary">Your shopping cart is empty</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              You haven't added any hand-blown glassware sets to your cart yet.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 border border-secondary px-8 py-3 text-xs uppercase tracking-widest font-semibold text-secondary hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300"
            >
              Discover Drinkware <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left: Items list */}
            <div className="lg:col-span-2 space-y-6">
              {/* Blue Dart free express delivery bar */}
              <div className="border border-primary/20 bg-muted/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary animate-bounce" />
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                    {isFreeExpress ? "Blue Dart Express Air Delivery Activated!" : "Blue Dart Express Delivery Threshold"}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-primary/10">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressToFreeExpress}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground font-light leading-relaxed">
                  {isFreeExpress
                    ? "Your order qualifies for complimentary Blue Dart express delivery!"
                    : `Add glassware worth ₹${neededForFreeExpress} more to unlock complimentary premium express logistics (otherwise ₹150).`}
                </p>
              </div>

              {/* Items Card */}
              <div className="border border-primary/10 rounded-2xl bg-background overflow-hidden p-6 space-y-6">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedVariant}`}
                    className="flex flex-col sm:flex-row gap-4 border-b border-primary/5 pb-6 last:border-b-0 last:pb-0 items-start sm:items-center"
                  >
                    {/* Glass visual / Real image */}
                    <div className={`w-20 h-20 rounded bg-gradient-to-tr ${item.product.gradientTheme} flex-shrink-0 flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/5" />
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover relative z-10" />
                      ) : (
                        <div className="w-6 h-12 border border-white/50 rounded-b-md bg-white/20 relative shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product.id}`}
                        className="font-serif text-sm font-semibold text-secondary hover:text-primary transition-colors block truncate"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-[10px] text-primary tracking-widest uppercase font-medium mt-0.5">
                        {item.selectedVariant}
                      </p>

                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-primary/20 rounded">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.selectedVariant, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-muted-foreground hover:text-secondary cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-semibold text-secondary">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.selectedVariant, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-muted-foreground hover:text-secondary cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                          className="text-muted-foreground hover:text-destructive p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-left sm:text-right">
                      <span className="font-serif text-sm font-semibold text-secondary block">
                        ₹{(item.product.discountPrice || item.product.price) * item.quantity}
                      </span>
                      {item.product.discountPrice && (
                        <span className="text-[9px] text-muted-foreground line-through block">
                          ₹{item.product.price * item.quantity}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Payment Summaries */}
            <div className="space-y-6">
              {/* Coupon inputs */}
              <div className="border border-primary/10 rounded-2xl p-6 bg-background space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider">
                  <Ticket className="w-4 h-4 text-primary" />
                  <span>Promo Coupons</span>
                </div>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="E.g. GLO200"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-background border border-primary/20 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-primary text-secondary uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-secondary text-secondary-foreground text-[10px] uppercase tracking-widest font-bold hover:bg-primary hover:text-secondary transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {/* Hints */}
                <div className="space-y-1.5 text-[9px] text-muted-foreground font-light leading-relaxed">
                  <p>• <strong className="text-secondary">GLO200</strong>: Flat ₹200 off above ₹899</p>
                  <p>• <strong className="text-secondary">FESTIVE15</strong>: Flat 15% off above ₹1,499</p>
                </div>

                {activeCoupon && (
                  <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg flex justify-between items-center text-[10px] text-secondary font-semibold">
                    <span>Applied: {activeCoupon.code}</span>
                    <button
                      onClick={() => setActiveCoupon(null)}
                      className="text-muted-foreground hover:text-destructive text-[8px] uppercase tracking-widest"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="border border-primary/15 rounded-2xl p-6 bg-background space-y-4 shadow-sm">
                <span className="text-[10px] uppercase tracking-widest font-bold text-primary block">Atelier Cart Invoice</span>
                
                <div className="space-y-2 text-xs font-light">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-secondary font-semibold">₹{cartSubtotal}</span>
                  </div>
                  {activeCoupon && (
                    <div className="flex justify-between items-center text-green-600 font-medium">
                      <span>Coupon Discount</span>
                      <span>- ₹{finalDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Blue Dart Shipping</span>
                    <span className="text-secondary font-semibold">
                      {shippingFee === 0 ? <span className="text-primary font-bold">FREE</span> : `₹${shippingFee}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-primary/10 pt-4 flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest font-bold text-secondary">Final Net Total</span>
                  <span className="font-serif text-lg font-bold text-secondary">₹{finalTotal}</span>
                </div>

                <Link
                  href={{
                    pathname: "/checkout",
                    query: activeCoupon ? { coupon: activeCoupon.code } : {},
                  }}
                  className="w-full inline-flex justify-center items-center py-3.5 bg-primary text-secondary-foreground text-xs uppercase tracking-widest font-bold hover:bg-accent transition-colors duration-300 shadow-md gap-2"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
