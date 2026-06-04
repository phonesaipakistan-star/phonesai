import { WATER_PACK_WARRANTY_DESCRIPTION } from "@/lib/waterPack";

export const metadata = {
  title: "Warranty Policy | PhonesAI Pakistan",
  description:
    "PhonesAI ki complete warranty policy — Brand New, Water Pack, Pre-Owned phones ke liye coverage. Ustaad Ji ka wada.",
};

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Policy</p>
        <h1 className="text-4xl font-extrabold text-white mb-2">Warranty Policy</h1>
        <p className="text-sm text-white/40 mb-8">Last updated: May 2026</p>

        <div className="space-y-6 text-sm text-white/60 leading-relaxed">

          {/* Ustaad Ji promise */}
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/5 p-6">
            <p className="text-amber-200 font-bold text-base mb-2">🧔 Ustaad Ji ka Wada</p>
            <p>Har phone hamare haath se guzarta hai — thoroughly tested, verified, aur aapke liye tayaar. Aapka kaam hai box khulte hi unboxing video banana — yeh aapki warranty ka proof bhi hai aur apne doston ko dikhane ka mauqa bhi!</p>
          </div>

          {/* Condition grading & warranty */}
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="border-b border-white/5 px-5 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Condition Grading & Warranty</p>
            </div>
            <div className="divide-y divide-white/5 px-5">
              {[
                {
                  grade: "Brand New",
                  detail: "Full 7-day software warranty. Factory new unit. Free case included.",
                },
                {
                  grade: "Water Pack",
                  detail: `Units marked Water Pack only (new or pre-owned). ${WATER_PACK_WARRANTY_DESCRIPTION}`,
                },
                {
                  grade: "Premium / Excellent",
                  detail: "7-day warranty. Best pre-owned units — Premium is flawless; Excellent is almost perfect with pristine screen.",
                },
                {
                  grade: "Good",
                  detail: "7-day warranty. Light signs of use on body, screen clean. Fully functional.",
                },
                {
                  grade: "Fair",
                  detail: "7-day warranty. Visible wear but 100% working. Best value option.",
                },
              ].map((row) => (
                <div key={row.grade} className="py-4">
                  <p className="text-xs font-bold text-white">{row.grade}</p>
                  <p className="mt-1 text-xs text-white/60">{row.detail}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 px-5 py-4 bg-white/[0.02]">
              <p className="text-xs text-white/70">
                All pre-owned grades include <span className="text-white font-semibold">free case + screen protector</span>. New phones include a <span className="text-white font-semibold">free case</span>.
              </p>
              <p className="mt-2 text-xs text-white/70">
                <span className="text-white font-semibold">Brand New</span> aur <span className="text-white font-semibold">Water Pack</span> alag attributes hain — Water Pack kisi bhi phone par ho sakta hai (new ya pre-owned) jahan internal waterproofing seal abhi tak break nahi hui.
              </p>
              <p className="mt-2 text-xs text-white/70">
                Unboxing video required for <span className="text-white font-semibold">all warranty claims</span> regardless of grade.
              </p>
            </div>
          </div>

          {/* Water Pack */}
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-6">
            <p className="text-cyan-200 font-bold text-base mb-3">💧 Water Pack</p>
            <p className="text-xs text-white/60">{WATER_PACK_WARRANTY_DESCRIPTION}</p>
          </div>

          {/* Coverage summary table */}
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="border-b border-white/5 px-5 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Coverage at a Glance</p>
            </div>
            <div className="divide-y divide-white/5">
              <div className="grid grid-cols-3 items-center gap-4 px-5 py-4">
                <div>
                  <p className="text-xs font-bold text-white">Brand New</p>
                  <p className="text-[10px] text-white/40">Factory new unit</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-white/70">
                    <span className="text-green-400 font-bold">7 Days</span> — PhonesAI software warranty
                  </p>
                  <p className="text-[10px] text-white/35 mt-0.5">PTA units may also qualify for brand warranty via official care centre.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4 px-5 py-4">
                <div>
                  <p className="text-xs font-bold text-white">Water Pack</p>
                  <p className="text-[10px] text-white/40">Internal waterproofing seal intact — never tampered</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-white/70">
                    <span className="text-green-400 font-bold">1 Year</span> — Official brand warranty via company care centre
                  </p>
                  <p className="text-[10px] text-white/35 mt-0.5">Apple/Samsung service centre directly. PhonesAI 7-day software warranty also applies. Check listing for Water Pack badge.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4 px-5 py-4">
                <div>
                  <p className="text-xs font-bold text-white">Pre-Owned</p>
                  <p className="text-[10px] text-white/40">Used, verified condition</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-white/70">
                    <span className="text-blue-400 font-bold">7 Days</span> — Software warranty via PhonesAI
                  </p>
                  <p className="text-[10px] text-white/35 mt-0.5">Software issues only. Hardware not covered.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4 px-5 py-4">
                <div>
                  <p className="text-xs font-bold text-white">JV iPhone</p>
                  <p className="text-[10px] text-white/40">Carrier-locked unit</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-white/70">
                    <span className="text-amber-400 font-bold">7 Days</span> — Software issues only via PhonesAI
                  </p>
                  <p className="text-[10px] text-white/35 mt-0.5">Hardware not covered. SIM lock is by design — not a defect.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Water Pack brand warranty */}
          <div className="rounded-2xl border border-green-400/20 bg-green-500/5 p-6">
            <p className="text-green-200 font-bold text-base mb-3">📦 Water Pack — 1 Year Brand Warranty (where applicable)</p>
            <p className="mb-3">{WATER_PACK_WARRANTY_DESCRIPTION} <span className="text-white font-semibold">1 year official warranty</span> directly through the brand&apos;s official care centre where applicable (PTA units).</p>
            <div className="space-y-2 mt-3">
              <div className="flex items-start gap-2">
                <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                <p>Apple PTA phones — claim at any Apple Authorised Service Provider in Pakistan.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                <p>Samsung PTA phones — claim at Samsung Service Centre.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 shrink-0 mt-0.5">⚠️</span>
                <p>JV iPhones — official brand warranty does <span className="text-white font-semibold">not apply</span>. Only 7-day software warranty via PhonesAI.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 shrink-0 mt-0.5">⚠️</span>
                <p>Non-PTA phones — brand warranty may be limited or unavailable in Pakistan. Check your specific model.</p>
              </div>
            </div>
          </div>

          {/* 7-Day software warranty — all phones */}
          <div className="rounded-2xl border border-blue-400/20 bg-blue-500/5 p-6">
            <p className="text-blue-200 font-bold text-base mb-3">🛡️ 7-Day Software Warranty — All Phones</p>
            <p className="mb-3">Har phone pe — Brand New, Water Pack, Pre-Owned, ya JV — PhonesAI <span className="text-white font-semibold">7-din ki software warranty</span> deta hai delivery ke baad.</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                <p>Software issues — lag, freeze, boot problems</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                <p>Verified before dispatch</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                <p>Unboxing video required for all claims</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                <p>Physical damage, water damage, or misuse not covered</p>
              </div>
            </div>
          </div>

          {/* Not covered */}
          <div>
            <h2 className="text-white font-bold text-lg mb-3">❌ Warranty Does Not Cover</h2>
            <ul className="space-y-2">
              {[
                "Physical damage — girna, screen crack, dents after delivery",
                "Water damage — kisi bhi tarah ka liquid contact",
                "Misuse — jailbreak, unauthorized repairs, software tampering",
                "Accessories — chargers, cables (unless defective on arrival)",
                "Battery degradation beyond normal use after 7 days",
                "SIM lock on JV phones — by design, not a defect",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Unboxing video */}
          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/5 p-6">
            <p className="text-purple-200 font-bold text-base mb-3">🎬 Unboxing Video — Warranty ka Proof</p>
            <p className="mb-3">Phone milte hi unboxing video banao — yeh zaroori hai:</p>
            <ul className="space-y-2">
              {[
                "Sealed box dikhao",
                "Slowly open karein — Water Pack units: internal waterproofing seal intact check karein (never tampered internally)",
                "Camera test — front aur back",
                "Charging test",
                "Speaker test",
                "Battery health check — Settings > Battery",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-purple-400 shrink-0 font-bold text-xs mt-0.5">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs font-semibold text-purple-300">⚠️ Bina unboxing video ke koi warranty claim accept nahi hoga — koi exception nahi.</p>
          </div>

          {/* How to claim */}
          <div>
            <h2 className="text-white font-bold text-lg mb-3">📋 Claim karne ka tareeqa</h2>
            <ol className="space-y-2">
              {[
                "7 din ke andar WhatsApp par message karein",
                "Apni unboxing video bhejein — bina video ke claim accept nahi hoga",
                "Issue ka clear video/photo bhejein",
                "Hum review karenge aur solution denge",
                "Water Pack PTA phones ke liye: brand care centre ka process follow karein — hum guide karenge",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-blue-400 shrink-0 font-bold text-xs mt-0.5">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-white/50 text-xs">Questions? WhatsApp Ustaad Ji at <a href="https://wa.me/923200801010" className="text-green-400 hover:underline">0320-0801010</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
