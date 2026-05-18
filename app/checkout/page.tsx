"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/app/components/CartContext";

type Phone = {
  id: string;
  model: string;
  storage: string;
  color: string;
  category: string;
  price: number;
  discount_price: number | null;
  images: string[];
};

type PaymentMethod = "bank" | "easypaisa" | "jazzcash" | "raast" | "card";

// ── Sanitization ──────────────────────────────────────────────────────────────
// Strips all HTML/XML tags, path traversal sequences, and null bytes
const sanitize = (value: string): string => {
  return value
    .replace(/<[^>]*>/g, "")           // strip HTML/XML tags
    .replace(/\.\.[/\\]/g, "")         // strip path traversal ../
    .replace(/[/\\]/g, "")             // strip remaining slashes
    .replace(/\0/g, "")                // strip null bytes
    .replace(/[<>"'`;]/g, "")          // strip injection chars
    .trim()
    .slice(0, 500);                     // max length
};

const sanitizeEmail = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9@._+-]/g, "").slice(0, 254);
};

const sanitizePhone = (value: string): string => {
  return value.replace(/[^0-9+\-() ]/g, "").slice(0, 20);
};

const COUPON_CODE = "WELCOME5";
const COUPON_DISCOUNT = 0.05; // 5%

const paymentMethods = [
  { id: "bank", label: "Bank Transfer", icon: "🏦" },
  { id: "easypaisa", label: "EasyPaisa", icon: "🟢" },
  { id: "jazzcash", label: "JazzCash", icon: "🔴" },
  { id: "raast", label: "Raast", icon: "⚡" },
  { id: "card", label: "Debit / Credit Card", icon: "💳" },
];

const paymentDetails: Record<PaymentMethod, { title: string; detail: string; note: string }> = {
  bank: { title: "Bank Transfer", detail: "Bank: [YOUR BANK NAME]\nAccount Title: [YOUR NAME]\nAccount Number: [YOUR ACCOUNT NUMBER]\nIBAN: [YOUR IBAN]", note: "Transfer the exact amount and send screenshot on WhatsApp." },
  easypaisa: { title: "EasyPaisa", detail: "Account Number: [YOUR EASYPAISA NUMBER]\nAccount Title: [YOUR NAME]", note: "Send payment to above number and send screenshot on WhatsApp." },
  jazzcash: { title: "JazzCash", detail: "Mobile Account: [YOUR JAZZCASH NUMBER]\nAccount Title: [YOUR NAME]", note: "Send payment to above number and send screenshot on WhatsApp." },
  raast: { title: "Raast", detail: "Raast ID: [YOUR RAAST ID]\nAccount Title: [YOUR NAME]", note: "Send via Raast and send payment confirmation on WhatsApp." },
  card: { title: "Debit / Credit Card", detail: "Bank: [YOUR BANK NAME]\nAccount Title: [YOUR NAME]\nIBAN: [YOUR IBAN]", note: "Transfer via your bank app using IBAN and send confirmation on WhatsApp." },
};

