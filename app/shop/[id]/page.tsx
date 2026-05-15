"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/app/components/CartContext";

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
  in_stock: boolean;
  featured: boolean;
  badge: string | null;
  images: string[];
  condition_video: string | null;
  battery_screenshot: string | null;
  description: string | null;
  sim_status: string | null;
  accessories_included: string | null;
  region: string | null;
  ios_version: string | null;
  model_number: string | null;
  free_case: boolean;
};

type Review = {
  id: string;
  customer_name: string;
  customer_city: string;
  rating: number;
  review_text: string;
  verified_buyer: boolean;
  created_at: string;
};

const categoryColors: Record<string, string> = {
  PTA: "bg-green-500/20 text-green-300 border-green-500/30",
  "Non-PTA": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  JV: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  WiFi: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Cellular: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

const categoryDescriptions: Record<string, string> = {
  PTA: "Officially registered. SIM-ready from day one. Zero tension.",
  "Non-PTA": "Factory unlocked. SIM works ~2 months, then PTA registration needed.",
  JV: "Carrier-locked. Full iPhone power for WiFi & secondary use.",
  WiFi: "WiFi only. No SIM slot. Perfect for home and office use.",
  Cellular: "SIM + WiFi. Works anywhere with data or WiFi.",
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg key={star} viewBox="0 0 20 20" fill={star <= rating ? "#FBBF24" : "none"} stroke="#FBBF24" strokeWidth="1" className="h-4 w-4">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const StarSelector = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button key={star} type="button" onClick={() => onChange(star)}>
        <svg viewBox="0 0 20 20" fill={star <= value ? "#FBBF24" : "none"} stroke="#FBBF24" strokeWidth="1" className="h-7 w-7 transition hover:scale-110">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    ))}
  </div>
);

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const { addItem, isInCart } = useCart();

  const [phone, setPhone] = useState<Phone | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: "", city: "", rating: 5, text: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showDiscountBanner, setShowDiscountBanner] = useState(false);

  useEffect(() => {
    const fetchPhone = async () => {
      const { data, error } = await supabase.from("phones").select("*").eq("id", id).single();
      if (!error && data) setPhone(data);
      setLoading(false);
    };
    if (id) fetchPhone();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!phone) return;
      const { data } = await supabase.from("reviews").select("*").eq("approved", true).eq("product_model", phone.model).order("created_at", { ascending: false });
      if (data) setReviews(data);
    };
    fetchReviews();
  }, [phone]);

  useEffect(() => {
    const dismissed = localStorage.getItem("phonesai_discount_banner_dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setShowDiscountBanner(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.text || !phone) return;
    setSubmittingReview(true);
    await supabase.from("reviews").insert({
      customer_name: reviewForm.name, customer_city: reviewForm.city,
      rating: reviewForm.rating, review_text: reviewForm.text,
      product_model: phone.model, review_type: "product",
      verified_buyer: false, approved: false,
    });
    setSubmittingReview(false);
    setReviewSubmitted(true);
  };

  const whatsappLink = phone
    ? `https://wa.me/923001234567?text=Assalam o Alaikum! Ustaad Ji ne bheja hai. Mujhe ${phone.model} ${phone.storage} ${phone.color} (${phone.category}) mein interest hai.`
    : `https://wa.me/923001234567`;

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-black"><p className="animate-pulse text-white/40">Loading...</p></div>;
  }

  if (!phone) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <p className="text-2xl font-bold text-white/30">Phone not found</p>
        <a href="/shop" className="mt-4 text-blue-400 hover:underline">← Back to Shop</a>
      </div>
    );
  }

  const allImages = phone.images?.length > 0 ? phone.images : [];
  const avgRating = reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : null;
  const inCart = isInCart(phone.id);

  return (
    <div className="min-h-screen bg-black text-white pt-20">

      {/* 5% Discount Banner */}
      {showDiscountBanner && (
        <div className="fixed bottom-6 left-6 z-40 w-64 rounded-2xl border border-blue-400/30 bg-[#0a0a0a] p-4 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <button onClick={() => { setShowDiscountBanner(false); localStorage.setItem("phonesai_discount_banner_dismissed", "true"); }}
            className="absolute right-3 top-3 text-white/30 transition hover:text-white text-xs">✕</button>
          <p className="text-lg mb-1">🎁</p>
          <p className="text-sm font-bold text-white">5% Off First Order!</p>
          <p className="mt-1 text-xs text-white/50 leading-relaxed">Email register karein aur pehli purchase pe 5% bachayein.</p>
          <button onClick={() => { setShowDiscountBanner(false); localStorage.setItem("phonesai_discount_banner_dismissed", "true"); window.dispatchEvent(new CustomEvent("openUstaadJi")); }}
            className="mt-3 w-full rounded-xl bg-blue-500/20 border border-blue-400/30 py-2 text-xs font-semibold text-blue-200 transition hover:bg-blue-500/30">
            Claim Discount →
          </button>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-6 py-12 pb-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative flex h-[420px] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
              {allImages.length > 0 ? (
                <img src={allImages[activeImage]} alt={phone.model} className="h-full w-full object-contain p-8 transition duration-500" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-white/20">
                  <svg viewBox="0 0 24 24" fill="none" className="h-20 w-20" stroke="currentColor" strokeWidth="0.8">
                    <rect x="7" y="2.5" width="10" height="19" rx="2.4" />
                    <path d="M10 5.5H14" strokeLinecap="round" />
                    <circle cx="12" cy="18.5" r="1" fill="currentColor" />
                  </svg>
                  <p className="text-sm">Photos coming soon</p>
                </div>
              )}
              {phone.badge && <span className="absolute left-4 top-4 rounded-full border border-purple-500/30 bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300">{phone.badge}</span>}
              {phone.free_case && phone.condition === "Used" && <span className="absolute right-4 top-4 rounded-full border border-green-500/30 bg-green-500/20 px-3 py-1 text-xs font-medium text-green-300">Free Case 🎁</span>}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition ${activeImage === i ? "border-blue-400/60" : "border-white/10 opacity-50 hover:opacity-80"}`}>
                    <img src={img} alt="" className="h-full w-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
            {phone.condition_video && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">Condition Video</p>
                <video src={phone.condition_video} controls className="w-full rounded-xl" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${categoryColors[phone.category] ?? "border-white/20 bg-white/10 text-white/60"}`}>{phone.category}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">{phone.condition}</span>
              {phone.five_g && <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-300">5G Ready</span>}
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{phone.model}</h1>
            <p className="mt-2 text-lg text-white/50">{phone.storage} • {phone.color}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/40">{categoryDescriptions[phone.category]}</p>

            {avgRating && (
              <div className="mt-4 flex items-center gap-2">
                <StarRating rating={Math.round(parseFloat(avgRating))} />
                <span className="text-sm font-bold text-white">{avgRating}</span>
                <span className="text-sm text-white/40">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
              </div>
            )}

            {/* Price */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5">
              {phone.discount_price ? (
                <>
                  <p className="text-sm text-white/30 line-through">Rs. {phone.price.toLocaleString()}</p>
                  <p className="text-4xl font-extrabold text-white">Rs. {phone.discount_price.toLocaleString()}</p>
                </>
              ) : (
                <p className="text-4xl font-extrabold text-white">Rs. {phone.price.toLocaleString()}</p>
              )}
              <p className="mt-1 text-xs text-white/30">Fixed price • No hidden charges</p>
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => addItem({ id: phone.id, model: phone.model, storage: phone.storage, color: phone.color, category: phone.category, brand: phone.brand, condition: phone.condition, price: phone.price, discount_price: phone.discount_price, image: allImages[0] ?? null, free_case: phone.free_case })}
              className={`mt-4 w-full rounded-2xl py-4 text-sm font-bold transition ${inCart ? "border border-green-500/30 bg-green-500/10 text-green-300" : "bg-blue-500 text-white hover:bg-blue-400"}`}
            >
              {inCart ? "✓ Added to Cart — View in Cart ↑" : "Add to Cart 🛒"}
            </button>

            {/* Free Case */}
            {phone.free_case && phone.condition === "Used" && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/5 px-5 py-4">
                <span className="text-2xl">🎁</span>
                <div>
                  <p className="text-sm font-bold text-green-300">Free Case + Screen Protector!</p>
                  <p className="text-xs text-white/40">Is used phone ke saath free cover aur screen protector included hai</p>
                </div>
              </div>
            )}

            {/* Ustaad Ji Verified */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/5 px-5 py-4">
              <span className="text-2xl">🧔</span>
              <div>
                <p className="text-sm font-bold text-amber-200">Ustaad Ji Verified</p>
                <p className="text-xs text-white/40">7-Day Checking Warranty • Supplier Guaranteed • Ekdum Asli</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {phone.battery_health && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="mb-2 text-xs text-white/40">Battery Health</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-extrabold text-white">{phone.battery_health}%</p>
                    <span className="mb-0.5 text-xs text-white/30">🔋</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: `${phone.battery_health}%` }} />
                  </div>
                </div>
              )}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <p className="mb-2 text-xs text-white/40">Condition</p>
                <p className="text-2xl font-extrabold text-white">{phone.physical_condition ?? "10/10"}</p>
                <p className="mt-1 text-xs text-white/30">✨ Zero scratches</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <p className="mb-2 text-xs text-white/40">Face ID</p>
                <p className="text-2xl font-extrabold text-white">{phone.face_id ? "✅" : "❌"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <p className="mb-2 text-xs text-white/40">True Tone</p>
                <p className="text-2xl font-extrabold text-white">{phone.true_tone ? "✅" : "❌"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="my-16 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Specs */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">SIM Status</p>
            <p className="text-lg font-bold text-white">{phone.sim_status ?? "Check category"}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/40">{categoryDescriptions[phone.category]}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">In the Box</p>
            <p className="text-lg font-bold text-white">{phone.accessories_included ?? "Phone only"}</p>
            <p className="mt-2 text-sm text-white/40">Everything listed is verified and included</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">Model Info</p>
            <div className="space-y-2">
              {phone.region && <div className="flex justify-between"><span className="text-sm text-white/40">Region</span><span className="text-sm font-semibold text-white">{phone.region}</span></div>}
              {phone.ios_version && <div className="flex justify-between"><span className="text-sm text-white/40">OS</span><span className="text-sm font-semibold text-white">{phone.ios_version}</span></div>}
              {phone.five_g && <div className="flex justify-between"><span className="text-sm text-white/40">5G</span><span className="text-sm font-semibold text-blue-300">Ready ✓</span></div>}
            </div>
          </div>
        </div>

        {(phone.category === "Non-PTA" || phone.category === "JV") && (
          <div className="mt-8 rounded-2xl border border-blue-400/20 bg-blue-500/5 p-6">
            <p className="mb-2 text-sm font-bold text-blue-300">
              {phone.category === "JV" ? "⚠️ JV Phone — SIM Locked" : "ℹ️ Non-PTA — PTA Registration Info"}
            </p>
            <p className="text-sm leading-relaxed text-white/50">
              {phone.category === "JV" ? "Yeh phone permanently SIM-locked hai. WiFi aur secondary use ke liye perfect hai." : "Is phone ki SIM approximately 2 mahine chalegi. Baad mein PTA registration karni padegi."}
            </p>
            {phone.category === "Non-PTA" && (
              <a href="https://taxcalculator.pk/pta-tax" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-400 transition hover:text-blue-300">
                Check PTA Tax → taxcalculator.pk/pta-tax
              </a>
            )}
          </div>
        )}

        {phone.description && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Ustaad Ji Notes</p>
            <p className="text-sm leading-relaxed text-white/70">{phone.description}</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="text-xl font-bold text-white">Ready to lock this piece?</p>
          <p className="text-sm text-white/40">7-din warranty • Verified supplier • Wah Cantt physical store</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-8 py-4 text-sm font-bold text-white transition hover:bg-green-400">
              WhatsApp Boss
            </a>
            <a href="/checkout?cart=true" className="flex items-center justify-center rounded-2xl bg-blue-500 px-8 py-4 text-sm font-bold text-white transition hover:bg-blue-400">
              Checkout →
            </a>
            <button onClick={() => window.dispatchEvent(new CustomEvent("openUstaadJi"))}
              className="flex items-center justify-center rounded-2xl border border-white/15 px-8 py-4 text-sm font-semibold text-white/60 transition hover:text-white">
              🤖 Ask Ustaad Ji
            </button>
          </div>
        </div>

        <div className="my-16 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Reviews */}
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-2">Customer Reviews</h2>
          {avgRating ? (
            <div className="mt-2 flex items-center gap-2 mb-8">
              <StarRating rating={Math.round(parseFloat(avgRating))} />
              <span className="text-sm font-bold text-white">{avgRating} out of 5</span>
              <span className="text-sm text-white/40">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
            </div>
          ) : <p className="mt-1 text-sm text-white/40 mb-8">Be the first to review this phone!</p>}

          {reviews.length > 0 && (
            <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col gap-3">
                  <StarRating rating={review.rating} />
                  <p className="text-sm text-white/80 leading-relaxed">"{review.review_text}"</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{review.customer_name}</p>
                      <p className="text-xs text-white/40">{review.customer_city}</p>
                    </div>
                    {review.verified_buyer && <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-xs text-green-300">✓ Verified</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="mb-6 text-lg font-bold text-white">Leave a Review</h3>
            {reviewSubmitted ? (
              <div className="text-center py-6">
                <p className="text-3xl mb-3">✅</p>
                <p className="font-bold text-white">Shukriya Janab!</p>
                <p className="mt-1 text-sm text-white/50">Aapka review submit ho gaya. Hum jald hi approve karenge.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Your Name *</label>
                    <input required value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})}
                      placeholder="Ahmed Khan"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/40">City</label>
                    <input value={reviewForm.city} onChange={e => setReviewForm({...reviewForm, city: e.target.value})}
                      placeholder="Islamabad"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs text-white/40">Rating *</label>
                  <StarSelector value={reviewForm.rating} onChange={(v) => setReviewForm({...reviewForm, rating: v})} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/40">Your Review *</label>
                  <textarea required value={reviewForm.text} onChange={e => setReviewForm({...reviewForm, text: e.target.value})}
                    placeholder="Aapka experience kaisa tha?" rows={4}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50 resize-none" />
                </div>
                <button type="submit" disabled={submittingReview}
                  className="w-full rounded-xl bg-blue-500 py-3 text-sm font-bold text-white transition hover:bg-blue-400 disabled:opacity-50">
                  {submittingReview ? "Submitting..." : "Submit Review →"}
                </button>
                <p className="text-xs text-white/25 text-center">Reviews are approved before publishing</p>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}