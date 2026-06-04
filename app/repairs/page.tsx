"use client";

import { useState } from "react";

export default function RepairsPage() {
  const [bookingForm, setBookingForm] = useState({ name: "", whatsapp: "", model: "", issue: "", orderRef: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Assalam o Alaikum! PhonesAI customer repair request:\n\n📱 Phone: ${bookingForm.model}\n🔧 Issue: ${bookingForm.issue}\n👤 Name: ${bookingForm.name}\n📞 WhatsApp: ${bookingForm.whatsapp}${bookingForm.orderRef ? `\n🧾 Order Reference: ${bookingForm.orderRef}` : ""}`;
    window.open(`https://wa.me/923200801010?text=${encodeURIComponent(msg)}`, "_blank");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-20">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300 mb-4">
            Exclusive Customer Service
          </span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Repair Service</h1>
          <p className="mt-3 text-sm text-white/50 leading-relaxed max-w-md mx-auto">
            PhonesAI se phone khareedne wale customers ke liye exclusive repair service — Wah Cantt store pe. Hum arrange karenge.
          </p>
        </div>

        {/* Customer exclusive banner */}
        <div className="mb-8 rounded-2xl border border-amber-400/25 bg-amber-400/5 p-5 sm:p-6 flex items-start gap-4">
          <span className="text-3xl shrink-0">🧔</span>
          <div>
            <p className="text-sm font-bold text-amber-200 mb-1">PhonesAI Customers Only</p>
            <p className="text-xs text-white/50 leading-relaxed">
              Yeh service sirf unke liye hai jo humse phone khareed chuke hain. Humara trusted repair network aapke liye available hai — screen, battery, camera, aur zyada. Pricing aur availability case-by-case decide hoti hai.
            </p>
          </div>
        </div>

        {/* What we can arrange */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="border-b border-white/5 px-5 py-3 sm:px-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">What We Can Arrange</p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/5 sm:grid-cols-4">
            {[
              { icon: "📱", label: "Screen Repair" },
              { icon: "🔋", label: "Battery Swap" },
              { icon: "📷", label: "Camera Fix" },
              { icon: "🔌", label: "Charging Port" },
              { icon: "🔊", label: "Speaker / Mic" },
              { icon: "🔧", label: "Hardware Issues" },
              { icon: "💾", label: "Data Backup" },
              { icon: "🛠️", label: "Other Issues" },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center gap-1.5 bg-black/40 px-3 py-4 text-center">
                <span className="text-xl">{item.icon}</span>
                <p className="text-xs font-medium text-white/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          {[
            { icon: "📋", title: "Request Bhejein", desc: "Form bharein ya WhatsApp karein" },
            { icon: "💬", title: "We Confirm", desc: "Hum availability aur cost batayenge" },
            { icon: "🏪", title: "Store Aayein", desc: "Wah Cantt store pe repair complete" },
          ].map(s => (
            <div key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-center sm:p-4">
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-xs font-bold text-white">{s.title}</p>
              <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Booking form */}
        {submitted ? (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center">
            <p className="text-4xl mb-4">✅</p>
            <h2 className="text-xl font-extrabold text-white mb-2">Request Send Ho Gaya!</h2>
            <p className="text-sm text-white/60 mb-6">Hum aapko jald WhatsApp pe confirm karenge aur next steps batayenge.</p>
            <button onClick={() => setSubmitted(false)} className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/60 hover:text-white transition">
              New Request
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-8">
            <h2 className="text-lg font-extrabold text-white mb-1">Repair Request Bhejein</h2>
            <p className="text-xs text-white/40 mb-6">Hum aapko WhatsApp pe details aur next steps bhejenge</p>
            <form onSubmit={handleBook} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs text-white/40">Your Name *</label>
                  <input required value={bookingForm.name} onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                    placeholder="Ahmed Khan"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-white/40">WhatsApp *</label>
                  <input required value={bookingForm.whatsapp} onChange={e => setBookingForm({...bookingForm, whatsapp: e.target.value})}
                    placeholder="03XX-XXXXXXX"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-white/40">Phone Model *</label>
                <input required value={bookingForm.model} onChange={e => setBookingForm({...bookingForm, model: e.target.value})}
                  placeholder="e.g. iPhone 15 Pro Max"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-white/40">Issue / What needs repair *</label>
                <textarea required value={bookingForm.issue} onChange={e => setBookingForm({...bookingForm, issue: e.target.value})}
                  placeholder="e.g. Screen cracked, battery draining fast, charging port not working..."
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50 resize-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-white/40">Order Reference (optional)</label>
                <input value={bookingForm.orderRef} onChange={e => setBookingForm({...bookingForm, orderRef: e.target.value})}
                  placeholder="WhatsApp order date ya order number"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
                <p className="mt-1 text-[10px] text-white/25">Helps us verify your purchase faster</p>
              </div>
              <button type="submit"
                className="w-full rounded-2xl bg-amber-500 py-4 text-sm font-bold text-black transition hover:bg-amber-400">
                Send Repair Request →
              </button>
            </form>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-white/25">Wah Cantt store only • Mon–Sat 10am–8pm • Pricing confirmed on WhatsApp</p>
      </main>
    </div>
  );
}