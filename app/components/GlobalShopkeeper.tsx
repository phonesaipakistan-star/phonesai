"use client";
 
import { useState, useEffect } from "react";
import AIShopkeeper from "./AIShopkeeper";
 
export default function GlobalShopkeeper() {
  const [isOpen, setIsOpen] = useState(false);
 
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("openUstaadJi", handler);
    return () => window.removeEventListener("openUstaadJi", handler);
  }, []);
 
  return (
    <>
      {/* Floating Button — always visible when chat is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-blue-300/60 bg-gradient-to-r from-blue-500/40 to-cyan-400/35 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(56,189,248,0.55)] backdrop-blur-lg transition hover:scale-[1.03]"
        >
          <span>🤖</span>
          <span>Ustaad Ji</span>
        </button>
      )}
 
      {/* Chat drawer */}
      <AIShopkeeper isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}