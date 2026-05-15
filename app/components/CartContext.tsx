"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CartItem = {
  id: string;
  model: string;
  storage: string;
  color: string;
  category: string;
  brand: string;
  condition: string;
  price: number;
  discount_price: number | null;
  image: string | null;
  free_case: boolean;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
  isInCart: (id: string) => boolean;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("phonesai_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    localStorage.setItem("phonesai_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + (item.discount_price ?? item.price), 0);
  const count = items.length;
  const isInCart = (id: string) => items.some((i) => i.id === id);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, count, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}