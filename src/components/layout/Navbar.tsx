"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, Heart, User, Menu, X, Trash2, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const { cart, wishlist, user, removeFromCart, updateCartQuantity } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity, 0);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Collections", href: "/collections" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <>
      {/* Promo Top Bar */}
      <div className="bg-secondary text-secondary-foreground py-2 text-center text-[10px] sm:text-xs tracking-widest font-light flex items-center justify-center gap-2 overflow-hidden border-b border-primary/20 z-[90]">
        <motion.div
          animate={{ x: [300, -300] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span>FESTIVAL SEASON SALE: USE CODE <strong className="text-primary font-semibold">FESTIVE15</strong> FOR 15% OFF | FREE BLUE DART SHIPPING OVER ₹1499</span>
        </motion.div>
      </div>

      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-[80] w-full glass-premium backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Mobile Toggle */}
            <div className="flex items-center md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-secondary p-2 focus:outline-none cursor-pointer">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 flex justify-center md:justify-start">
              <Link href="/" className="group">
                <span className="font-serif text-3xl tracking-[0.18em] font-semibold text-secondary hover:text-primary transition-colors duration-300">GLOCASA</span>
                <span className="block text-[7px] tracking-[0.45em] text-center md:text-left text-muted-foreground mt-0.5 uppercase group-hover:text-primary transition-colors duration-300">Luxury Glassware</span>
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.name} href={link.href} className={`relative text-xs tracking-widest uppercase font-medium transition-colors duration-300 pb-1 ${isActive ? "text-primary" : "text-secondary/70 hover:text-secondary"}`}>
                    {link.name}
                    {isActive && (
                      <motion.div layoutId="activeNavBorder" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Icon Actions */}
            <div className="flex-1 flex items-center justify-end space-x-5">
              <Link href="/wishlist" className="relative p-2 text-secondary/80 hover:text-secondary transition-colors duration-300">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-secondary-foreground text-[8px] font-bold rounded-full flex items-center justify-center border border-background">{wishlist.length}</span>
                )}
              </Link>
              <Link href="/dashboard" className="p-2 text-secondary/80 hover:text-secondary transition-colors duration-300">
                <User className="w-5 h-5" />
              </Link>
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-secondary/80 hover:text-secondary transition-colors duration-300 focus:outline-none cursor-pointer">
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-secondary text-secondary-foreground text-[8px] font-bold rounded-full flex items-center justify-center border border-background">{cartItemsCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="md:hidden glass border-t border-primary/10 overflow-hidden">
              <div className="px-4 pt-2 pb-6 space-y-4">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-secondary/80 hover:text-primary transition-colors tracking-widest uppercase">{link.name}</Link>
                ))}
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-primary hover:text-secondary transition-colors tracking-widest uppercase">Admin</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/40 z-[99] backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-primary/20 shadow-2xl z-[100] flex flex-col">
              <div className="p-6 border-b border-primary/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <span className="font-serif text-xl tracking-wider text-secondary">Your Atelier Cart</span>
                  <span className="text-xs text-muted-foreground">({cartItemsCount})</span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-muted-foreground hover:text-secondary focus:outline-none cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-muted-foreground" /></div>
                    <h3 className="font-serif text-lg text-secondary">Your cart is empty</h3>
                    <p className="text-xs text-muted-foreground max-w-[250px]">Discover luxury handcrafted glassware sets waiting for your tabletop curation.</p>
                    <Link href="/shop" onClick={() => setIsCartOpen(false)} className="inline-flex items-center gap-2 border border-secondary px-6 py-2.5 text-xs uppercase tracking-widest font-semibold text-secondary hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300">Shop Collections <ArrowRight className="w-4 h-4" /></Link>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} key={`${item.product.id}-${item.selectedVariant}`} className="flex gap-4 border-b border-primary/5 pb-6 items-start">
                      <div className={`w-20 h-20 rounded bg-gradient-to-tr ${item.product.gradientTheme} flex-shrink-0 flex items-center justify-center relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/5" />
                        <div className="w-6 h-12 border border-white/50 rounded-b-md bg-white/20 relative shadow-[0_0_8px_rgba(255,255,255,0.4)]"><div className="absolute top-1 left-[2px] right-[2px] h-[1px] bg-white/60" /></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.product.id}`} onClick={() => setIsCartOpen(false)} className="font-serif text-sm font-semibold text-secondary hover:text-primary transition-colors block truncate">{item.product.name}</Link>
                        <p className="text-[10px] text-primary tracking-widest uppercase font-medium mt-0.5">{item.selectedVariant}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-primary/20 rounded">
                            <button onClick={() => updateCartQuantity(item.product.id, item.selectedVariant, item.quantity - 1)} className="px-2.5 py-1 text-xs text-muted-foreground hover:text-secondary cursor-pointer">-</button>
                            <span className="px-2 text-xs font-semibold text-secondary">{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.product.id, item.selectedVariant, item.quantity + 1)} className="px-2.5 py-1 text-xs text-muted-foreground hover:text-secondary cursor-pointer">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id, item.selectedVariant)} className="text-muted-foreground hover:text-destructive p-1 transition-colors duration-300 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-serif text-sm font-semibold text-secondary">₹{(item.product.discountPrice || item.product.price) * item.quantity}</span>
                        {item.product.discountPrice && (<span className="block text-[9px] text-muted-foreground line-through">₹{item.product.price * item.quantity}</span>)}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-primary/10 bg-muted/30">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Estimated Subtotal</span>
                    <span className="font-serif text-lg font-bold text-secondary">₹{cartSubtotal}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-6 text-center leading-relaxed">Tax and Blue Dart premium delivery calculated during checkout. COD option available.</p>
                  <div className="space-y-3">
                    <Link href="/cart" onClick={() => setIsCartOpen(false)} className="w-full inline-flex justify-center items-center py-3 border border-secondary text-xs uppercase tracking-widest font-semibold text-secondary hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300">View Cart & Coupons</Link>
                    <Link href="/checkout" onClick={() => setIsCartOpen(false)} className="w-full inline-flex justify-center items-center py-3 bg-primary text-secondary-foreground text-xs uppercase tracking-widest font-bold hover:bg-accent transition-colors duration-300 shadow-md gap-2">Secure Checkout <ArrowRight className="w-4 h-4" /></Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
