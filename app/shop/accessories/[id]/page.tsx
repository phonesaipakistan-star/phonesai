"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/app/components/CartContext";

const SUPABASE_URL = "https://xadxdkbdwyulprfukrjb.supabase.co";

type Accessory = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  discount_price: number | null;
  condition: string;
  in_stock: boolean;
  featured: boolean;
  is_original: boolean;
  description: string | null;
  compatible_with: string[] | null;
  images: string[];
  badge: string | null;
};

type Review = {
  id: string;
  customer_name: string;
  customer_city: string;
  rating: number;
  review_text: string;
  verified_buyer: boolean;
  created_at: string;
  photo_url: string | null;
};

const categoryIcons: Record<string, string> = {
  Charger: "🔌",
  Cable: "🔗",
  AirPods: "🎧",
  "Apple Watch": "⌚",
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

export default function AccessoryPage() {
  const params = useParams();
  const id = params?.id as string;
  const { addItem, isInCart } = useCart();

  const [accessory, setAccessory] = useState<Accessory | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: "", city: "", rating: 5, text: "" });
  const [reviewPhoto, setReviewPhoto] = useState<File | null>(null);
  const [reviewPhotoPreview, setReviewPhotoPreview] = useState<string | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchAccessory = async () => {
      const { data, error } = await supabase.from("accessories").select("*").eq("id", id).single();
      if (!error && data) setAccessory(data);
      setLoading(false);
    };
    if (id) fetchAccessory();
  }, [id]);

  useEffect(() => {
    if (!accessory) return;
    const fetchReviews = async () => {
      const { data } = await supabase.from("reviews").select("*")
        .eq("approved", true).eq("product_model", accessory.name)
        .order("created_at", { ascending: false });
      if (data) setReviews(data);
    };
    fetchReviews();
  }, [accessory]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReviewPhoto(file);
    setReviewPhotoPreview(URL.createObjectURL(file));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.text || !accessory) return;
    setSubmittingReview(true);
    let photoUrl: string | null = null;
    if (reviewPhoto) {
      const ext = reviewPhoto.name.split(".").pop();
      const fileName = `review-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("phone-images").upload(fileName, reviewPhoto, { upsert: true });
      if (!error) photoUrl = `${SUPABASE_URL}/storage/v1/object/public/phone-images/${fileName}`;
    }
    await supabase.from("reviews").insert({
      customer_name: reviewForm.name,
      customer_city: reviewForm.city,
      rating: reviewForm.rating,
      review_text: reviewForm.text,
      product_model: accessory.name,
      review_type: "product",
      verified_buyer: false,
      approved: false,
      photo_url: photoUrl,
    });
    setSubmittingReview(false);
    setReviewSubmitted(true);
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <p className="animate-pulse text-white/40">Loading...</p>
    </div>
  );

  if (!accessory) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <p className="text-2xl font-bold text-white/30">Product not found</p>
      <a href="/shop" className="mt-4 text-blue-400 hover:underline">← Back to Shop</a>
    </div>
  );

  const allImages = accessory.images?.length > 0 ? accessory.images : [];
  const avgRating = reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : null;
  const inCart = isInCart(accessory.id);
  const savings = accessory.discount_price ? accessory.price - accessory.discount_price : 0;
  const whatsappLink = `https://wa.me/923041502560?text=Assalam o Alaikum! Mujhe ${accessory.name} mein interest hai.`;

  return (
    <div className="min-h-screen bg-black text-white pt-16 sm:pt-20">
      <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 sm:py-10">

        <a href="/shop?brand=Accessories" className="mb-4 inline-flex items-center gap-1 text-xs text-white/40 hover:text-white transition sm:mb-6">
          ← Back to Accessories
        </a>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">

          {/* Image Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:rounded-3xl" style={{ aspectRatio: "1/1" }}>
              {allImages.length > 0 ? (
                <img
                  src={allImages[activeImage]}
                  alt={accessory.name}
                  className="absolute inset-0 h-full w-full object-contain p-6 transition duration-500"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl">
                  {categoryIcons[accessory.category] ?? "📦"}
                </div>
              )}
              {accessory.badge && (
                <span className="absolute left-3 top-3 rounded-full border border-purple-500/30 bg-purple-500/20 px-2.5 py-0.5 text-xs font-medium text-purple-300">
                  {accessory.badge}
                </span>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border transition ${activeImage === i ? "border-blue-400/60" : "border-white/10 opacity-50"}`}>
                    <img src={img} alt="" className="absolute inset-0 h-full w-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">

            {/* Badges */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/70 capitalize">
                {accessory.brand}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/70">
                {accessory.category}
              </span>
              {accessory.is_original && (
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                  ✓ Original
                </span>
              )}
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${accessory.condition === "New" ? "border-green-400/30 bg-green-400/10 text-green-300" : "border-amber-400/30 bg-amber-400/10 text-amber-300"}`}>
                {accessory.condition}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">{accessory.name}</h1>

            {avgRating && (
              <div className="mt-3 flex items-center gap-2">
                <StarRating rating={Math.round(parseFloat(avgRating))} />
                <span className="text-sm font-bold text-white">{avgRating}</span>
                <span className="text-xs text-white/40">({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
              </div>
            )}

            {/* Price */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 sm:px-6 sm:py-5">
              {accessory.discount_price ? (
                <div>
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-extrabold text-white sm:text-4xl">Rs. {accessory.discount_price.toLocaleString()}</p>
                    <p className="text-lg text-white/30 line-through sm:text-xl">Rs. {accessory.price.toLocaleString()}</p>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1">
                    <span className="text-xs font-bold text-green-400">You save Rs. {savings.toLocaleString()}</span>
                    <span className="text-xs text-green-400/60">({Math.round((savings / accessory.price) * 100)}% off)</span>
                  </div>
                </div>
              ) : (
                <p className="text-3xl font-extrabold text-white sm:text-4xl">Rs. {accessory.price.toLocaleString()}</p>
              )}
              <p className="mt-2 text-xs text-white/30">Fixed price • No hidden charges</p>
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => addItem({
                id: accessory.id,
                model: accessory.name,
                storage: "",
                color: "",
                selected_storage: "",
                selected_color: "",
                selected_condition_grade: "",
                battery_health: null,
                category: accessory.category,
                brand: accessory.brand,
                condition: accessory.condition,
                price: accessory.price,
                discount_price: accessory.discount_price,
                image: allImages[0] ?? null,
                free_case: false,
                is_accessory: true,
              })}
              disabled={!accessory.in_stock}
              className={`mt-3 w-full rounded-2xl py-4 text-sm font-bold transition disabled:opacity-40 ${inCart ? "border border-green-500/30 bg-green-500/10 text-green-300" : "bg-blue-500 text-white hover:bg-blue-400"}`}>
              {!accessory.in_stock ? "Sold Out" : inCart ? "✓ Added to Cart — View in Cart ↑" : "Add to Cart 🛒"}
            </button>

            {/* Ustaad Ji trust */}
            <div className="mt-3 flex items-center gap-2.5 rounded-2xl border border-amber-300/20 bg-amber-300/5 px-4 py-3">
              <span className="text-xl">🧔</span>
              <div>
                <p className="text-xs font-bold text-amber-200 sm:text-sm">Ustaad Ji Verified</p>
                <p className="text-[10px] text-white/40">Authentic product • Quality guaranteed</p>
              </div>
            </div>

            {/* Compatible with */}
            {accessory.compatible_with && accessory.compatible_with.length > 0 && (
              <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 sm:px-5 sm:py-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">Compatible With</p>
                <div className="flex flex-wrap gap-1.5">
                  {accessory.compatible_with.map((item, i) => (
                    <span key={i} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/60">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {accessory.description && (
              <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01]">
                <div className="border-b border-white/5 px-5 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">About This Product</p>
                </div>
                <div className="px-5 py-4">
                  <div className="space-y-2">
                    {accessory.description.split(/\.\s+/).filter(s => s.trim().length > 10).slice(0, 6).map((sentence, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400/60" />
                        <p className="text-xs leading-relaxed text-white/65 sm:text-sm">
                          {sentence.trim().endsWith(".") ? sentence.trim() : sentence.trim() + "."}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Delivery */}
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">Delivery</p>
              <p className="text-sm font-bold text-white">Free Delivery — All Pakistan</p>
              <p className="mt-1 text-xs text-white/40">Order before 2pm for next day delivery in nearby cities. All Pakistan: 1-3 working days.</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-col items-center gap-3 text-center sm:mt-14 sm:gap-4">
          <p className="text-lg font-bold text-white sm:text-xl">Interested? Let's talk.</p>
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
              <span className="text-xs text-white/40">({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
            </div>
          ) : <p className="text-sm text-white/40 mb-6">Be the first to review!</p>}

          {reviews.length > 0 && (
            <div className="mb-8 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col gap-2 sm:p-6 sm:gap-3">
                  <StarRating rating={review.rating} />
                  {review.photo_url && <img src={review.photo_url} alt="Review" className="w-full h-40 object-cover rounded-xl border border-white/10" />}
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
                <div>
                  <label className="mb-1 block text-xs text-white/40">Add Photo (optional) 📸</label>
                  {reviewPhotoPreview ? (
                    <div className="relative inline-block">
                      <img src={reviewPhotoPreview} alt="Preview" className="h-24 w-24 object-cover rounded-xl border border-white/10" />
                      <button type="button" onClick={() => { setReviewPhoto(null); setReviewPhotoPreview(null); }}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">✕</button>
                    </div>
                  ) : (
                    <label className="flex h-20 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 text-white/40 transition hover:border-white/40 hover:text-white/70">
                      <span className="text-xl">📷</span>
                      <span className="text-xs">Apni photo upload karein</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
                    </label>
                  )}
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