const trustBadges = [
  { icon: "🔒", title: "SSL Secured", desc: "Your data is encrypted" },
  { icon: "🧔", title: "Ustaad Ji Verified", desc: "Every device checked" },
  { icon: "🛡️", title: "7-Day Warranty", desc: "Full refund guarantee" },
  { icon: "📍", title: "Physical Store", desc: "Wah Cantt, Pakistan" },
  { icon: "🚚", title: "Free Delivery", desc: "All Pakistan" },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const phoneId = searchParams.get("phone");
  const isCartCheckout = searchParams.get("cart") === "true";
  const { items, total, count, clearCart } = useCart();

  const [phone, setPhone] = useState<Phone | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", address: "", notes: "" });
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    const fetchPhone = async () => {
      if (!phoneId) { setLoading(false); return; }
      const { data, error } = await supabase
        .from("phones")
        .select("id,model,storage,color,category,price,discount_price,images")
        .eq("id", phoneId)
        .single();
      if (!error && data) setPhone(data);
      setLoading(false);
    };
    fetchPhone();
  }, [phoneId]);

  useEffect(() => {
    if (isCartCheckout) setLoading(false);
  }, [isCartCheckout]);

  const basePrice = isCartCheckout ? total : (phone?.discount_price ?? phone?.price ?? 0);
  const finalPrice = couponApplied ? Math.round(basePrice * (1 - COUPON_DISCOUNT)) : basePrice;
  const discount = basePrice - finalPrice;

  const applyCoupon = () => {
    if (couponInput.trim().toUpperCase() === COUPON_CODE) {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      setCouponApplied(false);
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = sanitize(form.name);
    const cleanPhone = sanitizePhone(form.phone);
    const cleanCity = sanitize(form.city);
    if (!cleanName || !cleanPhone || !cleanCity) return;
    setStep("payment");
  };

  const handleOrderSubmit = async () => {
    if (!selectedPayment) return;
    setSubmitting(true);

    // Sanitize all form fields before saving
    const cleanForm = {
      name: sanitize(form.name),
      phone: sanitizePhone(form.phone),
      email: sanitizeEmail(form.email),
      city: sanitize(form.city),
      address: sanitize(form.address),
      notes: sanitize(form.notes),
    };

    if (isCartCheckout && items.length > 0) {
      for (const item of items) {
        const itemPrice = couponApplied
          ? Math.round((item.discount_price ?? item.price) * (1 - COUPON_DISCOUNT))
          : (item.discount_price ?? item.price);
        await supabase.from("orders").insert({
          customer_name: cleanForm.name,
          customer_email: cleanForm.email,
          customer_whatsapp: cleanForm.phone,
          customer_city: cleanForm.city,
          phone_id: item.id,
          total_price: itemPrice,
          payment_method: selectedPayment,
          payment_status: "pending",
          delivery_status: "pending",
          delivery_city: cleanForm.city,
        });
      }
      clearCart();
    } else if (phone) {
      await supabase.from("orders").insert({
        customer_name: cleanForm.name,
        customer_email: cleanForm.email,
        customer_whatsapp: cleanForm.phone,
        customer_city: cleanForm.city,
        phone_id: phone.id,
        total_price: finalPrice,
        payment_method: selectedPayment,
        payment_status: "pending",
        delivery_status: "pending",
        delivery_city: cleanForm.city,
      });
    }
    setSubmitting(false);
    setStep("success");
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-black"><p className="animate-pulse text-white/40">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">

      {/* Trust Bar */}
      <div className="border-b border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6 py-3">
          <div className="flex items-center justify-between gap-4 overflow-x-auto">
            {trustBadges.map((badge) => (
              <div key={badge.title} className="flex shrink-0 items-center gap-2">
                <span className="text-lg">{badge.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-white">{badge.title}</p>
                  <p className="text-[10px] text-white/40">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-12">

        {/* Success */}
        {step === "success" && (
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 text-4xl">✅</div>
            <h1 className="text-3xl font-extrabold text-white">Order Received!</h1>
            <p className="max-w-md text-white/50 leading-relaxed">Shukriya Janab! Aapka order mil gaya. Hum jald hi aapko confirm karenge. Payment screenshot WhatsApp par zaroor bhejein.</p>
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/5 px-6 py-4 text-sm text-amber-200">
              🧔 Ustaad Ji ka wada — 7-din warranty ke saath aapka phone verified hai.
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <a href="https://wa.me/923001234567?text=Assalam o Alaikum! Maine order place kiya hai. Payment screenshot bhej raha/rahi hoon."
                target="_blank" rel="noopener noreferrer"
                className="rounded-2xl bg-green-500 px-6 py-3 text-sm font-bold text-white hover:bg-green-400 transition">
                Send Screenshot on WhatsApp
              </a>
              <a href="/shop" className="rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/60 hover:text-white transition">Browse More</a>
            </div>
          </div>
        )}

        {step !== "success" && (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div>
              {/* Steps */}
              <div className="mb-8 flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step === "details" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}>
                  {step === "details" ? "1" : "✓"}
                </div>
                <span className={`text-sm font-medium ${step === "details" ? "text-white" : "text-green-400"}`}>Your Details</span>
                <div className="h-px flex-1 bg-white/10" />
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step === "payment" ? "bg-blue-500 text-white" : "bg-white/10 text-white/30"}`}>2</div>
                <span className={`text-sm font-medium ${step === "payment" ? "text-white" : "text-white/30"}`}>Payment</span>
              </div>

              {/* Step 1 — Details */}
              {step === "details" && (
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-6">Your Details</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-white/50">Full Name *</label>
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        placeholder="Ahmed Khan"
                        maxLength={100}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-blue-400/50"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-white/50">WhatsApp Number *</label>
                      <input
                        required
                        value={form.phone}
                        onChange={e => setForm({...form, phone: sanitizePhone(e.target.value)})}
                        placeholder="03001234567"
                        maxLength={20}
                        type="tel"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-blue-400/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/50">Email (optional — get 5% discount)</label>
                    <input
                      value={form.email}
                      onChange={e => setForm({...form, email: sanitizeEmail(e.target.value)})}
                      placeholder="ahmed@gmail.com"
                      type="email"
                      maxLength={254}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-blue-400/50"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-white/50">City *</label>
                      <input
                        required
                        value={form.city}
                        onChange={e => setForm({...form, city: e.target.value})}
                        placeholder="Islamabad"
                        maxLength={100}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-blue-400/50"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-white/50">Full Address</label>
                      <input
                        value={form.address}
                        onChange={e => setForm({...form, address: e.target.value})}
                        placeholder="House 123, Street 4..."
                        maxLength={300}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-blue-400/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/50">Special Notes (optional)</label>
                    <textarea
                      value={form.notes}
                      onChange={e => setForm({...form, notes: e.target.value})}
                      placeholder="Koi special instruction..."
                      rows={3}
                      maxLength={500}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-blue-400/50 resize-none"
                    />
                  </div>

                  {/* Coupon Code */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/50">Coupon Code (optional)</label>
                    <div className="flex gap-2">
                      <input
                        value={couponInput}
                        onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); setCouponApplied(false); }}
                        placeholder="e.g. WELCOME5"
                        maxLength={20}
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-blue-400/50 uppercase"
                      />
                      <button type="button" onClick={applyCoupon}
                        className="rounded-xl border border-white/20 px-4 py-3 text-xs font-bold text-white transition hover:border-white/40">
                        Apply
                      </button>
                    </div>
                    {couponApplied && (
                      <p className="mt-1.5 text-xs text-green-400">✓ WELCOME5 applied — 5% discount!</p>
                    )}
                    {couponError && (
                      <p className="mt-1.5 text-xs text-red-400">{couponError}</p>
                    )}
                  </div>

                  <button type="submit" className="w-full rounded-2xl bg-blue-500 py-4 text-sm font-bold text-white transition hover:bg-blue-400">
                    Continue to Payment →
                  </button>
                  <p className="text-center text-xs text-white/25">🔒 SSL Secured • Your information is safe with us</p>
                </form>
              )}

              {/* Step 2 — Payment */}
              {step === "payment" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Choose Payment Method</h2>
                  <div className="grid gap-3">
                    {paymentMethods.map((method) => (
                      <button key={method.id} onClick={() => setSelectedPayment(method.id as PaymentMethod)}
                        className={`flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition ${selectedPayment === method.id ? "border-blue-400/60 bg-blue-500/10 text-white" : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/25"}`}>
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium">{method.label}</span>
                        {selectedPayment === method.id && <span className="ml-auto text-blue-400">✓</span>}
                      </button>
                    ))}
                  </div>
                  {selectedPayment && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">{paymentDetails[selectedPayment].title} Details</p>
                      <pre className="whitespace-pre-wrap text-sm font-medium text-white leading-relaxed">{paymentDetails[selectedPayment].detail}</pre>
                      <p className="mt-4 text-xs text-amber-300">⚠️ {paymentDetails[selectedPayment].note}</p>
                    </div>
                  )}
                  {selectedPayment && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                      <p className="text-sm font-semibold text-white mb-2">📸 Payment Screenshot</p>
                      <p className="text-xs text-white/40 leading-relaxed">Payment complete karne ke baad screenshot WhatsApp par bhejein: <span className="text-blue-400">wa.me/923001234567</span></p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button onClick={() => setStep("details")} className="rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/60 hover:text-white transition">← Back</button>
                    <button onClick={handleOrderSubmit} disabled={!selectedPayment || submitting}
                      className="flex-1 rounded-2xl bg-green-500 py-3 text-sm font-bold text-white transition hover:bg-green-400 disabled:opacity-40">
                      {submitting ? "Placing Order..." : "Place Order ✓"}
                    </button>
                  </div>
                  <p className="text-center text-xs text-white/25">🔒 SSL Secured • 🛡️ 7-Day Warranty • 📍 Physical Store Wah Cantt</p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 h-fit space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">Order Summary</p>
                {isCartCheckout && items.length > 0 ? (
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                          {item.image ? <img src={item.image} alt="" className="h-full w-full object-contain p-1" /> : <span className="text-lg">📱</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{item.model}</p>
                          <p className="text-xs text-white/40">{item.storage} • {item.category}</p>
                        </div>
                        <p className="text-sm font-bold text-white shrink-0">Rs. {(item.discount_price ?? item.price).toLocaleString()}</p>
                      </div>
                    ))}
                    <div className="border-t border-white/10 pt-3 mt-3 space-y-1">
                      <div className="flex justify-between"><span className="text-sm text-white/50">Delivery</span><span className="text-sm font-bold text-green-400">Free</span></div>
                      {couponApplied && (
                        <div className="flex justify-between"><span className="text-sm text-green-400">Coupon (WELCOME5)</span><span className="text-sm font-bold text-green-400">-Rs. {discount.toLocaleString()}</span></div>
                      )}
                      <div className="flex justify-between"><span className="font-bold text-white">Total ({count} items)</span><span className="font-extrabold text-white">Rs. {finalPrice.toLocaleString()}</span></div>
                    </div>
                  </div>
                ) : phone ? (
                  <>
                    <div className="mb-4 flex h-32 items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
                      {phone.images?.[0] ? <img src={phone.images[0]} alt={phone.model} className="h-full w-full object-contain p-3" /> : <span className="text-white/20 text-3xl">📱</span>}
                    </div>
                    <p className="font-bold text-white">{phone.model}</p>
                    <p className="text-sm text-white/50">{phone.storage} • {phone.color} • {phone.category}</p>
                    <div className="mt-4 border-t border-white/10 pt-4 space-y-1">
                      <div className="flex justify-between"><span className="text-sm text-white/50">Price</span><span className="text-sm font-bold text-white">Rs. {basePrice.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-sm text-white/50">Delivery</span><span className="text-sm font-bold text-green-400">Free</span></div>
                      {couponApplied && (
                        <div className="flex justify-between"><span className="text-sm text-green-400">Coupon (WELCOME5)</span><span className="text-sm font-bold text-green-400">-Rs. {discount.toLocaleString()}</span></div>
                      )}
                      <div className="flex justify-between border-t border-white/10 pt-2 mt-2"><span className="font-bold text-white">Total</span><span className="font-extrabold text-white">Rs. {finalPrice.toLocaleString()}</span></div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-white/40">No items selected</p>
                )}
                <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/5 p-3">
                  <p className="text-xs text-amber-200">🧔 Ustaad Ji Verified • 7-Day Warranty</p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">Why Trust Us</p>
                <div className="space-y-3">
                  {trustBadges.map((badge) => (
                    <div key={badge.title} className="flex items-center gap-3">
                      <span className="text-lg">{badge.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-white">{badge.title}</p>
                        <p className="text-[10px] text-white/40">{badge.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-black"><p className="animate-pulse text-white/40">Loading...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
}