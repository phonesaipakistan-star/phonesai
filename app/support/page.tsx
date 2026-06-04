export const metadata = {
  title: "After-Sales Support | PhonesAI",
  description: "PhonesAI after-sales support — warranty claims, unboxing guide, and everything you need after your purchase.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-20">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-green-400/30 bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-green-300 mb-4">After-Sales Support</span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Hum Hain Aapke Saath</h1>
          <p className="mt-3 text-sm text-white/50 leading-relaxed">Purchase ke baad bhi PhonesAI aapke saath hai — warranty, repairs, trade-in, sab kuch.</p>
        </div>

        {/* Quick actions */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: "🛡️", label: "Warranty Claim", href: "#warranty" },
            { icon: "🔧", label: "Repair Request", href: "/repairs" },
            { icon: "🔄", label: "Trade-In", href: "/trade-in" },
            { icon: "💬", label: "WhatsApp Us", href: "https://wa.me/923200801010" },
          ].map(a => (
            <a key={a.label} href={a.href}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center transition hover:border-white/20 hover:bg-white/[0.04]">
              <p className="text-2xl mb-1.5">{a.icon}</p>
              <p className="text-xs font-semibold text-white">{a.label}</p>
            </a>
          ))}
        </div>

        <div className="space-y-4">

          {/* Warranty */}
          <div id="warranty" className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="border-b border-white/5 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛡️</span>
                <h2 className="text-sm font-bold text-white sm:text-base">Warranty Policy</h2>
              </div>
            </div>
            <div className="px-5 py-4 sm:px-6 sm:py-5 space-y-3">

              {/* Water Pack */}
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3">
                <p className="text-xs font-bold text-green-300 mb-1">💧 Water Pack — 1 Year Brand + 7-Day Software</p>
                <p className="text-xs text-white/55 leading-relaxed">Internal waterproofing seal intact — never tampered internally. Seal breaks permanently when opened. Official brand warranty (Apple/Samsung care centre) — 1 year for PTA phones where applicable. New or pre-owned. PhonesAI additionally covers software issues for 7 days.</p>
                <p className="text-[10px] text-amber-400/70 mt-1.5">⚠️ JV iPhones — brand warranty does not apply. 7-day software warranty via PhonesAI only.</p>
              </div>

              {/* Pre-owned */}
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
                <p className="text-xs font-bold text-blue-300 mb-1">♻️ Pre-Owned — 7 Days Software</p>
                <p className="text-xs text-white/55 leading-relaxed">7-day software warranty via PhonesAI. Hardware not covered.</p>
              </div>

              {/* JV */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                <p className="text-xs font-bold text-amber-300 mb-1">⚠️ JV iPhone — 7 Days Software Only</p>
                <p className="text-xs text-white/55 leading-relaxed">Software issues only — 7 days. Hardware not covered. SIM lock is by design, not a defect.</p>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <span className="text-red-400 shrink-0 text-xs mt-0.5">⚠️</span>
                <p className="text-xs text-white/50 leading-relaxed">Unboxing video is mandatory for all warranty claims. Bina video ke koi claim accept nahi hoga.</p>
              </div>

              <a href="/warranty" className="mt-1 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/60 transition hover:text-white">
                Full Warranty Policy →
              </a>
            </div>
          </div>

          {/* Unboxing guide */}
          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/5 overflow-hidden">
            <div className="border-b border-white/5 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎬</span>
                <h2 className="text-sm font-bold text-white sm:text-base">Unboxing Video Guide</h2>
              </div>
            </div>
            <div className="px-5 py-4 sm:px-6 sm:py-5">
              <p className="text-xs text-white/50 mb-4 leading-relaxed">Phone milne pe turant yeh video banayein — warranty ka proof hai.</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  "Sealed box dikhao",
                  "Slowly open karein",
                  "Face ID test karein",
                  "Battery health check",
                  "Camera test karein",
                  "Charging test",
                  "Speaker test",
                  "Screen check karein",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                    <span className="text-[10px] font-bold text-purple-400/80 shrink-0">{i + 1}</span>
                    <p className="text-[10px] text-white/60 leading-tight">{step}</p>
                  </div>
                ))}
              </div>
              <a href="https://wa.me/923200801010?text=Unboxing video bhej raha/rahi hoon!"
                target="_blank" rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-xl bg-purple-500/20 border border-purple-500/30 px-4 py-2.5 text-xs font-bold text-purple-300 transition hover:bg-purple-500/30">
                Send Us Your Video →
              </a>
            </div>
          </div>

          {/* Repair — exclusive note */}
          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/5 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">🔧</span>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Repair Service</h3>
                <p className="text-xs text-amber-300/80 font-semibold mb-1">Exclusive to PhonesAI customers only</p>
                <p className="text-xs text-white/45 leading-relaxed mb-3">Humse phone khareedne wale customers ke liye hum repair arrange karte hain — screen, battery, camera, aur zyada. Pricing aur availability case-by-case WhatsApp pe confirm hoti hai.</p>
                <a href="/repairs" className="inline-flex rounded-xl bg-amber-500/20 border border-amber-500/30 px-4 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-500/30">
                  Request Repair →
                </a>
              </div>
            </div>
          </div>

          {/* Trade-in */}
          <div className="rounded-2xl border border-blue-400/20 bg-blue-500/5 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">🔄</span>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Trade-In</h3>
                <p className="text-xs text-white/45 leading-relaxed mb-1">Apna purana iPhone, Samsung ya Pixel trade karein. Best rates.</p>
                <p className="text-[10px] text-amber-400/70 font-semibold mb-3">📍 In-store only — Wah Cantt. Online/mail trade-in coming soon.</p>
                <a href="/trade-in" className="inline-flex rounded-xl bg-blue-500/20 border border-blue-500/30 px-4 py-2 text-xs font-bold text-blue-300 transition hover:bg-blue-500/30">
                  Get Quote →
                </a>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
            <h3 className="text-sm font-bold text-white mb-4">Direct Support</h3>
            <div className="space-y-3">
              <a href="https://wa.me/923200801010" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 transition hover:border-green-500/40">
                <span className="text-lg">💬</span>
                <div>
                  <p className="text-xs font-bold text-white">WhatsApp Support</p>
                  <p className="text-[10px] text-white/40">0320-0801010 • Mon–Sun 12pm–10pm</p>
                </div>
                <span className="ml-auto text-xs text-green-400">→</span>
              </a>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                <span className="text-lg">📍</span>
                <div>
                  <p className="text-xs font-bold text-white">Physical Store</p>
                  <p className="text-[10px] text-white/40">Mobile Corner, Wah Cantt, Punjab • Mon–Sun 12pm–10pm</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}