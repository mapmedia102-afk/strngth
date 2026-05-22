"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

/* ─────────────── Type Definitions ─────────────── */

export interface Product {
  id: number;
  name: string;
  price: number;
  discountPrice?: number;
  category: string;
  description: string;
  capacity: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  variants: string[];
  tags: string[];
  gradientTheme: string;
}

export interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  selectedVariant: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  address: string;
  paymentMethod: string;
  status: string;
  date: string;
}

export interface UserProfile {
  name: string;
  email: string;
  addresses: string[];
  loyaltyPoints: number;
}

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  user: UserProfile;
  toasts: ToastMessage[];
  addToCart: (product: Product, variant: string, qty: number) => void;
  removeFromCart: (productId: number, variant: string) => void;
  updateCartQuantity: (productId: number, variant: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  addOrder: (data: Omit<Order, "id" | "status" | "date">) => Order;
  adminUpdateOrderStatus: (orderId: string, status: string) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: number) => void;
  addReview: (productId: number, review: Review) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

/* ─────────────── Product Catalog ─────────────── */

const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Fluted Ribbed Highball Tumbler Set",
    price: 1299,
    discountPrice: 999,
    category: "Glass tumblers",
    description: "Vertically fluted ribbed highball glasses crafted from lead-free borosilicate. Perfect for iced lattes, cold brews, and aesthetic kitchen shelves.",
    capacity: "400ml",
    rating: 4.8,
    reviewCount: 124,
    reviews: [
      { name: "Priya M.", rating: 5, text: "Absolutely gorgeous! The ribbed texture catches light beautifully.", date: "2026-04-12", verified: true },
      { name: "Ananya S.", rating: 5, text: "These are Pinterest-perfect. My coffee cart looks premium now.", date: "2026-03-28", verified: true },
    ],
    variants: ["Set of 2", "Set of 4", "Set of 6"],
    tags: ["bestseller", "ribbed", "café"],
    gradientTheme: "from-amber-100/50 to-orange-100/20",
  },
  {
    id: 2,
    name: "24K Gold-Rimmed Wine Goblet Pair",
    price: 2499,
    discountPrice: 1999,
    category: "Wine glasses",
    description: "Hand-painted 24K liquid gold rims on crystal-clear borosilicate stems. Designed for regal candlelit dinner parties and anniversary toasts.",
    capacity: "350ml",
    rating: 4.9,
    reviewCount: 87,
    reviews: [
      { name: "Meera K.", rating: 5, text: "The gold rim is absolutely real and stunning under candlelight.", date: "2026-05-01", verified: true },
    ],
    variants: ["Set of 2", "Set of 4"],
    tags: ["gold-rimmed", "luxury", "wedding"],
    gradientTheme: "from-yellow-100/50 to-amber-100/20",
  },
  {
    id: 3,
    name: "Aurora Iridescent Cocktail Coupe",
    price: 1899,
    discountPrice: 1499,
    category: "Margarita glasses",
    description: "Diamond-faceted aurora iridescent coupes that refract ambient light into rainbow prisms. Engineered for vintage cocktails and margaritas.",
    capacity: "300ml",
    rating: 4.7,
    reviewCount: 63,
    reviews: [
      { name: "Rohan D.", rating: 5, text: "The iridescent finish is mesmerizing. Perfect for our home bar.", date: "2026-04-20", verified: true },
    ],
    variants: ["Set of 2", "Set of 4"],
    tags: ["iridescent", "bar", "cocktail"],
    gradientTheme: "from-purple-100/40 to-pink-100/20",
  },
  {
    id: 4,
    name: "Bedside Water Carafe with Tumbler Cap",
    price: 899,
    discountPrice: 749,
    category: "Glass tumblers",
    description: "Elegant fluted bedside carafe with a matching inverted tumbler cap. Keeps your water fresh and your nightstand looking aesthetic.",
    capacity: "1L + 250ml",
    rating: 4.6,
    reviewCount: 156,
    reviews: [
      { name: "Kavya R.", rating: 4, text: "Beautiful and functional. The tumbler cap fits perfectly.", date: "2026-04-05", verified: true },
    ],
    variants: ["Clear", "Smoke Grey", "Amber Tint"],
    tags: ["carafe", "bedroom", "minimal"],
    gradientTheme: "from-sky-100/40 to-blue-100/20",
  },
  {
    id: 5,
    name: "Double-Wall Insulated Coffee Mug",
    price: 799,
    discountPrice: 649,
    category: "Coffee mugs",
    description: "Dual-walled thermal borosilicate mugs keeping espresso hot for 45 minutes. The floating beverage illusion is Instagram's most pinned café shot.",
    capacity: "350ml",
    rating: 4.8,
    reviewCount: 203,
    reviews: [
      { name: "Ishaan P.", rating: 5, text: "The floating coffee effect is real! My Instagram reels went viral.", date: "2026-03-15", verified: true },
    ],
    variants: ["Set of 2", "Set of 4"],
    tags: ["double-wall", "café", "bestseller"],
    gradientTheme: "from-orange-100/40 to-red-100/20",
  },
  {
    id: 6,
    name: "Imperial Whiskey Decanter & Glasses Set",
    price: 3499,
    discountPrice: 2999,
    category: "Drinkware gift sets",
    description: "Heavy-based geometric whiskey decanter paired with four old-fashioned tumblers. Lead-free crystal with hand-cut diamond facets.",
    capacity: "750ml + 4×300ml",
    rating: 4.9,
    reviewCount: 45,
    reviews: [
      { name: "Aditya V.", rating: 5, text: "This set elevated my home bar to a completely different level.", date: "2026-04-18", verified: true },
    ],
    variants: ["Complete Set"],
    tags: ["decanter", "gift", "bar"],
    gradientTheme: "from-stone-200/50 to-orange-100/20",
  },
  {
    id: 7,
    name: "Scallop-Edge Dessert Bowl Pair",
    price: 699,
    category: "Glass tumblers",
    description: "Vintage scalloped-edge dessert bowls with subtle amber tint. Perfect for serving kheer, ice cream, or fruit parfaits with visual elegance.",
    capacity: "250ml",
    rating: 4.5,
    reviewCount: 98,
    reviews: [
      { name: "Sneha L.", rating: 4, text: "Love the scallop edges. Unique and very photogenic for food shots.", date: "2026-03-22", verified: true },
    ],
    variants: ["Set of 2", "Set of 4"],
    tags: ["dessert", "vintage", "scallop"],
    gradientTheme: "from-rose-100/40 to-pink-100/20",
  },
  {
    id: 8,
    name: "Champagne Flute Gold Collection",
    price: 1999,
    discountPrice: 1699,
    category: "Wine glasses",
    description: "Slender champagne flutes with 24K gold-painted stems and bases. Each flute is mouth-blown by Firozabad artisans for celebrations and toasts.",
    capacity: "200ml",
    rating: 4.8,
    reviewCount: 72,
    reviews: [
      { name: "Nisha G.", rating: 5, text: "Used these at our anniversary dinner. Everyone asked where I got them!", date: "2026-05-10", verified: true },
    ],
    variants: ["Set of 2", "Set of 4", "Set of 6"],
    tags: ["champagne", "gold", "celebration"],
    gradientTheme: "from-yellow-100/40 to-amber-200/20",
  },
];

