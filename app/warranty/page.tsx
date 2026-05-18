export const metadata = {
  title: "7-Day Warranty Policy | PhonesAI Pakistan",
  description:
    "PhonesAI ki 7-din warranty policy — kya cover hota hai, kya nahi, aur claim kaise karein. Ustaad Ji ka wada.",
};

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Policy</p>
        <h1 className="text-4xl font-extrabold text-white mb-6">7-Day Warranty Policy</h1>
        <div className="space-y-8 text-sm text-white/60 leading-relaxed">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/5 p-6">
            <p className="text-amber-200 font-bold text-base mb-2">🧔 Ustaad Ji ka Wada</p>
            <p>Box kholo, check karo — 7 din mein koi bhi hardware issue nikla toh hum zimmedar hain. Yeh hamaara wada hai.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-3">✅ Warranty mein kya cover hota hai</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Battery health mismatch — jo bataya woh na mile</li>
              <li>Face ID / Touch ID kaam na kare</li>
              <li>Display issue — dead pixels, touch problem</li>
              <li>Camera kaam na kare</li>
              <li>Charging port issue</li>
              <li>Speaker ya microphone issue</li>
            </ul>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-3">❌ Warranty mein kya cover nahi hota</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Physical damage after delivery — girna, toota screen</li>
              <li>Water damage</li>
              <li>Unauthorized repair ya tamper</li>
              <li>7 din ke baad report hone wale issues</li>
              <li>JV phones ki SIM lock — yeh by design hai</li>
              <li>Non-PTA registration fees</li>
            </ul>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-3">📋 Claim karne ka tareeqa</h2>
            <ol className="space-y-2 list-decimal list-inside">
              <li>Delivery ke 7 din ke andar WhatsApp par message karein</li>
              <li>Issue ka video ya photo bhejein</li>
              <li>Hum review karenge aur solution denge — repair ya replacement</li>
            </ol>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-white font-bold mb-2">Claim karne ke liye</p>
            <a href="https://wa.me/923001234567?text=Warranty claim karna hai" className="text-blue-400 hover:underline">WhatsApp: 0300-1234567</a>
          </div>
        </div>
      </div>
    </div>
  );
}
