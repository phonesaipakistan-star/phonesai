export const metadata = {
  title: "Contact PhonesAI | WhatsApp & Store Location Wah Cantt",
  description:
    "Contact PhonesAI — WhatsApp, physical store in Wah Cantt, Punjab. Islamabad aur Rawalpindi se qareeb. Mon-Sat 10am-8pm.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Contact</p>
        <h1 className="text-4xl font-extrabold text-white mb-6">Baat Karein Hamare Saath</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-green-500/20 bg-green-500/5 p-6 transition hover:border-green-500/40">
            <span className="text-3xl">💬</span>
            <div>
              <p className="font-bold text-white">WhatsApp</p>
              <p className="text-sm text-white/50 mt-1">Sabse fast — seedha boss se baat</p>
              <p className="text-sm text-green-400 mt-1">0300-1234567</p>
            </div>
          </a>
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <span className="text-3xl">📍</span>
            <div>
              <p className="font-bold text-white">Physical Store</p>
              <p className="text-sm text-white/50 mt-1">Wah Cantt, Punjab</p>
              <p className="text-sm text-white/50">Mon–Sat: 10am – 8pm</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <span className="text-3xl">🕐</span>
            <div>
              <p className="font-bold text-white">Response Time</p>
              <p className="text-sm text-white/50 mt-1">WhatsApp: within 1 hour</p>
              <p className="text-sm text-white/50">In-store: walk in anytime</p>
            </div>
          </div>
          <a href="https://wa.me/923001234567?text=Ustaad Ji se baat karni hai" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-blue-400/20 bg-blue-500/5 p-6 transition hover:border-blue-400/40">
            <span className="text-3xl">🤖</span>
            <div>
              <p className="font-bold text-white">Ustaad Ji</p>
              <p className="text-sm text-white/50 mt-1">AI se pehle poochein</p>
              <p className="text-sm text-blue-400 mt-1">Available 24/7</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
