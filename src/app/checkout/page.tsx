"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Sparkles, MapPin, Truck, CreditCard, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, user, addOrder, clearCart, showToast } = useApp();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(user.addresses[0] || "");
  const [customAddress, setCustomAddress] = useState("");
  const [shippingOption, setShippingOption] = useState<"standard" | "express">("standard");
  const [paymentOption, setPaymentOption] = useState<"cod" | "upi" | "card">("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

  // Apply Coupon discount from query
  const couponQuery = searchParams.get("coupon") || "";
  let finalDiscount = 0;
  if (couponQuery === "GLO200" && cartSubtotal >= 899) finalDiscount = 200;
  if (couponQuery === "FESTIVE15" && cartSubtotal >= 1499) finalDiscount = Math.round(cartSubtotal * 0.15);

  const shippingFee = cartSubtotal >= 1499 ? 0 : shippingOption === "express" ? 250 : 150;
  const finalTotal = Math.max(0, cartSubtotal - finalDiscount + shippingFee);

  // Redirect if cart empty
  useEffect(() => {
    if (cart.length === 0 && !isProcessing) {
      router.push("/cart");
    }
  }, [cart, router, isProcessing]);

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    // Simulate Razorpay/UPI sandbox loading spin
    setTimeout(() => {
      const placedOrder = addOrder({
        items: cart,
        subtotal: cartSubtotal,
        discount: finalDiscount,
        total: finalTotal,
        address: address === "custom" ? customAddress : address,
        paymentMethod: paymentOption.toUpperCase(),
      });

      setIsProcessing(false);
      clearCart();
      showToast("Order placed successfully! Namaste.", "success");

      // Redirect to shipment tracking stepper
      router.push(`/track-order?id=${placedOrder.id}`);
    }, 2500);
  };

  if (cart.length === 0) return null;

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-muted/50 border-b border-primary/10 py-10 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <span className="text-[9px] text-primary tracking-[0.25em] uppercase font-bold">Secure Gateway</span>
          <h1 className="font-serif text-2xl md:text-3xl text-secondary font-bold">Atelier Secure Checkout</h1>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full text-left">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Checkout Steps */}
          <div className="lg:col-span-2 space-y-8">
            {/* Address Stepper */}
            <div
              className={`border rounded-2xl p-6 bg-background transition-all ${
                step === 1 ? "border-primary shadow-md" : "border-primary/15"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                    1. Delivery Coordinates
                  </span>
                </div>
                {step > 1 && (
                  <button
                    onClick={() => setStep(1)}
                    className="text-[10px] text-primary font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>

              {step === 1 ? (
                <div className="space-y-4">
                  {user.addresses.map((addr, idx) => (
                    <label
                      key={idx}
                      className={`flex gap-3 items-start p-4 rounded-xl border cursor-pointer transition-all ${
                        address === addr ? "border-primary bg-primary/5" : "border-primary/10 hover:border-primary/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr}
                        checked={address === addr}
                        onChange={() => setAddress(addr)}
                        className="mt-1 accent-primary"
                      />
                      <div className="text-xs text-secondary leading-relaxed font-light">
                        <span className="font-bold text-[10px] uppercase block text-primary mb-1">
                          Saved Address {idx + 1}
                        </span>
                        {addr}
                      </div>
                    </label>
                  ))}

                  <label
                    className={`flex gap-3 items-start p-4 rounded-xl border cursor-pointer transition-all ${
                      address === "custom" ? "border-primary bg-primary/5" : "border-primary/10 hover:border-primary/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value="custom"
                      checked={address === "custom"}
                      onChange={() => setAddress("custom")}
                      className="mt-1 accent-primary"
                    />
                    <div className="text-xs text-secondary leading-relaxed font-light w-full">
                      <span className="font-bold text-[10px] uppercase block text-primary mb-1">
                        Use Custom Address
                      </span>
                      {address === "custom" && (
                        <textarea
                          placeholder="Provide detailed shipping coordinates (House, street, city, pin code)..."
                          value={customAddress}
                          onChange={(e) => setCustomAddress(e.target.value)}
                          className="w-full bg-background border border-primary/20 text-xs p-3 rounded-lg focus:outline-none focus:border-primary text-secondary mt-2 h-20"
                        />
                      )}
                    </div>
                  </label>

                  <button
                    onClick={() => {
                      if (address === "custom" && !customAddress.trim()) {
                        showToast("Please provide detailed shipping coordinates.", "error");
                        return;
                      }
                      setStep(2);
                    }}
                    className="w-full inline-flex justify-center items-center py-3 bg-secondary text-secondary-foreground text-xs uppercase tracking-widest font-bold hover:bg-primary hover:text-secondary transition-all cursor-pointer shadow gap-2"
                  >
                    Continue to Shipping <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  Shipping to: {address === "custom" ? customAddress : address}
                </p>
              )}
            </div>

            {/* Shipping options */}
            <div
              className={`border rounded-2xl p-6 bg-background transition-all ${
                step === 2 ? "border-primary shadow-md" : "border-primary/15"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                    2. Shipping Logistics
                  </span>
                </div>
                {step > 2 && (
                  <button
                    onClick={() => setStep(2)}
                    className="text-[10px] text-primary font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>

              {step === 2 ? (
                <div className="space-y-4">
                  <label
                    className={`flex gap-3 items-center p-4 rounded-xl border cursor-pointer transition-all ${
                      shippingOption === "standard"
                        ? "border-primary bg-primary/5"
                        : "border-primary/10 hover:border-primary/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingOption === "standard"}
                      onChange={() => setShippingOption("standard")}
                      className="accent-primary"
                    />
                    <div className="text-xs text-secondary leading-relaxed font-light">
                      <span className="font-bold text-[10px] uppercase block text-primary mb-0.5">
                        Delhivery Surface Courier
                      </span>
                      Delivery in 4-6 business days. {cartSubtotal >= 1499 ? "Complimentary" : "₹150 charge"}
                    </div>
                  </label>

                  <label
                    className={`flex gap-3 items-center p-4 rounded-xl border cursor-pointer transition-all ${
                      shippingOption === "express"
                        ? "border-primary bg-primary/5"
                        : "border-primary/10 hover:border-primary/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingOption === "express"}
                      onChange={() => setShippingOption("express")}
                      className="accent-primary"
                    />
                    <div className="text-xs text-secondary leading-relaxed font-light">
                      <span className="font-bold text-[10px] uppercase block text-primary mb-0.5">
                        Blue Dart Express Air Courier
                      </span>
                      Delivery in 2 business days. {cartSubtotal >= 1499 ? "Complimentary" : "₹250 charge"}
                    </div>
                  </label>

                  <button
                    onClick={() => setStep(3)}
                    className="w-full inline-flex justify-center items-center py-3 bg-secondary text-secondary-foreground text-xs uppercase tracking-widest font-bold hover:bg-primary hover:text-secondary transition-all cursor-pointer shadow gap-2"
                  >
                    Continue to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                step > 2 && (
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Logistics:{" "}
                    {shippingOption === "express"
                      ? "Blue Dart Express Air Courier"
                      : "Delhivery Surface Courier"}
                  </p>
                )
              )}
            </div>

            {/* Payment Portal */}
            <div
              className={`border rounded-2xl p-6 bg-background transition-all ${
                step === 3 ? "border-primary shadow-md" : "border-primary/15"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                    3. Payment Merchant
                  </span>
                </div>
              </div>

              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "upi", label: "Razorpay / UPI", desc: "Instant checkout" },
                      { id: "card", label: "Credit Card", desc: "256-bit Secure" },
                      { id: "cod", label: "Cash on Delivery", desc: "Pay at door" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setPaymentOption(opt.id as any)}
                        className={`p-4 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5 ${
                          paymentOption === opt.id
                            ? "border-primary bg-primary/5"
                            : "border-primary/10 hover:border-primary/30"
                        }`}
                      >
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                          {opt.label}
                        </span>
                        <span className="text-[8px] text-muted-foreground font-light block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>

                  {paymentOption !== "cod" && (
                    <div className="border border-primary/20 bg-muted/40 rounded-xl p-4 flex gap-3 items-center">
                      <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
                      <div className="text-[10px] text-muted-foreground font-light leading-relaxed">
                        <strong className="text-secondary block mb-0.5">256-bit Merchant Encryption</strong>
                        Your card and personal account details are fully secured under direct merchant protocols.
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full inline-flex justify-center items-center py-4 bg-primary text-secondary-foreground text-xs uppercase tracking-widest font-bold hover:bg-accent transition-colors duration-300 shadow-md gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? "Connecting securely..." : `Place Order (₹${finalTotal})`}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Checkout sidebar summary */}
          <div className="border border-primary/15 rounded-2xl p-6 bg-background space-y-4 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest font-bold text-primary block">
              Atelier Order Checkout
            </span>

            <div className="divide-y divide-primary/5">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedVariant}`}
                  className="py-3 flex justify-between items-center text-xs"
                >
                  <div>
                    <span className="font-semibold text-secondary block">{item.product.name}</span>
                    <span className="text-[9px] text-muted-foreground font-light">
                      Qty: {item.quantity} | {item.selectedVariant}
                    </span>
                  </div>
                  <span className="font-serif font-bold text-secondary">
                    ₹{(item.product.discountPrice || item.product.price) * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-primary/10 pt-4 space-y-2 text-xs font-light">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-secondary font-semibold">₹{cartSubtotal}</span>
              </div>
              {finalDiscount > 0 && (
                <div className="flex justify-between items-center text-green-600 font-medium">
                  <span>Coupon ({couponQuery})</span>
                  <span>- ₹{finalDiscount}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Shipping fee</span>
                <span className="text-secondary font-semibold">
                  {shippingFee === 0 ? <span className="text-primary font-bold">FREE</span> : `₹${shippingFee}`}
                </span>
              </div>
            </div>

            <div className="border-t border-primary/10 pt-4 flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest font-bold text-secondary">Final Net Total</span>
              <span className="font-serif text-lg font-bold text-secondary">₹{finalTotal}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Loading Modal overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[500] flex flex-col items-center justify-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full border-t-2 border-primary animate-spin" />
            <span className="text-[9px] text-primary tracking-[0.25em] uppercase font-bold animate-pulse">
              Securing connection
            </span>
            <h3 className="font-serif text-lg text-white font-semibold">Connecting to payment gateway...</h3>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

export default function Checkout() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
