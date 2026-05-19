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
            <p>Har phone hamare haath se guzarta hai — thoroughly tested, verified, aur aapke liye tayaar. Lekin aapka kaam hai box khulte hi video banana — yeh aapki warranty ka proof bhi hai aur apne doston ko dikhane ka mauqa bhi!</p>
          </div>

          <div className="rounded-2xl border border-blue-400/20 bg-blue-500/5 p-6">
            <p className="text-blue-200 font-bold text-base mb-3">📱 New/Sealed Phones — 3 Din Checking Warranty</p>
            <p>Pin pack phone mein manufacturing defect nikle toh 3 din ke andar report karein. Apple ki apni warranty alag se applicable hai PTA approved phones pe.</p>
          </div>

          <div className="rounded-2xl border border-green-400/20 bg-green-500/5 p-6">
            <p className="text-green-200 font-bold text-base mb-3">♻️ Pre-Owned Phones — 7 Din Hardware Warranty</p>
            <p>Pre-owned phones pe 7 din ki hardware warranty — sirf woh issues jo delivery se pehle se existing thay.</p>
          </div>

          <div>
            <h2 className="text-white font-bold text-lg mb-3">✅ Hardware warranty mein kya cover hota hai</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Battery health mismatch — jo bataya woh na mile (significant difference)</li>
              <li>Face ID — delivery ke baad bina kisi damage ke kaam na kare</li>
              <li>Display — dead pixels, green line, touch completely unresponsive</li>
              <li>Camera — front ya back completely kaam na kare</li>
              <li>Charging port — bilkul charge na ho</li>
              <li>Speaker ya microphone — complete failure</li>
              <li>Buttons — completely unresponsive</li>
              <li>WiFi/Bluetooth — hardware chip failure</li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-bold text-lg mb-3">❌ Warranty cover nahi karta</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Physical damage — girna, screen crack, dents</li>
              <li>Water damage — kisi bhi tarah ka liquid contact</li>
              <li>Software issues — iOS bugs, app crashes, slow performance</li>
              <li>Battery degradation after use — normal wear</li>
              <li>Issues after customer visits any repair shop</li>
              <li>iCloud or Apple ID issues</li>
              <li>Non-PTA SIM issues after 2 months — by regulation</li>
              <li>JV SIM lock — by design, disclosed at purchase</li>
              <li>Issues reported after warranty period</li>
              <li>Bina unboxing video ke koi bhi claim</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/5 p-6">
            <p className="text-purple-200 font-bold text-base mb-3">🎬 Unboxing Video — Warranty ka Proof aur Apna Moment!</p>
            <p className="mb-3">Apna naya phone unbox karo aur video banao! Yeh video:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Aapki warranty ka official proof hai</li>
              <li>Apne doston ko dikhao apna naya phone</li>
              <li>Hamare saath share karo — tag us on Instagram</li>
            </ul>
            <p className="mt-3 text-xs text-white/40">Video mein dikhao: sealed box, opening, Face ID test, camera test, charging test, speaker test</p>
            <p className="mt-2 text-xs font-semibold text-purple-300">⚠️ Bina unboxing video ke koi warranty claim accept nahi hoga</p>
          </div>

          <div>
            <h2 className="text-white font-bold text-lg mb-3">📋 Claim karne ka tareeqa</h2>
            <ol className="space-y-2 list-decimal list-inside">
              <li>Warranty period ke andar WhatsApp par message karein</li>
              <li>Apni unboxing video bhejein — bina video ke claim accept nahi hoga</li>
              <li>Issue ka clear video/photo bhejein</li>
              <li>Hum review karenge aur solution denge — repair ya replacement</li>
            </ol>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-white font-bold mb-2">Claim karne ke liye</p>
            <a href="https://wa.me/923041502560?text=Warranty claim karna hai" className="text-blue-400 hover:underline">WhatsApp: 0304-1502560</a>
          </div>

        </div>
      </div>
    </div>
  );
}