/* ─────────────── Default User ─────────────── */

const defaultUser: UserProfile = {
  name: "Aditi Roy",
  email: "aditi.roy@gmail.com",
  addresses: [
    "Flat 12B, Marigold Towers, Bandra West, Mumbai 400050",
    "Villa 7, DLF Phase 3, Sector 24, Gurgaon 122002",
  ],
  loyaltyPoints: 85,
};

/* ─────────────── Context ─────────────── */

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("glocasa_cart");
      const savedWishlist = localStorage.getItem("glocasa_wishlist");
      const savedOrders = localStorage.getItem("glocasa_orders");
      const savedUser = localStorage.getItem("glocasa_user");
      const savedProducts = localStorage.getItem("glocasa_products");
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedProducts) setProducts(JSON.parse(savedProducts));
    } catch (e) {
      console.error("Failed to hydrate state", e);
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("glocasa_cart", JSON.stringify(cart));
    localStorage.setItem("glocasa_wishlist", JSON.stringify(wishlist));
    localStorage.setItem("glocasa_orders", JSON.stringify(orders));
    localStorage.setItem("glocasa_user", JSON.stringify(user));
    localStorage.setItem("glocasa_products", JSON.stringify(products));
  }, [cart, wishlist, orders, user, products, hydrated]);

  /* ── Cart ── */

  const addToCart = useCallback((product: Product, variant: string, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.selectedVariant === variant);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.selectedVariant === variant
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { product, selectedVariant: variant, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number, variant: string) => {
    setCart((prev) => prev.filter((i) => !(i.product.id === productId && i.selectedVariant === variant)));
  }, []);

  const updateCartQuantity = useCallback((productId: number, variant: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.selectedVariant === variant ? { ...i, quantity: qty } : i
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  /* ── Wishlist ── */

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      return exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];
    });
  }, []);

  /* ── Orders ── */

  const addOrder = useCallback((data: Omit<Order, "id" | "status" | "date">) => {
    const id = `GC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const order: Order = {
      ...data,
      id,
      status: "placed",
      date: new Date().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }),
    };
    setOrders((prev) => [...prev, order]);
    // Award loyalty points (₹10 spent = 1 point)
    const pointsEarned = Math.floor(data.total / 10);
    setUser((prev) => ({ ...prev, loyaltyPoints: prev.loyaltyPoints + pointsEarned }));
    return order;
  }, []);

  const adminUpdateOrderStatus = useCallback((orderId: string, status: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  }, []);

  /* ── Products (Admin) ── */

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [...prev, product]);
  }, []);

  const deleteProduct = useCallback((productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const addReview = useCallback((productId: number, review: Review) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const newReviews = [...p.reviews, review];
        const newRating = newReviews.reduce((s, r) => s + r.rating, 0) / newReviews.length;
        return { ...p, reviews: newReviews, reviewCount: newReviews.length, rating: Math.round(newRating * 10) / 10 };
      })
    );
  }, []);

  /* ── Toast ── */

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <AppContext.Provider
      value={{
        products, cart, wishlist, orders, user, toasts,
        addToCart, removeFromCart, updateCartQuantity, clearCart,
        toggleWishlist, addOrder, adminUpdateOrderStatus,
        addProduct, deleteProduct, addReview, showToast,
      }}
    >
      {children}
      {/* Global Toast Layer */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-[200] space-y-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`px-5 py-3 rounded-lg shadow-xl text-xs font-semibold animate-in slide-in-from-right-5 fade-in duration-300 ${
                t.type === "success"
                  ? "bg-secondary text-secondary-foreground"
                  : t.type === "error"
                  ? "bg-destructive text-white"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {t.message}
            </div>
          ))}
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
