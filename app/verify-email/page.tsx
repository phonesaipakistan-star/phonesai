"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VerifyContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const [display, setDisplay] = useState<"success" | "invalid" | "already" | "loading">("loading");

  useEffect(() => {
    if (status === "success") setDisplay("success");
    else if (status === "already") setDisplay("already");
    else if (status === "invalid") setDisplay("invalid");
    else setDisplay("invalid");
  }, [status]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">

        {display === "loading" && (
          <p className="animate-pulse text-white/40">Verifying...</p>
        )}

        {display === "success" && (
          <div className="rounded-3xl border border-green-500/30 bg-green-500/5 p-8">
            <p className="text-5xl mb-4">✅</p>
            <h1 className="text-2xl font-extrabold text-white mb-2">Email Verify Ho Gaya!</h1>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Aap ab haari exclusive list mein hain — new arrivals, restock alerts, aur special deals seedha aapke inbox mein aayenge.
            </p>
            <a href="/shop"
              className="inline-block rounded-2xl bg-blue-500 px-8 py-3 text-sm font-bold text-white transition hover:bg-blue-400">
              Shop Now →
            </a>
          </div>
        )}

        {display === "already" && (
          <div className="rounded-3xl border border-amber-400/30 bg-amber-400/5 p-8">
            <p className="text-5xl mb-4">✓</p>
            <h1 className="text-2xl font-extrabold text-white mb-2">Pehle Se Verified!</h1>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Aap pehle se exclusive list mein hain — new arrivals aur restock alerts aapke inbox mein aate rahenge.
            </p>
            <a href="/shop"
              className="inline-block rounded-2xl bg-blue-500 px-8 py-3 text-sm font-bold text-white transition hover:bg-blue-400">
              Shop Now →
            </a>
          </div>
        )}

        {display === "invalid" && (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-8">
            <p className="text-5xl mb-4">❌</p>
            <h1 className="text-2xl font-extrabold text-white mb-2">Link Invalid Hai</h1>
            <p className="text-white/50 text-sm mb-6">Yeh verification link expire ho gaya ya galat hai. Dobara signup karein.</p>
            <a href="/"
              className="inline-block rounded-2xl border border-white/20 px-8 py-3 text-sm font-semibold text-white/60 transition hover:text-white">
              ← Back to Home
            </a>
          </div>
        )}

        <div className="mt-8">
          <a href="/" className="text-xs text-white/25 hover:text-white/50 transition">PhonesAI — phonesai.pk</a>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-black"><p className="animate-pulse text-white/40">Loading...</p></div>}>
      <VerifyContent />
    </Suspense>
  );
}
