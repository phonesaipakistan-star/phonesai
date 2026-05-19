"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EmailPopup() {
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("phonesai_email_dismissed");
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (!dismissed) {
      timer = setTimeout(() => setShowEmailPopup(true), 4000);
    }
    const handler = () => setShowEmailPopup(true);
    window.addEventListener("openEmailPopup", handler);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("openEmailPopup", handler);
    };
  }, []);

  const handleDismiss = () => {
    setShowEmailPopup(false);
    localStorage.setItem("phonesai_email_dismissed", "true");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await supabase.from("customer_leads").insert({ email, discount_used: false });
    } catch { }
    setSubmitted(true);
    setTimeout(() => {
      setShowEmailPopup(false);
      localStorage.setItem("phonesai_email_dismissed", "true");
    }, 4000);
  };

  if (!showEmailPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-[#0d0d0d] p-6 shadow-2xl">
        <button onClick={handleDismiss} className="absolute right-4 top-4 text-white/30 hover:text-white text-lg">✕</button>
        {!submitted ? (
          <>
            <div className="mb-5 text-center">
              <p className="text-2xl mb-2">🎁</p>
              <h2 className="text-xl font-extrabold text-white">Special Discount — First Order!</h2>
              <p className="mt-2 text-sm text-white/50">Apna email dein aur pehli purchase pe special discount pao.</p>
            </div>
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="aapka@email.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-blue-400/50" />
              <button type="submit" className="w-full rounded-xl bg-blue-500 py-3 text-sm font-bold text-white hover:bg-blue-400">
                Claim My Discount →
              </button>
            </form>
            <button onClick={handleDismiss} className="mt-3 w-full text-center text-xs text-white/25 hover:text-white/50">
              No thanks, I'll pay full price
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-4xl mb-3">✅</p>
            <h2 className="text-xl font-extrabold text-white">Shukriya Janab!</h2>
            <p className="mt-2 text-sm text-white/50">Aapka special discount code:</p>
            <div className="mt-3 rounded-xl border border-blue-400/30 bg-blue-500/10 px-6 py-3">
              <p className="text-xl font-extrabold tracking-widest text-blue-300">SPECIAL5</p>
            </div>
            <p className="mt-2 text-xs text-white/40">Checkout pe apply karein — 5% off milega!</p>
            <p className="mt-1 text-xs text-white/25">Screenshot kar lein ya yaad rakh lein!</p>
          </div>
        )}
      </div>
    </div>
  );
}