"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/app/components/CartContext";

type Phone = {
  id: string; model: string; storage: string; color: string; category: string; brand: string;
  condition: string; price: number; discount_price: number | null; battery_health: number;
  physical_condition: string; five_g: boolean; face_id: boolean; true_tone: boolean;
  in_stock: boolean; featured: boolean; badge: string | null; images: string[];
  condition_video: string | null; battery_screenshot: string | null; description: string | null;
  sim_status: string | null; accessories_included: string | null; region: string | null;
  ios_version: string | null; model_number: string | null; free_case: boolean;
};

type Review = {
  id: string; customer_name: string; customer_city: string; rating: number;
  review_text: string; verified_buyer: boolean; created_at: string;
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
    {[1,2,3,4,5].map((star) => (
      <svg key={star} viewBox="0 0 20 20" fill={star <= rating ? "#FBBF24" : "none"} stroke="#FBBF24" strokeWidth="1" className="h-4 w-4">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const StarSelector = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map((star) => (
      <button key={star} type="button" onClick={() => onChange(star)}>
        <svg viewBox="0 0 20 20" fill={star <= value ? "#FBBF24" : "none"} stroke="#FBBF24" strokeWidth="1" className="h-8 w-8 transition hover:scale-110">
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

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-black"><p className="animate-pulse text-white/40">Loading...</p></div>;

  if (!phone) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <p className="text-2xl font-bold text-white/30">Phone not found</p>
      <a href="/shop" className="mt-4 text-blue-400 hover:underline">← Back to Shop</a>
    </div>
  );

  const allImages = phone.images?.length > 0 ? phone.images : [];
  const avgRating = reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : null;
  const inCart = isInCart(phone.id);

  return (
    <div className="min-h-screen bg-black text-white pt-16 sm:pt-20">

      {/* 5% Discount Banner */}
      {showDiscountBanner && (
        <div className="fixed bottom-20 left-3 z-40 w-56 rounded-2xl border border-blue-400/30 bg-[#0a0a0a] p-3 shadow-[0_0_30px_rgba(59,130,246,0.2)] sm:bottom-6 sm:left-6 sm:w-64 sm:p-4">
          <button onClick={() => { setShowDiscountBanner(false); localStorage.setItem("phonesai_discount_banner_dismissed", "true"); }}
            className="absolute right-2 top-2 text-white/30 transition hover:text-white text-xs">✕</button>
          <p className="text-base mb-1">🎁</p>
          <p className="text-xs font-bold text-white sm:text-sm">5% Off First Order!</p>
          <p className="mt-1 text-[10px] text-white/50 leading-relaxed sm:text-xs">Email register karein aur pehli purchase pe 5% bachayein.</p>
          <button onClick={() => { setShowDiscountBanner(false); localStorage.setItem("phonesai_discount_banner_dismissed", "true"); window.dispatchEvent(new CustomEvent("openEmailPopup")); }}
            className="mt-2 w-full rounded-xl bg-blue-500/20 border border-blue-400/30 py-1.5 text-[10px] font-semibold text-blue-200 transition hover:bg-blue-500/30 sm:py-2 sm:text-xs">
            Claim Discount →
          </button>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 sm:py-10">

        {/* Back link */}
        <a href="/shop" className="mb-4 inline-flex items-center gap-1 text-xs text-white/40 hover:text-white transition sm:mb-6">
          ← Back to Shop
        </a>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">

          {/* Image Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:h-[420px] sm:rounded-3xl">
              {allImages.length > 0 ? (
                <img src={allImages[activeImage]} alt={phone.model} className="h-full w-full object-contain p-6 transition duration-500 sm:p-8" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-white/20">
                  <svg viewBox="0 0 24 24" fill="none" className="h-14 w-14" stroke="currentColor" strokeWidth="0.8">
                    <rect x="7" y="2.5" width="10" height="19" rx="2.4" />
                    <path d="M10 5.5H14" strokeLinecap="round" />
                    <circle cx="12" cy="18.5" r="1" fill="currentColor" />
                  </svg>
                  <p className="text-xs">Photos coming soon</p>
                </div>
              )}
              {phone.badge && <span className="absolute left-3 top-3 rounded-full border border-purple-500/30 bg-purple-500/20 px-2.5 py-0.5 text-xs font-medium text-purple-300">{phone.badge}</span>}
              {phone.free_case && phone.condition === "Used" && <span className="absolute right-3 top-3 rounded-full border border-green-500/30 bg-green-500/20 px-2.5 py-0.5 text-xs text-green-300">Free Case 🎁</span>}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border transition ${activeImage === i ? "border-blue-400/60" : "border-white/10 opacity-50"}`}>
                    <img src={img} alt="" className="h-full w-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-3 flex flex-wrap gap-1.5">
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryColors[phone.category] ?? "border-white/20 bg-white/10 text-white/60"}`}>{phone.category}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/50">{phone.condition}</span>
              {phone.five_g && <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-0.5 text-xs font-semibold text-blue-300">5G Ready</span>}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">{phone.model}</h1>
            <p className="mt-1.5 text-base text-white/50">{phone.storage} • {phone.color}</p>
            <p className="mt-2 text-xs leading-relaxed text-white/40 sm:text-sm">{categoryDescriptions[phone.category]}</p>

            {avgRating && (
              <div className="mt-3 flex items-center gap-2">
                <StarRating rating={Math.round(parseFloat(avgRating))} />
                <span className="text-sm font-bold text-white">{avgRating}</span>
                <span className="text-xs text-white/40">({reviews.length} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 sm:px-6 sm:py-5">
              {phone.discount_price ? (
                <>
                  <p className="text-xs text-white/30 line-through">Rs. {phone.price.toLocaleString()}</p>
                  <p className="text-3xl font-extrabold text-white sm:text-4xl">Rs. {phone.discount_price.toLocaleString()}</p>
                </>
              ) : (
                <p className="text-3xl font-extrabold text-white sm:text-4xl">Rs. {phone.price.toLocaleString()}</p>
              )}
              <p className="mt-1 text-xs text-white/30">Fixed price • No hidden charges</p>
            </div>

            {/* Add to Cart — sticky on mobile */}
            <button
              onClick={() => addItem({ id: phone.id, model: phone.model, storage: phone.storage, color: phone.color, category: phone.category, brand: phone.brand, condition: phone.condition, price: phone.price, discount_price: phone.discount_price, image: allImages[0] ?? null, free_case: phone.free_case })}
              className={`mt-3 w-full rounded-2xl py-4 text-sm font-bold transition ${inCart ? "border border-green-500/30 bg-green-500/10 text-green-300" : "bg-blue-500 text-white hover:bg-blue-400"}`}
            >
              {inCart ? "✓ Added to Cart — View in Cart ↑" : "Add to Cart 🛒"}
            </button>

            {/* Free Case */}
            {phone.free_case && phone.condition === "Used" && (
              <div className="mt-3 flex items-center gap-2.5 rounded-2xl border border-green-500/20 bg-green-500/5 px-4 py-3">
                <span className="text-xl">🎁</span>
                <div>
                  <p className="text-xs font-bold text-green-300 sm:text-sm">Free Case + Screen Protector!</p>
                  <p className="text-[10px] text-white/40">Is used phone ke saath free cover included</p>
                </div>
              </div>
            )}

            {/* Ustaad Ji */}
            <div className="mt-3 flex items-center gap-2.5 rounded-2xl border border-amber-300/20 bg-amber-300/5 px-4 py-3">
              <span className="text-xl">🧔</span>
              <div>
                <p className="text-xs font-bold text-amber-200 sm:text-sm">Ustaad Ji Verified</p>
                <p className="text-[10px] text-white/40">7-Day Warranty • Supplier Guaranteed • Ekdum Asli</p>
              </div>
            </div>

            {/* Stats Grid — 2x2 */}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
              {phone.battery_health && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
                  <p className="mb-1 text-[10px] text-white/40 sm:text-xs">Battery Health</p>
                  <p className="text-xl font-extrabold text-white sm:text-2xl">{phone.battery_health}%</p>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: `${phone.battery_health}%` }} />
                  </div>
                </div>
              )}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
                <p className="mb-1 text-[10px] text-white/40 sm:text-xs">Condition</p>
                <p className="text-xl font-extrabold text-white sm:text-2xl">{phone.physical_condition ?? "10/10"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
                <p className="mb-1 text-[10px] text-white/40 sm:text-xs">Face ID</p>
                <p className="text-xl font-extrabold text-white sm:text-2xl">{phone.face_id ? "✅" : "❌"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
                <p className="mb-1 text-[10px] text-white/40 sm:text-xs">True Tone</p>
                <p className="text-xl font-extrabold text-white sm:text-2xl">{phone.true_tone ? "✅" : "❌"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent sm:my-14" />

        {/* Specs */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30 sm:mb-4 sm:text-xs">SIM Status</p>
            <p className="text-base font-bold text-white sm:text-lg">{phone.sim_status ?? "Check category"}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/40">{categoryDescriptions[phone.category]}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30 sm:mb-4 sm:text-xs">In the Box</p>
            <p className="text-base font-bold text-white sm:text-lg">{phone.accessories_included ?? "Phone only"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30 sm:mb-4 sm:text-xs">Model Info</p>
            <div className="space-y-1.5">
              {phone.region && <div className="flex justify-between"><span className="text-xs text-white/40">Region</span><span className="text-xs font-semibold text-white">{phone.region}</span></div>}
              {phone.ios_version && <div className="flex justify-between"><span className="text-xs text-white/40">OS</span><span className="text-xs font-semibold text-white">{phone.ios_version}</span></div>}
              {phone.five_g && <div className="flex justify-between"><span className="text-xs text-white/40">5G</span><span className="text-xs font-semibold text-blue-300">Ready ✓</span></div>}
            </div>
          </div>
        </div>

        {(phone.category === "Non-PTA" || phone.category === "JV") && (
          <div className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-500/5 p-4 sm:mt-6 sm:p-6">
            <p className="mb-1.5 text-xs font-bold text-blue-300 sm:text-sm">
              {phone.category === "JV" ? "⚠️ JV Phone — SIM Locked" : "ℹ️ Non-PTA — PTA Registration Info"}
            </p>
            <p className="text-xs leading-relaxed text-white/50">
              {phone.category === "JV" ? "Yeh phone permanently SIM-locked hai. WiFi aur secondary use ke liye perfect hai." : "Is phone ki SIM approximately 2 mahine chalegi. Baad mein PTA registration karni padegi."}
            </p>
            {phone.category === "Non-PTA" && (
              <a href="https://taxcalculator.pk/pta-tax" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-xs font-semibold text-blue-400">
                Check PTA Tax → taxcalculator.pk/pta-tax
              </a>
            )}
          </div>
        )}

        {phone.description && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:mt-6 sm:p-6">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">Ustaad Ji Notes</p>
            <p className="text-xs leading-relaxed text-white/70 sm:text-sm">{phone.description}</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-col items-center gap-3 text-center sm:mt-14 sm:gap-4">
          <p className="text-lg font-bold text-white sm:text-xl">Ready to lock this piece?</p>
          <p className="text-xs text-white/40">7-din warranty • Verified supplier • Wah Cantt physical store</p>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-green-400">
              WhatsApp Boss
            </a>
            <a href="/checkout?cart=true"
              className="flex items-center justify-center rounded-2xl bg-blue-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-400">
              Checkout →
            </a>
            <button onClick={() => window.dispatchEvent(new CustomEvent("openUstaadJi"))}
              className="flex items-center justify-center rounded-2xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-white/60 transition hover:text-white">
              🤖 Ask Ustaad Ji
            </button>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent sm:my-14" />

        {/* Reviews */}
        <div>
          <h2 className="text-xl font-extrabold text-white mb-1 sm:text-2xl">Customer Reviews</h2>
          {avgRating ? (
            <div className="flex items-center gap-2 mb-6">
              <StarRating rating={Math.round(parseFloat(avgRating))} />
              <span className="text-sm font-bold text-white">{avgRating}</span>
              <span className="text-xs text-white/40">({reviews.length} reviews)</span>
            </div>
          ) : <p className="text-sm text-white/40 mb-6">Be the first to review!</p>}

          {reviews.length > 0 && (
            <div className="mb-8 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col gap-2 sm:p-6 sm:gap-3">
                  <StarRating rating={review.rating} />
                  <p className="text-xs text-white/80 leading-relaxed sm:text-sm">"{review.review_text}"</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{review.customer_name}</p>
                      <p className="text-xs text-white/40">{review.customer_city}</p>
                    </div>
                    {review.verified_buyer && <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] text-green-300">✓ Verified</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Review Form */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
            <h3 className="mb-4 text-base font-bold text-white sm:mb-6 sm:text-lg">Leave a Review</h3>
            {reviewSubmitted ? (
              <div className="text-center py-6">
                <p className="text-3xl mb-3">✅</p>
                <p className="font-bold text-white">Shukriya Janab!</p>
                <p className="mt-1 text-sm text-white/50">Review submit ho gaya. Hum jald approve karenge.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid gap-3 grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-white/40">Your Name *</label>
                    <input required value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})}
                      placeholder="Ahmed Khan"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/40">City</label>
                    <input value={reviewForm.city} onChange={e => setReviewForm({...reviewForm, city: e.target.value})}
                      placeholder="Islamabad"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs text-white/40">Rating *</label>
                  <StarSelector value={reviewForm.rating} onChange={(v) => setReviewForm({...reviewForm, rating: v})} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/40">Your Review *</label>
                  <textarea required value={reviewForm.text} onChange={e => setReviewForm({...reviewForm, text: e.target.value})}
                    placeholder="Aapka experience kaisa tha?" rows={3}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50 resize-none" />
                </div>
                <button type="submit" disabled={submittingReview}
                  className="w-full rounded-xl bg-blue-500 py-3 text-sm font-bold text-white transition hover:bg-blue-400 disabled:opacity-50">
                  {submittingReview ? "Submitting..." : "Submit Review →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}