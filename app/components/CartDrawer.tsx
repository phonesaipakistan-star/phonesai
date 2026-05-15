"use client";

import { useCart } from "./CartContext";
import { useState } from "react";

export default function CartDrawer() {
  const { items, removeItem, clearCart, total, count } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round"/>
          <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="hidden sm:inline">Cart</span>
        {count > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-md flex flex-col bg-[#0a0a0a] border-l border-white/10 shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white">Cart</h2>
            {count > 0 && (
              <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-2.5 py-0.5 text-xs text-blue-300">
                {count} item{count !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/50 transition hover:text-white"
          >✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <p className="text-4xl mb-4">🛒</p>
              <p className="text-white/40 font-medium">Cart is empty</p>
              <p className="text-xs text-white/25 mt-1">Add phones from the shop</p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 rounded-xl border border-white/15 px-6 py-2.5 text-sm text-white/60 transition hover:text-white"
              >
                Browse Shop →
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                {/* Image */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  {item.image ? (
                    <img src={item.image} alt={item.model} className="h-full w-full object-contain p-1" />
                  ) : (
                    <span className="text-2xl">📱</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{item.model}</p>
                  <p className="text-xs text-white/50 mt-0.5">{item.storage} • {item.color}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs ${
                      item.category === "PTA" ? "border-green-500/30 text-green-300" :
                      item.category === "Non-PTA" ? "border-blue-500/30 text-blue-300" :
                      item.category === "JV" ? "border-amber-500/30 text-amber-300" :
                      "border-purple-500/30 text-purple-300"
                    }`}>{item.category}</span>
                    {item.free_case && item.condition === "Used" && (
                      <span className="text-xs text-green-300">🎁 Free Case</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-bold text-white">
                    Rs. {(item.discount_price ?? item.price).toLocaleString()}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="shrink-0 self-start rounded-lg border border-red-500/20 p-1.5 text-red-400 transition hover:bg-red-500/10"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-white/10 px-6 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Total</span>
              <span className="text-xl font-extrabold text-white">Rs. {total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-white/30">
              <span>Free delivery included</span>
              <span>7-Day Warranty ✓</span>
            </div>
            <a
              href={`/checkout?cart=true`}
              onClick={() => setIsOpen(false)}
              className="block w-full rounded-2xl bg-blue-500 py-4 text-center text-sm font-bold text-white transition hover:bg-blue-400"
            >
              Checkout → Rs. {total.toLocaleString()}
            </a>
            <button
              onClick={clearCart}
              className="w-full text-center text-xs text-white/25 transition hover:text-white/50"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}