"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function generateToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function EmailPopup() {
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

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
    setSending(true);

    const token = generateToken();

    try {
      const { error } = await supabase.from("customer_leads").insert({
        email,
        token,
        verified: false,
        discount_used: false,
      });

      if (error) {
        console.error("Supabase insert error:", error);
      }

      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "verify_email",
          customerEmail: email,
          verificationToken: token,
        }),
      });
    } catch (err) {
      console.error("Email signup error:", err);
    }

    setSending(false);
    setSubmitted(true);
    setTimeout(() => {
      setShowEmailPopup(false);
      localStorage.setItem("phonesai_email_dismissed", "true");
    }, 5000);
  };

  if (!showEmailPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-[#0d0d0d] p-6 shadow-2xl">
        <button onClick={handleDismiss} className="absolute right-4 top-4 text-white/30 hover:text-white text-lg">✕</button>
        {!submitted ? (
          <>
            <div className="mb-5 text-center">
              <p className="text-2xl mb-2">📲</p>
              <h2 className="text-xl font-extrabold text-white">Stay in the Loop 📲</h2>
              <p className="mt-2 text-sm text-white/50 leading-relaxed">
                Sign up for exclusive deals, new arrivals, and restock alerts — be the first to know when a phone you want comes in.
              </p>
            </div>
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="aapka@email.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-blue-400/50" />
              <button type="submit" disabled={sending} className="w-full rounded-xl bg-blue-500 py-3 text-sm font-bold text-white hover:bg-blue-400 disabled:opacity-50">
                {sending ? "Bhej rahe hain..." : "Get Early Access →"}
              </button>
            </form>
            <button onClick={handleDismiss} className="mt-3 w-full text-center text-xs text-white/25 hover:text-white/50">
              No thanks
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-4xl mb-3">📧</p>
            <h2 className="text-xl font-extrabold text-white">Email Check Karein!</h2>
            <p className="mt-2 text-sm text-white/50">Aapki email pe verification link bheja gaya hai.</p>
            <p className="mt-2 text-xs text-white/40 leading-relaxed">
              Link click karein — phir aap exclusive list mein shamil ho jayenge.
            </p>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs text-white/40">Spam folder bhi check karein agar email na aaye.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
