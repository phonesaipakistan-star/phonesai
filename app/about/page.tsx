export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">About Us</p>
        <h1 className="text-4xl font-extrabold text-white mb-6">Pakistan ka Trusted Premium Phone Store</h1>
        <div className="space-y-6 text-white/60 leading-relaxed text-sm">
          <p>PhonesAI Wah Cantt, Pakistan mein based ek premium device store hai. Hum iPhones, Samsung flagships, iPads, aur accessories sell karte hain — sirf verified, asli, aur 7-din warranty ke saath.</p>
          <p>Hamare paas ek decade se zyada ka tajurba hai is market mein. Har device personally check hoti hai Ustaad Ji ke haath se — battery health, Face ID, physical condition, sab kuch verify hota hai pehle aapke paas pohonchne se.</p>
          <p>Hum believe karte hain ke premium shopping mein trust sabse pehle aata hai. Isliye hum sirf wohi bechte hain jo hum khud use karein — koi compromise nahi, koi hidden charges nahi.</p>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
            <div className="flex items-center gap-3"><span className="text-xl">📍</span><p className="text-white">Wah Cantt, Punjab, Pakistan</p></div>
            <div className="flex items-center gap-3"><span className="text-xl">💬</span><a href="https://wa.me/923001234567" className="text-blue-400 hover:underline">WhatsApp: 0300-1234567</a></div>
            <div className="flex items-center gap-3"><span className="text-xl">🕐</span><p className="text-white">Mon–Sat: 10am – 8pm</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
