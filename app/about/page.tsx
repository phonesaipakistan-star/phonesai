export const metadata = {
  title: "About PhonesAI | Wah Cantt Phone Store",
  description:
    "PhonesAI — Pakistan ka trusted premium phone store based in Wah Cantt. Trade-in, repairs, verified iPhones, Samsung, iPads with warranty.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">About Us</p>
        <h1 className="text-4xl font-extrabold text-white mb-6">Pakistan ka Trusted Premium Phone Store</h1>
        <div className="space-y-6 text-white/60 leading-relaxed text-sm">

          <p>PhonesAI Wah Cantt, Pakistan mein based ek premium device store hai. Hum iPhones, Samsung, iPads, aur accessories sell karte hain — sirf verified, asli, aur warranty ke saath.</p>
          <p>Hamare paas ek decade se zyada ka tajurba hai is market mein. Har device personally check hoti hai Ustaad Ji ke haath se — battery health, Face ID, physical condition, sab kuch verify hota hai pehle aapke paas pohonchne se.</p>
          <p>Hum believe karte hain ke premium shopping mein trust sabse pehle aata hai. Isliye hum sirf wohi bechte hain jo hum khud use karein — koi compromise nahi, koi hidden charges nahi.</p>

          {/* Mobile Corner collaboration */}
          <div className="rounded-2xl border border-blue-400/20 bg-blue-500/5 p-6">
            <p className="text-blue-300 font-semibold text-sm mb-2">🤝 Our Collaboration</p>
            <p>PhonesAI ek premium digital storefront hai jo <span className="text-white font-medium">Mobile Corner, Wah Cantt</span> ke saath mil kar kaam karta hai — aapko verified devices ki guarantee ke saath ek established physical store ka trust milta hai.</p>
          </div>

          {/* Services */}
          <div className="grid gap-3 sm:grid-cols-3">
            <a href="/trade-in" className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-white/20 transition">
              <p className="text-xl mb-2">🔄</p>
              <p className="text-xs font-bold text-white mb-1">Trade-In Centre</p>
              <p className="text-[10px] text-white/40 leading-relaxed">Apple, Samsung, Pixel — best rates. In-store only at Wah Cantt.</p>
            </a>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-xl mb-2">🔧</p>
              <p className="text-xs font-bold text-white mb-1">Repair Service</p>
              <p className="text-[10px] text-amber-300/70 leading-relaxed font-medium">Exclusive to PhonesAI customers only.</p>
              <p className="text-[10px] text-white/40 leading-relaxed mt-0.5">Arranged on request — Wah Cantt store.</p>
            </div>
            <a href="/support" className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-white/20 transition">
              <p className="text-xl mb-2">🛡️</p>
              <p className="text-xs font-bold text-white mb-1">After-Sales Support</p>
              <p className="text-[10px] text-white/40 leading-relaxed">Warranty claims, unboxing guide, WhatsApp support.</p>
            </a>
          </div>

          {/* Store info */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
            <div className="flex items-center gap-3"><span className="text-xl">📍</span><p className="text-white">Wah Cantt, Punjab, Pakistan</p></div>
            <div className="flex items-center gap-3"><span className="text-xl">💬</span><a href="https://wa.me/923041502560" className="text-blue-400 hover:underline">WhatsApp: 0304-1502560</a></div>
            <div className="flex items-center gap-3"><span className="text-xl">🕐</span><p className="text-white">Mon–Sun: 12pm – 10pm</p></div>
          </div>

        </div>
      </div>
    </div>
  );
}