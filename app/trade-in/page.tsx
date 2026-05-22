"use client";

import { useState } from "react";

const phoneModels = [
  "iPhone 17 Pro Max", "iPhone 17 Pro", "iPhone 17 Plus", "iPhone 17",
  "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16",
  "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
  "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
  "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 Mini",
  "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 12 Mini",
  "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11",
  "Samsung Galaxy S25 Ultra", "Samsung Galaxy S25+", "Samsung Galaxy S25",
  "Samsung Galaxy S24 Ultra", "Samsung Galaxy S24+", "Samsung Galaxy S24",
  "Samsung Galaxy S23 Ultra", "Samsung Galaxy S23+", "Samsung Galaxy S23",
  "Google Pixel 9 Pro", "Google Pixel 9", "Google Pixel 8 Pro", "Google Pixel 8",
  "Other",
];

const storageOptions = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const conditionOptions = [
  { value: "mint", label: "Mint / Like New", desc: "No scratches, fully working, original box", color: "border-green-500/40 bg-green-500/10 text-green-300" },
  { value: "good", label: "Good", desc: "Minor wear, fully working, no major scratches", color: "border-blue-500/40 bg-blue-500/10 text-blue-300" },
  { value: "fair", label: "Fair", desc: "Visible scratches or dents, all functions working", color: "border-amber-500/40 bg-amber-500/10 text-amber-300" },
  { value: "poor", label: "Poor / Damaged", desc: "Cracked screen, battery issues, or other damage", color: "border-red-500/40 bg-red-500/10 text-red-300" },
];

export default function TradeInPage() {
  const [form, setForm] = useState({
    model: "",
    storage: "",
    condition: "",
    battery: "",
    name: "",
    whatsapp: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const conditionLabel = conditionOptions.find(c => c.value === form.condition)?.label ?? form.condition;
    const msg = `Assalam o Alaikum! Trade-In inquiry:\n\n📱 Model: ${form.model}\n💾 Storage: ${form.storage}\n⭐ Condition: ${conditionLabel}\n🔋 Battery: ${form.battery}%\n👤 Name: ${form.name}\n${form.notes ? `📝 Notes: ${form.notes}` : ""}`;
    window.open(`https://wa.me/923041502560?text=${encodeURIComponent(msg)}`, "_blank");
    setSubmitted(true);
  };

  const isComplete = form.model && form.storage && form.condition && form.battery && form.name && form.whatsapp;

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-20">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">Trade-In Centre</span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Apna Phone Trade-In Karein</h1>
          <p className="mt-3 text-sm text-white/50 leading-relaxed">Apple • Samsung • Google Pixel — Best rates guaranteed.</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5">
            <span className="text-sm">🏪</span>
            <p className="text-xs font-semibold text-amber-300">In-Store Only — Wah Cantt physical store pe. Online/mail trade-in coming soon.</p>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          {[
            { step: "1", icon: "📋", title: "Form Bharein", desc: "Apna phone ka detail dein" },
            { step: "2", icon: "💬", title: "Quote Milega", desc: "Hum WhatsApp pe estimate bhejenge" },
            { step: "3", icon: "🏪", title: "Store Aayein", desc: "Wah Cantt store pe physically complete — online coming soon" },
          ].map(s => (
            <div key={s.step} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-center sm:p-4">
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-xs font-bold text-white">{s.title}</p>
              <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* In-store notice */}
        <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-500/5 p-4 flex items-start gap-3">
          <span className="text-xl shrink-0">📍</span>
          <div>
            <p className="text-xs font-bold text-amber-200">In-Store Only — Wah Cantt</p>
            <p className="text-xs text-white/45 leading-relaxed mt-0.5">Trade-in abhi sirf hamare physical store pe available hai. Online/mail trade-in jald aa raha hai — tab tak form bharein aur hum WhatsApp pe guide karenge.</p>
          </div>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center">
            <p className="text-4xl mb-4">✅</p>
            <h2 className="text-xl font-extrabold text-white mb-2">Request Send Ho Gaya!</h2>
            <p className="text-sm text-white/60 mb-6">Hum aapko jald WhatsApp pe best trade-in quote bhejenge.</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button onClick={() => setSubmitted(false)} className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/60 hover:text-white transition">
                New Request
              </button>
              <a href="/shop" className="rounded-xl bg-blue-500 px-6 py-3 text-sm font-bold text-white text-center transition hover:bg-blue-400">
                Browse New Phones →
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Model */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/40">Phone Model *</label>
              <select required value={form.model} onChange={e => setForm({...form, model: e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-[#0d0d0d] px-4 py-3 text-sm text-white outline-none focus:border-blue-400/50">
                <option value="">Select model...</option>
                {phoneModels.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Storage */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/40">Storage *</label>
              <div className="flex flex-wrap gap-2">
                {storageOptions.map(s => (
                  <button key={s} type="button" onClick={() => setForm({...form, storage: s})}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${form.storage === s ? "border-blue-400/60 bg-blue-500/20 text-blue-200" : "border-white/10 text-white/50 hover:text-white/80"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/40">Condition *</label>
              <div className="grid grid-cols-2 gap-2">
                {conditionOptions.map(c => (
                  <button key={c.value} type="button" onClick={() => setForm({...form, condition: c.value})}
                    className={`rounded-xl border p-3 text-left transition ${form.condition === c.value ? c.color : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}>
                    <p className="text-xs font-bold text-white">{c.label}</p>
                    <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Battery */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/40">Battery Health (%) *</label>
              <input required type="number" min="1" max="100" value={form.battery}
                onChange={e => setForm({...form, battery: e.target.value})}
                placeholder="e.g. 89"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
              <p className="mt-1 text-[10px] text-white/30">iPhone: Settings → Battery → Battery Health</p>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/40">Your Name *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="Ahmed Khan"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/40">WhatsApp *</label>
                <input required value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})}
                  placeholder="03XX-XXXXXXX"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/40">Additional Notes (optional)</label>
              <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                placeholder="Any accessories included? Original box? Any issues?"
                rows={2}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50 resize-none" />
            </div>

            <button type="submit" disabled={!isComplete}
              className="w-full rounded-2xl bg-green-500 py-4 text-sm font-bold text-white transition hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed">
              Get Trade-In Quote on WhatsApp →
            </button>

            <p className="text-center text-xs text-white/25">In-store only at Wah Cantt • Mon–Sun 12pm–10pm • Online trade-in coming soon</p>
          </form>
        )}

        {/* What we accept */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">We Accept</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { brand: "Apple", models: "iPhone 11 and newer", icon: "📱" },
              { brand: "Samsung", models: "Galaxy S21 and newer", icon: "📱" },
              { brand: "Google Pixel", models: "Pixel 6 and newer", icon: "📱" },
            ].map(b => (
              <div key={b.brand} className="text-center">
                <p className="text-2xl mb-1">{b.icon}</p>
                <p className="text-xs font-bold text-white">{b.brand}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{b.models}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}