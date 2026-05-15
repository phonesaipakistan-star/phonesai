"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "./CartContext";

const openUstaadJi = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("openUstaadJi"));
  }
};

export default function Navbar() {
  const [navVisible, setNavVisible] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { items, removeItem, clearCart, total, count } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 80) setNavVisible(true);
      else if (currentY > lastScrollY.current + 10) setNavVisible(false);
      else if (currentY < lastScrollY.current - 10) setNavVisible(true);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-30 border-b border-white/15 bg-black/90 backdrop-blur-xl transition-transform duration-300 ${navVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">

          {/* Logo + Wordmark */}
          <a href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <img src="/logo.png" alt="PhonesAI" className="h-8 w-auto sm:h-9" />
            <span className="text-base font-semibold tracking-wide sm:text-lg">
              <span className="text-white">Phones</span><span className="text-blue-500">AI</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/80">
            <a href="/" className="transition hover:text-white">Home</a>
            <a href="/shop" className="transition hover:text-white">Shop</a>
            <button onClick={openUstaadJi} className="transition hover:text-white">Ustaad Ji</button>
            <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Contact</a>
            <button onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-white/40 hover:text-white">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Cart</span>
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">{count}</span>
              )}
            </button>
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => setCartOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white">{count}</span>
              )}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full border border-white/15">
              <span className={`h-0.5 w-4 rounded-full bg-white transition-all duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`h-0.5 w-4 rounded-full bg-white transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-4 rounded-full bg-white transition-all duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/95 px-4 py-4 space-y-1">
            <a href="/" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white">
              🏠 Home
            </a>
            <a href="/shop" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white">
              📱 Shop
            </a>
            <button onClick={() => { openUstaadJi(); setMenuOpen(false); }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white">
              🤖 Ustaad Ji
            </button>
            <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white">
              💬 Contact on WhatsApp
            </a>
            <div className="pt-2 border-t border-white/10">
              <button onClick={() => { setCartOpen(true); setMenuOpen(false); }}
                className="flex w-full items-center justify-between rounded-xl bg-blue-500/10 border border-blue-400/20 px-4 py-3 text-sm font-semibold text-blue-300">
                <span>🛒 View Cart</span>
                {count > 0 && <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">{count} items</span>}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Cart Backdrop */}
      {cartOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
      )}

      {/* Cart Drawer */}
      <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-md flex flex-col bg-[#0a0a0a] border-l border-white/10 shadow-2xl transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white">Your Cart</h2>
            {count > 0 && (
              <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-2.5 py-0.5 text-xs text-blue-300">{count} item{count !== 1 ? "s" : ""}</span>
            )}
          </div>
          <button onClick={() => setCartOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/50 transition hover:text-white">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <p className="text-4xl mb-4">🛒</p>
              <p className="text-white/40 font-medium">Cart is empty</p>
              <p className="text-xs text-white/25 mt-1">Add phones from the shop</p>
              <button onClick={() => { setCartOpen(false); window.location.href = "/shop"; }}
                className="mt-6 rounded-xl border border-white/15 px-6 py-2.5 text-sm text-white/60 transition hover:text-white">
                Browse Shop →
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  {item.image ? <img src={item.image} alt={item.model} className="h-full w-full object-contain p-1" /> : <span className="text-xl">📱</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate">{item.model}</p>
                  <p className="text-xs text-white/50 mt-0.5">{item.storage} • {item.color}</p>
                  <p className="mt-1.5 text-sm font-bold text-white">Rs. {(item.discount_price ?? item.price).toLocaleString()}</p>
                </div>
                <button onClick={() => removeItem(item.id)}
                  className="shrink-0 self-start rounded-lg border border-red-500/20 p-1.5 text-red-400 transition hover:bg-red-500/10">
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="shrink-0 border-t border-white/10 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Total ({count} items)</span>
              <span className="text-xl font-extrabold text-white">Rs. {total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-white/30">
              <span>Free delivery</span>
              <span>7-Day Warranty ✓</span>
            </div>
            <a href="/checkout?cart=true" onClick={() => setCartOpen(false)}
              className="block w-full rounded-2xl bg-blue-500 py-4 text-center text-sm font-bold text-white transition hover:bg-blue-400">
              Checkout → Rs. {total.toLocaleString()}
            </a>
            <button onClick={clearCart}
              className="w-full text-center text-xs text-white/25 transition hover:text-white/50 py-1">
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}