"use client";
 
import { useState, useEffect } from "react";
 
type Phone = {
  id: string;
  model: string;
  storage: string;
  color: string;
  category: string;
  brand: string;
  condition: string;
  price: number;
  discount_price: number | null;
  battery_health: number;
  physical_condition: string;
  five_g: boolean;
  face_id: boolean;
  true_tone: boolean;
  images: string[];
  free_case: boolean;
};
 
type CompareToolProps = {
  selectedPhones: Phone[];
  onRemove: (id: string) => void;
  onClear: () => void;
};
 
const Row = ({ label, a, b, highlight }: { label: string; a: string; b: string; highlight?: boolean }) => (
  <div className={`grid grid-cols-3 gap-4 py-3 border-b border-white/5 ${highlight ? "bg-white/[0.02] rounded-xl px-3" : ""}`}>
    <p className="text-xs text-white/40 self-center">{label}</p>
    <p className="text-sm font-semibold text-white text-center">{a}</p>
    <p className="text-sm font-semibold text-white text-center">{b}</p>
  </div>
);
 
export default function CompareTool({ selectedPhones, onRemove, onClear }: CompareToolProps) {
  const [showPopup, setShowPopup] = useState(false);
 
  const openUstaadJi = () => {
    window.dispatchEvent(new CustomEvent("openUstaadJi"));
    setShowPopup(false);
  };
 
  if (selectedPhones.length === 0) return null;
 
  const [a, b] = selectedPhones;
 
  return (
    <>
      {/* Floating Bar */}
      <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 w-full max-w-lg px-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-black/90 backdrop-blur-xl px-4 py-3 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
          <div className="flex items-center gap-3 min-w-0">
            {selectedPhones.map((phone) => (
              <div key={phone.id} className="flex items-center gap-2 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  {phone.images?.[0] ? (
                    <img src={phone.images[0]} alt="" className="h-full w-full object-contain rounded-lg p-0.5" />
                  ) : <span className="text-xs">📱</span>}
                </div>
                <p className="text-xs font-semibold text-white truncate max-w-[80px]">{phone.model}</p>
                <button onClick={() => onRemove(phone.id)} className="text-white/30 hover:text-white text-xs shrink-0">✕</button>
              </div>
            ))}
            {selectedPhones.length === 1 && (
              <p className="text-xs text-white/40 shrink-0">Select one more to compare</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {selectedPhones.length === 2 && (
              <button onClick={() => setShowPopup(true)}
                className="rounded-xl bg-blue-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-400">
                Compare →
              </button>
            )}
            <button onClick={onClear} className="text-white/30 hover:text-white text-xs">Clear</button>
          </div>
        </div>
      </div>
 
      {/* Comparison Popup */}
      {showPopup && a && b && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 bg-[#0a0a0a] shadow-2xl">
 
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a] px-6 py-4">
              <h2 className="text-lg font-extrabold text-white">Compare Phones</h2>
              <button onClick={() => setShowPopup(false)} className="text-white/40 hover:text-white transition">✕</button>
            </div>
 
            <div className="p-6">
              {/* Phone Headers */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div />
                {[a, b].map((phone) => (
                  <div key={phone.id} className="text-center">
                    <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      {phone.images?.[0] ? (
                        <img src={phone.images[0]} alt="" className="h-full w-full object-contain p-2" />
                      ) : <span className="text-2xl">📱</span>}
                    </div>
                    <p className="text-sm font-bold text-white leading-tight">{phone.model}</p>
                    <p className="text-xs text-white/50 mt-1">{phone.storage} • {phone.color}</p>
                  </div>
                ))}
              </div>
 
              {/* Comparison Rows */}
              <div className="space-y-1">
                <Row label="Price"
                  a={`Rs. ${(a.discount_price ?? a.price).toLocaleString()}`}
                  b={`Rs. ${(b.discount_price ?? b.price).toLocaleString()}`}
                  highlight />
                <Row label="Category" a={a.category} b={b.category} />
                <Row label="Condition" a={a.condition} b={b.condition} highlight />
                <Row label="Battery Health"
                  a={a.battery_health ? `${a.battery_health}%` : "N/A"}
                  b={b.battery_health ? `${b.battery_health}%` : "N/A"} />
                <Row label="Physical Condition" a={a.physical_condition ?? "N/A"} b={b.physical_condition ?? "N/A"} highlight />
                <Row label="Face ID"
                  a={a.face_id ? "✅ Working" : "❌ Not working"}
                  b={b.face_id ? "✅ Working" : "❌ Not working"} />
                <Row label="True Tone"
                  a={a.true_tone ? "✅ Active" : "❌ Not active"}
                  b={b.true_tone ? "✅ Active" : "❌ Not active"}
                  highlight />
                <Row label="5G"
                  a={a.five_g ? "✅ Ready" : "❌ No"}
                  b={b.five_g ? "✅ Ready" : "❌ No"} />
                <Row label="Free Case"
                  a={a.free_case && a.condition === "Used" ? "🎁 Included" : "—"}
                  b={b.free_case && b.condition === "Used" ? "🎁 Included" : "—"}
                  highlight />
                <Row label="Brand" a={a.brand} b={b.brand} />
              </div>
 
              {/* Price difference */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
                {(() => {
                  const priceA = a.discount_price ?? a.price;
                  const priceB = b.discount_price ?? b.price;
                  const diff = Math.abs(priceA - priceB);
                  const cheaper = priceA < priceB ? a.model : b.model;
                  return diff > 0 ? (
                    <p className="text-sm text-white/70">
                      <span className="font-bold text-white">{cheaper}</span> is{" "}
                      <span className="font-bold text-green-300">Rs. {diff.toLocaleString()} cheaper</span>
                    </p>
                  ) : (
                    <p className="text-sm text-white/70">Both phones are the same price</p>
                  );
                })()}
              </div>
 
              {/* CTAs */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button onClick={openUstaadJi}
                  className="rounded-2xl border border-blue-300/40 bg-blue-500/10 py-3 text-sm font-bold text-blue-200 transition hover:bg-blue-500/20">
                  🤖 Ask Ustaad Ji
                </button>
                <a href={`/checkout?phone=${a.id}`}
                  className="rounded-2xl bg-blue-500 py-3 text-sm font-bold text-white text-center transition hover:bg-blue-400">
                  Checkout {a.model.split(" ").slice(-2).join(" ")} →
                </a>
              </div>
              <a href={`/checkout?phone=${b.id}`}
                className="mt-3 block w-full rounded-2xl border border-white/15 py-3 text-sm font-semibold text-white/60 text-center transition hover:text-white">
                Checkout {b.model.split(" ").slice(-2).join(" ")} →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}