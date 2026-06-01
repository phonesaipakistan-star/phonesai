"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useCart } from "@/app/components/CartContext";
import {
  type PhoneVariant,
  type ConditionGrade,
  PRE_OWNED_GRADES,
  CONDITION_TAGS,
  CONDITION_DESCRIPTIONS,
  CONDITION_VISUAL,
  getVariantPrice,
  isVariantAvailable,
  getUniqueStorages,
  getUniqueColors,
  findVariant,
  legacyPhoneToVariant,
  getFreeAccessoryText,
  isNewPhone,
} from "@/lib/variants";

const SUPABASE_URL = "https://xadxdkbdwyulprfukrjb.supabase.co";

type Phone = {
  id: string; model: string; storage: string; color: string; category: string; brand: string;
  condition: string; price: number; discount_price: number | null; battery_health: number;
  physical_condition: string; five_g: boolean; ip_rating: string | null;
  in_stock: boolean; featured: boolean; badge: string | null; images: string[];
  condition_video: string | null; description: string | null;
  product_description: string | null;
  sim_status: string | null; sim_type: string | null;
  accessories_included: string | null; region: string | null;
  ios_version: string | null; free_case: boolean;
};

type Accessory = {
  id: string; name: string; brand: string; category: string; price: number;
  discount_price: number | null; condition: string; in_stock: boolean;
  images: string[]; description: string | null;
};

type Review = {
  id: string; customer_name: string; customer_city: string; rating: number;
  review_text: string; verified_buyer: boolean; created_at: string; photo_url: string | null;
};

type ShopPhone = Phone & { fromPrice?: number; storageOptions?: string[] };

const categoryColors: Record<string, string> = {
  PTA: "bg-green-500/20 text-green-300 border-green-500/30",
  "Non-PTA": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  JV: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  WiFi: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Cellular: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

const categoryDescriptions: Record<string, string> = {
  PTA: "Officially registered. SIM-ready from day one. Zero tension.",
  "Non-PTA": "Factory unlocked. SIM works, PTA registration needed eventually.",
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
        <svg viewBox="0 0 20 20" fill={star <= value ? "#FBBF24" : "none"} stroke="#FBBF24" strokeWidth="1" className="h-8 w-8 transition hover:scale-110">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    ))}
  </div>
);

function storageHasStock(variants: PhoneVariant[], storage: string): boolean {
  return variants.some((v) => v.storage === storage && isVariantAvailable(v));
}

function colorHasStock(variants: PhoneVariant[], storage: string, color: string): boolean {
  return variants.some((v) => v.storage === storage && v.color === color && isVariantAvailable(v));
}

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const { addItem, isInCart } = useCart();

  const [phone, setPhone] = useState<Phone | null>(null);
  const [variants, setVariants] = useState<PhoneVariant[]>([]);
  const [hasRealVariants, setHasRealVariants] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<ConditionGrade | null>(null);
  const [expandedGrade, setExpandedGrade] = useState<ConditionGrade | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedAccessories, setRelatedAccessories] = useState<Accessory[]>([]);
  const [relatedPhones, setRelatedPhones] = useState<ShopPhone[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: "", city: "", rating: 5, text: "" });
  const [reviewPhoto, setReviewPhoto] = useState<File | null>(null);
  const [reviewPhotoPreview, setReviewPhotoPreview] = useState<string | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showDiscountBanner, setShowDiscountBanner] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchPhone = async () => {
      const { data, error } = await supabase.from("phones").select("*").eq("id", id).single();
      if (!error && data) {
        setPhone(data);
        const { data: variantData } = await supabase
          .from("phone_variants")
          .select("*")
          .eq("phone_id", id)
          .order("price", { ascending: true });

        if (variantData && variantData.length > 0) {
          setVariants(variantData);
          setHasRealVariants(true);
        } else {
          setVariants([legacyPhoneToVariant(data)]);
          setHasRealVariants(false);
        }
      }
      setLoading(false);
    };
    if (id) fetchPhone();
  }, [id]);

  const initSelection = useCallback((vars: PhoneVariant[], phoneCondition: string) => {
    const storages = getUniqueStorages(vars);
    const firstStorage = storages.find((s) => storageHasStock(vars, s)) ?? storages[0];
    if (!firstStorage) return;
    const colors = getUniqueColors(vars, firstStorage);
    const firstColor = colors.find((c) => colorHasStock(vars, firstStorage, c)) ?? colors[0];
    setSelectedStorage(firstStorage);
    setSelectedColor(firstColor);
    if (isNewPhone(phoneCondition)) {
      setSelectedGrade(null);
      return;
    }
    const grades = PRE_OWNED_GRADES.filter((g) => {
      const v = findVariant(vars, firstStorage, firstColor, g);
      return v && isVariantAvailable(v);
    });
    const firstGrade = grades[0] ?? PRE_OWNED_GRADES.find((g) => findVariant(vars, firstStorage, firstColor, g)) ?? null;
    setSelectedGrade(firstGrade);
  }, []);

  useEffect(() => {
    if (variants.length > 0 && phone) initSelection(variants, phone.condition);
  }, [variants, phone, initSelection]);

  useEffect(() => {
    if (!phone) return;

    const fetchReviews = async () => {
      const { data } = await supabase.from("reviews").select("*").eq("approved", true).eq("product_model", phone.model).order("created_at", { ascending: false });
      if (data) setReviews(data);
    };

    const fetchRelated = async () => {
      const { data: accData } = await supabase.from("accessories").select("*")
        .eq("in_stock", true)
        .eq("brand", phone.brand.toLowerCase())
        .limit(4);
      if (accData) setRelatedAccessories(accData);

      const { data: phonesData } = await supabase.from("phones").select("*")
        .eq("in_stock", true).eq("brand", phone.brand).eq("category", phone.category)
        .neq("id", phone.id).limit(3);

      if (phonesData && phonesData.length > 0) {
        const phoneIds = phonesData.map((p) => p.id);
        const { data: allVariants } = await supabase.from("phone_variants").select("*").in("phone_id", phoneIds);
        const enriched = phonesData.map((p) => {
          const pVariants = (allVariants ?? []).filter((v) => v.phone_id === p.id);
          const fromPrice = pVariants.length > 0
            ? Math.min(...pVariants.map(getVariantPrice))
            : (p.discount_price ?? p.price);
          const storageOptions = pVariants.length > 0
            ? getUniqueStorages(pVariants)
            : [p.storage];
          return { ...p, fromPrice, storageOptions };
        });
        setRelatedPhones(enriched);
      }
    };

    fetchReviews();
    fetchRelated();
  }, [phone]);

  useEffect(() => {
    const dismissed = localStorage.getItem("phonesai_discount_banner_dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setShowDiscountBanner(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const selectedVariant = useMemo(() => {
    if (!selectedStorage || !selectedColor || !phone) return null;
    if (isNewPhone(phone.condition)) {
      const available = variants.find(
        (v) => v.storage === selectedStorage && v.color === selectedColor && isVariantAvailable(v)
      );
      return available ?? variants.find(
        (v) => v.storage === selectedStorage && v.color === selectedColor
      ) ?? null;
    }
    if (!selectedGrade) return null;
    return findVariant(variants, selectedStorage, selectedColor, selectedGrade) ?? null;
  }, [variants, selectedStorage, selectedColor, selectedGrade, phone]);

  const displayImages = useMemo(() => {
    if (selectedVariant?.images?.length) return selectedVariant.images;
    if (phone?.images?.length) return phone.images;
    return [];
  }, [selectedVariant, phone]);

  useEffect(() => {
    setActiveImage(0);
  }, [selectedVariant?.id]);

  const storages = useMemo(() => getUniqueStorages(variants), [variants]);
  const colors = useMemo(
    () => (selectedStorage ? getUniqueColors(variants, selectedStorage) : []),
    [variants, selectedStorage]
  );

  const handleStorageSelect = (storage: string) => {
    setSelectedStorage(storage);
    const newColors = getUniqueColors(variants, storage);
    const nextColor = newColors.find((c) => colorHasStock(variants, storage, c)) ?? newColors[0];
    setSelectedColor(nextColor);
    if (phone && isNewPhone(phone.condition)) {
      setSelectedGrade(null);
      return;
    }
    const nextGrade = PRE_OWNED_GRADES.find((g) => {
      const v = findVariant(variants, storage, nextColor, g);
      return v && isVariantAvailable(v);
    }) ?? PRE_OWNED_GRADES.find((g) => findVariant(variants, storage, nextColor, g)) ?? null;
    setSelectedGrade(nextGrade);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (phone && isNewPhone(phone.condition)) {
      setSelectedGrade(null);
      return;
    }
    const nextGrade = PRE_OWNED_GRADES.find((g) => {
      const v = findVariant(variants, selectedStorage, color, g);
      return v && isVariantAvailable(v);
    }) ?? PRE_OWNED_GRADES.find((g) => findVariant(variants, selectedStorage, color, g)) ?? null;
    setSelectedGrade(nextGrade);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReviewPhoto(file);
    setReviewPhotoPreview(URL.createObjectURL(file));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.text || !phone) return;
    setSubmittingReview(true);
    let photoUrl: string | null = null;
    if (reviewPhoto) {
      const ext = reviewPhoto.name.split(".").pop();
      const fileName = `review-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("phone-images").upload(fileName, reviewPhoto, { upsert: true });
      if (!error) photoUrl = `${SUPABASE_URL}/storage/v1/object/public/phone-images/${fileName}`;
    }
    await supabase.from("reviews").insert({
      customer_name: reviewForm.name, customer_city: reviewForm.city,
      rating: reviewForm.rating, review_text: reviewForm.text,
      product_model: phone.model, review_type: "product",
      verified_buyer: false, approved: false, photo_url: photoUrl,
    });
    setSubmittingReview(false);
    setReviewSubmitted(true);
  };

  const handleAddToCart = () => {
    if (!phone || !selectedVariant || !isVariantAvailable(selectedVariant)) return;
    const cartId = hasRealVariants ? selectedVariant.id : phone.id;
    addItem({
      id: cartId,
      phone_id: phone.id,
      variant_id: hasRealVariants ? selectedVariant.id : undefined,
      model: phone.model,
      storage: selectedVariant.storage,
      color: selectedVariant.color,
      selected_storage: selectedVariant.storage,
      selected_color: selectedVariant.color,
      selected_condition_grade: selectedVariant.condition_grade,
      battery_health: selectedVariant.battery_health,
      category: phone.category,
      brand: phone.brand,
      condition: phone.condition,
      price: selectedVariant.price,
      discount_price: selectedVariant.discount_price,
      image: displayImages[0] ?? null,
      free_case: true,
    });
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-black"><p className="animate-pulse text-white/40">Loading...</p></div>;
  if (!phone) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <p className="text-2xl font-bold text-white/30">Phone not found</p>
      <a href="/shop" className="mt-4 text-blue-400 hover:underline">← Back to Shop</a>
    </div>
  );

  const avgRating = reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : null;
  const cartId = selectedVariant ? (hasRealVariants ? selectedVariant.id : phone.id) : "";
  const inCart = cartId ? isInCart(cartId) : false;
  const freeAccessory = getFreeAccessoryText(phone.condition);
  const currentPrice = selectedVariant ? getVariantPrice(selectedVariant) : (phone.discount_price ?? phone.price);
  const originalPrice = selectedVariant?.discount_price ? selectedVariant.price : null;
  const savings = originalPrice ? originalPrice - currentPrice : 0;
  const conditionTags = selectedGrade ? CONDITION_TAGS[selectedGrade] : [];
  const phoneIsNew = isNewPhone(phone.condition);

  const whatsappLink = selectedVariant
    ? `https://wa.me/923041502560?text=Assalam o Alaikum! Ustaad Ji ne bheja hai. Mujhe ${phone.model} ${selectedVariant.storage} ${selectedVariant.color}${phoneIsNew ? "" : ` ${selectedVariant.condition_grade}`} (${phone.category}) mein interest hai.`
    : `https://wa.me/923041502560`;

  const photoRequestLink = `https://wa.me/923041502560?text=${encodeURIComponent(`Assalam o Alaikum! Mujhe ${phone.model} ke exact unit ki photos chahiye please.`)}`;

  const getStorageLowestPrice = (storage: string) => {
    const vs = variants.filter((v) => v.storage === storage);
    const available = vs.filter(isVariantAvailable);
    const pool = available.length ? available : vs;
    if (!pool.length) return null;
    return Math.min(...pool.map(getVariantPrice));
  };

  return (
    <div className="min-h-screen bg-black text-white pt-16 sm:pt-20">

      {showDiscountBanner && (
        <div className="fixed bottom-20 left-3 z-40 w-56 rounded-2xl border border-blue-400/30 bg-[#0a0a0a] p-3 shadow-[0_0_30px_rgba(59,130,246,0.2)] sm:bottom-6 sm:left-6 sm:w-64 sm:p-4">
          <button onClick={() => { setShowDiscountBanner(false); localStorage.setItem("phonesai_discount_banner_dismissed", "true"); }}
            className="absolute right-2 top-2 text-white/30 transition hover:text-white text-xs">✕</button>
          <p className="text-base mb-1">🎁</p>
          <p className="text-xs font-bold text-white sm:text-sm">Special Discount!</p>
          <p className="mt-1 text-[10px] text-white/50 leading-relaxed sm:text-xs">Email register karein aur pehli purchase pe discount bachayein.</p>
          <button onClick={() => { setShowDiscountBanner(false); localStorage.setItem("phonesai_discount_banner_dismissed", "true"); window.dispatchEvent(new CustomEvent("openEmailPopup")); }}
            className="mt-2 w-full rounded-xl bg-blue-500/20 border border-blue-400/30 py-1.5 text-[10px] font-semibold text-blue-200 transition hover:bg-blue-500/30 sm:py-2 sm:text-xs">
            Claim Discount →
          </button>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 sm:py-10">
        <a href="/shop" className="mb-4 inline-flex items-center gap-1 text-xs text-white/40 hover:text-white transition sm:mb-6">
          ← Back to Shop
        </a>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">

          {/* LEFT — Image Gallery + Condition Tags */}
          <div className="flex flex-col gap-3">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:rounded-3xl" style={{ aspectRatio: "4/3" }}>
              {displayImages.length > 0 ? (
                <Image src={displayImages[activeImage]} alt={`${phone.model} - image ${activeImage + 1}`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain p-2 transition duration-500 cursor-zoom-in" onClick={() => { setLightboxOpen(true); setLightboxIndex(activeImage); }} priority={activeImage === 0} />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/20">
                  <svg viewBox="0 0 24 24" fill="none" className="h-14 w-14" stroke="currentColor" strokeWidth="0.8">
                    <rect x="7" y="2.5" width="10" height="19" rx="2.4" />
                    <path d="M10 5.5H14" strokeLinecap="round" />
                    <circle cx="12" cy="18.5" r="1" fill="currentColor" />
                  </svg>
                  <p className="text-xs">Photos coming soon</p>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {phone.badge && (
                <span className="rounded-full border border-purple-500/30 bg-purple-500/20 px-2.5 py-0.5 text-xs font-medium text-purple-300">{phone.badge}</span>
              )}
              <span className="rounded-full border border-green-500/30 bg-green-500/20 px-2.5 py-0.5 text-xs text-green-300">{freeAccessory.badge}</span>
              {phoneIsNew && (
                <span className="rounded-full border border-green-400/40 bg-green-500/15 px-2.5 py-0.5 text-xs font-semibold text-green-300">📦 Water Pack Sealed</span>
              )}
            </div>
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {displayImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border transition ${activeImage === i ? "border-blue-400/60" : "border-white/10 opacity-50"}`}>
                    <Image src={img} alt={`${phone.model} thumbnail ${i + 1}`} fill sizes="56px" className="object-contain p-1" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
            {conditionTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {conditionTags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] text-white/70">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Selection Flow */}
          <div className="flex flex-col">
            <div className="mb-3 flex flex-wrap gap-1.5">
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryColors[phone.category] ?? "border-white/20 bg-white/10 text-white/60"}`}>{phone.category}</span>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${phone.condition === "Pre-Owned" || phone.condition === "Used" ? "border-amber-400/30 bg-amber-400/10 text-amber-300" : "border-green-400/30 bg-green-400/10 text-green-300"}`}>{phone.condition}</span>
              {phone.five_g && <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-0.5 text-xs font-semibold text-blue-300">5G Ready</span>}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">{phone.model}</h1>
            <p className="mt-2 text-xs leading-relaxed text-white/40 sm:text-sm">{categoryDescriptions[phone.category]}</p>

            {avgRating && (
              <div className="mt-3 flex items-center gap-2">
                <StarRating rating={Math.round(parseFloat(avgRating))} />
                <span className="text-sm font-bold text-white">{avgRating}</span>
                <span className="text-xs text-white/40">({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
              </div>
            )}

            {/* 1. Select Storage */}
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">Select Storage</p>
              <div className="space-y-2">
                {storages.map((storage) => {
                  const price = getStorageLowestPrice(storage);
                  const hasStock = storageHasStock(variants, storage);
                  const isSelected = selectedStorage === storage;
                  return (
                    <button key={storage} type="button" disabled={!hasStock}
                      onClick={() => hasStock && handleStorageSelect(storage)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${!hasStock ? "border-white/5 bg-white/[0.01] opacity-40 cursor-not-allowed" : isSelected ? "border-blue-400/60 bg-blue-500/10" : "border-white/10 bg-white/[0.02] hover:border-white/25"}`}>
                      <div className="flex items-center gap-3">
                        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${isSelected && hasStock ? "border-blue-400 bg-blue-500" : "border-white/30"}`}>
                          {isSelected && hasStock && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </span>
                        <span className={`text-sm font-semibold ${hasStock ? "text-white" : "text-white/40"}`}>{storage}</span>
                        {!hasStock && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/50">Sold out</span>}
                      </div>
                      {price != null && hasStock && (
                        <span className="text-sm font-bold text-white">Rs. {price.toLocaleString()}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Select Color */}
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">Select Color</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const hasStock = colorHasStock(variants, selectedStorage, color);
                  const isSelected = selectedColor === color;
                  return (
                    <button key={color} type="button" disabled={!hasStock}
                      onClick={() => hasStock && handleColorSelect(color)}
                      className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${!hasStock ? "border-white/5 text-white/30 opacity-50 cursor-not-allowed" : isSelected ? "border-blue-400/60 bg-blue-500/20 text-blue-200" : "border-white/15 text-white/70 hover:border-white/30"}`}>
                      {color}{!hasStock && " — Sold out"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Condition — New badge or Pre-Owned grade selector */}
            {phoneIsNew ? (
              <div className="mt-5">
                <div className="rounded-2xl border-2 border-green-400/40 bg-gradient-to-br from-green-500/15 to-green-500/5 px-5 py-4 text-center">
                  <p className="text-lg font-extrabold text-green-300 sm:text-xl">Brand New — Sealed Box</p>
                  <p className="mt-2 text-xs text-white/60 leading-relaxed sm:text-sm">
                    📦 Water Pack Sealed — Pin Pack Original Box
                  </p>
                  <p className="mt-1 text-[11px] text-green-400/80">Untouched original packaging — condition is perfect</p>
                </div>
              </div>
            ) : (
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">Select Condition Grade</p>
                <div className="space-y-2">
                  {PRE_OWNED_GRADES.map((grade) => {
                    const variant = findVariant(variants, selectedStorage, selectedColor, grade);
                    const available = variant ? isVariantAvailable(variant) : false;
                    const isSelected = selectedGrade === grade;
                    const price = variant ? getVariantPrice(variant) : null;
                    const visual = CONDITION_VISUAL[grade];
                    return (
                      <div key={grade}>
                        <button type="button" disabled={!variant || !available}
                          onClick={() => { if (variant && available) { setSelectedGrade(grade); setExpandedGrade(expandedGrade === grade ? null : grade); } }}
                          className={`flex w-full items-center gap-2 rounded-xl border px-3 py-3 text-left transition sm:gap-3 sm:px-4 ${!variant || !available ? "border-white/5 bg-white/[0.01] opacity-40 cursor-not-allowed" : isSelected ? `${visual.selectedBorder} ${visual.selectedBg}` : "border-white/10 bg-white/[0.02] hover:border-white/25"}`}>
                          <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${isSelected && available ? "border-blue-400 bg-blue-500" : "border-white/30"}`}>
                            {isSelected && available && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </span>
                          <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
                            <div className="flex shrink-0 items-center gap-1.5">
                              <span className="text-base">{visual.icon}</span>
                              <span className={`text-sm font-semibold ${available ? "text-white" : "text-white/40"}`}>{grade}</span>
                              {visual.popular && available && (
                                <span className="rounded-full border border-blue-400/30 bg-blue-500/20 px-2 py-0.5 text-[10px] text-blue-300">Popular</span>
                              )}
                              {!available && variant && (
                                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/50">Sold out</span>
                              )}
                            </div>
                            <div className="flex min-w-0 flex-1 flex-wrap gap-1">
                              {CONDITION_TAGS[grade].map((tag) => (
                                <span key={tag} className={`rounded-full border px-2 py-0.5 text-[9px] sm:text-[10px] ${visual.accent}`}>{tag}</span>
                              ))}
                            </div>
                          </div>
                          {price != null && available && (
                            <span className="shrink-0 text-sm font-bold text-white">Rs. {price.toLocaleString()}</span>
                          )}
                        </button>
                        {(expandedGrade === grade || (isSelected && available)) && variant && available && (
                          <p className="mt-1.5 ml-7 text-[11px] leading-relaxed text-white/45">{CONDITION_DESCRIPTIONS[grade]}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dynamic Price */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 sm:px-6 sm:py-5">
              {originalPrice ? (
                <div>
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-extrabold text-white sm:text-4xl">Rs. {currentPrice.toLocaleString()}</p>
                    <p className="text-lg text-white/30 line-through sm:text-xl">Rs. {originalPrice.toLocaleString()}</p>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1">
                    <span className="text-xs font-bold text-green-400">You save Rs. {savings.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <p className="text-3xl font-extrabold text-white sm:text-4xl">Rs. {currentPrice.toLocaleString()}</p>
              )}
              <p className="mt-2 text-xs text-white/30">Fixed price • No hidden charges</p>
            </div>

            {/* 4. Battery Health */}
            {selectedVariant?.battery_health != null && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <p className="mb-1 text-xs text-white/60">Battery Health</p>
                <p className="text-2xl font-extrabold text-white">{selectedVariant.battery_health}%</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: `${selectedVariant.battery_health}%` }} />
                </div>
              </div>
            )}

            {selectedVariant && isVariantAvailable(selectedVariant) && (
              <p className="mt-3 text-xs text-green-400 font-medium">
                {selectedVariant.quantity} unit{selectedVariant.quantity !== 1 ? "s" : ""} available
              </p>
            )}

            {/* 5. Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || !isVariantAvailable(selectedVariant)}
              className={`mt-3 w-full rounded-2xl py-4 text-sm font-bold transition disabled:opacity-40 disabled:cursor-not-allowed ${inCart ? "border border-green-500/30 bg-green-500/10 text-green-300" : "bg-blue-500 text-white hover:bg-blue-400"}`}>
              {inCart ? "✓ Added to Cart — View in Cart ↑" : !selectedVariant || !isVariantAvailable(selectedVariant) ? "Sold Out" : "Add to Cart 🛒"}
            </button>

            <p className="mt-2 text-center text-[11px] text-white/40 leading-relaxed">
              Order placed → we confirm availability within 24hrs via WhatsApp before payment
            </p>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-center">
              <p className="text-xs text-white/70 leading-relaxed sm:text-sm">
                📸 Want exact photos of your unit? WhatsApp us — we send real photos before you pay.
              </p>
              <a
                href={photoRequestLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-xs font-bold text-green-300 transition hover:bg-green-500/20 sm:text-sm"
              >
                Request Unit Photos → 0304-1502560
              </a>
            </div>

            {/* Free Accessories — Prominent */}
            <div className="mt-4 rounded-2xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-500/[0.03] px-5 py-4">
              <p className="text-sm font-bold text-green-300">📦 {freeAccessory.title}</p>
              <p className="mt-1.5 text-xs text-white/60 leading-relaxed">{freeAccessory.subtitle}</p>
              <p className="mt-2 text-[10px] text-green-400/70">Phone arrives ready to use and protected — no extra trip to the market needed</p>
            </div>

            <div className="mt-3 flex items-center gap-2.5 rounded-2xl border border-amber-300/20 bg-amber-300/5 px-4 py-3">
              <span className="text-xl">🧔</span>
              <div>
                <p className="text-xs font-bold text-amber-200 sm:text-sm">Ustaad Ji Verified</p>
                <p className="text-[10px] text-white/40">7-Day Warranty • Supplier Guaranteed • Ekdum Asli</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
                <p className="mb-1 text-[10px] text-white/60 sm:text-xs">Battery Health</p>
                <p className="text-xl font-extrabold text-white sm:text-2xl">
                  {selectedVariant?.battery_health != null ? `${selectedVariant.battery_health}%` : phoneIsNew ? "100%" : "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
                <p className="mb-1 text-[10px] text-white/60 sm:text-xs">Condition</p>
                <p className="text-sm font-extrabold text-white sm:text-lg leading-tight">
                  {phoneIsNew ? "Brand New" : selectedGrade ?? "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
                <p className="mb-1 text-[10px] text-white/60 sm:text-xs">IP Rating</p>
                <p className="text-sm font-extrabold text-white sm:text-lg leading-tight">
                  {phone.ip_rating ?? "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
                <p className="mb-1 text-[10px] text-white/60 sm:text-xs">5G</p>
                <p className="text-xl font-extrabold text-white sm:text-2xl">{phone.five_g ? "✅" : "❌"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent sm:my-14" />

        {/* Specs */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30 sm:mb-4 sm:text-xs">SIM Status</p>
            <p className="text-base font-bold text-white sm:text-lg">{phone.sim_status ?? "—"}</p>
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
              {phone.sim_type && <div className="flex justify-between"><span className="text-xs text-white/40">SIM Type</span><span className="text-xs font-semibold text-white">{phone.sim_type}</span></div>}
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
              {phone.category === "JV" ? "Yeh phone permanently SIM-locked hai. WiFi aur secondary use ke liye perfect hai." : "Is phone ki SIM active hai lekin eventually PTA registration karni padegi."}
            </p>
            {phone.category === "Non-PTA" && (
              <a href="https://taxcalculator.pk/pta-tax" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-xs font-semibold text-blue-400">
                Check PTA Tax → taxcalculator.pk/pta-tax
              </a>
            )}
          </div>
        )}

        {phone.product_description && (
          <div className="mt-4 sm:mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01]">
            <div className="border-b border-white/5 px-5 py-3 sm:px-6">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">About This Phone</p>
            </div>
            <div className="px-5 py-4 sm:px-6 sm:py-5">
              <div className="space-y-2">
                {phone.product_description.split(/\.\s+/).filter(s => s.trim().length > 10).slice(0, 6).map((sentence, i) => (
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

        {phone.description && (
          <div className="mt-4 rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🧔</span>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400/60">Ustaad Ji Notes</p>
            </div>
            <p className="text-xs leading-relaxed text-white/70 sm:text-sm">{phone.description}</p>
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">Delivery</p>
          <p className="text-sm font-bold text-white">Free Delivery — All Pakistan</p>
          <p className="mt-1 text-xs text-white/40">Order before 2pm for next day delivery in nearby cities. All Pakistan: 1-3 working days.</p>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden">
          <div className="border-b border-white/5 px-5 py-3 sm:px-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">After Purchase — We&apos;ve Got You</p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/5 sm:grid-cols-4">
            {[
              { icon: "🛡️", label: "7-Day Warranty", sub: "New & Pre-Owned", href: "/support#warranty" },
              { icon: "🔧", label: "Repair Service", sub: "Exclusive to customers", href: "/repairs" },
              { icon: "🔄", label: "Trade-In", sub: "Best rates", href: "/trade-in" },
              { icon: "💬", label: "WhatsApp Support", sub: "0304-1502560", href: "https://wa.me/923041502560" },
            ].map(item => (
              <a key={item.label} href={item.href}
                target={item.href.startsWith("https") ? "_blank" : undefined}
                rel={item.href.startsWith("https") ? "noopener noreferrer" : undefined}
                className="flex flex-col items-center gap-1.5 bg-black/40 px-3 py-4 text-center transition hover:bg-white/[0.04]">
                <span className="text-xl">{item.icon}</span>
                <p className="text-xs font-bold text-white">{item.label}</p>
                <p className="text-[10px] text-white/50">{item.sub}</p>
              </a>
            ))}
          </div>
        </div>

        {relatedAccessories.length > 0 && (
          <>
            <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-white sm:text-xl">Frequently Bought Together</h2>
                <a href="/shop?brand=Accessories" className="text-xs font-semibold text-blue-400 hover:text-blue-300">See All →</a>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {relatedAccessories.map(acc => {
                  const accInCart = isInCart(acc.id);
                  return (
                    <div key={acc.id} className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                      <div className="relative h-24 overflow-hidden bg-white/5 sm:h-32">
                        {acc.images?.[0] ? (
                          <Image src={acc.images[0]} alt={acc.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-contain p-2" loading="lazy" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl">
                            {acc.category === "Charger" ? "🔌" : acc.category === "Cable" ? "🔗" : acc.category === "AirPods" ? "🎧" : "⌚"}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-3">
                        <p className="text-xs font-bold text-white leading-tight line-clamp-2">{acc.name}</p>
                        <p className="mt-1 text-xs font-extrabold text-white">Rs. {(acc.discount_price ?? acc.price).toLocaleString()}</p>
                        <button
                          onClick={() => addItem({ id: acc.id, model: acc.name, storage: "", color: "", category: acc.category, brand: acc.brand, condition: acc.condition, price: acc.price, discount_price: acc.discount_price, image: acc.images?.[0] ?? null, free_case: false, is_accessory: true })}
                          className={`mt-2 w-full rounded-xl py-1.5 text-[10px] font-bold transition ${accInCart ? "border border-green-500/30 bg-green-500/10 text-green-300" : "bg-blue-500 text-white hover:bg-blue-400"}`}>
                          {accInCart ? "✓ In Cart" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {relatedPhones.length > 0 && (
          <>
            <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-white sm:text-xl">Similar Phones</h2>
                <a href="/shop" className="text-xs font-semibold text-blue-400 hover:text-blue-300">See All →</a>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                {relatedPhones.map(p => (
                  <a key={p.id} href={`/shop/${p.id}`} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-white/20 sm:flex-col sm:gap-0 sm:p-0">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] sm:h-36 sm:w-full sm:rounded-none sm:rounded-t-2xl">
                      {p.images?.[0] ? (
                        <Image src={p.images[0]} alt={p.model} fill sizes="(max-width: 640px) 80px, 33vw" className="object-contain p-1" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-white/10" stroke="currentColor" strokeWidth="1">
                            <rect x="7" y="2.5" width="10" height="19" rx="2.4" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-center sm:p-3">
                      <p className="text-xs font-bold text-white leading-tight">{p.model}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {(p.storageOptions ?? [p.storage]).slice(0, 3).map(s => (
                          <span key={s} className="rounded-full border border-white/10 px-1.5 py-0.5 text-[9px] text-white/50">{s}</span>
                        ))}
                      </div>
                      <p className="mt-1.5 text-sm font-extrabold text-white">From Rs. {(p.fromPrice ?? p.discount_price ?? p.price).toLocaleString()}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

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
              <span className="text-xs text-white/40">({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
            </div>
          ) : <p className="text-sm text-white/40 mb-6">Be the first to review!</p>}

          {reviews.length > 0 && (
            <div className="mb-8 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col gap-2 sm:p-6 sm:gap-3">
                  <StarRating rating={review.rating} />
                  {review.photo_url && (
                    <div className="relative h-40 w-full overflow-hidden rounded-xl border border-white/10">
                      <Image src={review.photo_url} alt="Review photo" fill sizes="300px" className="object-cover" />
                    </div>
                  )}
                  <p className="text-xs text-white/80 leading-relaxed sm:text-sm">&ldquo;{review.review_text}&rdquo;</p>
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
                    <input required value={reviewForm.name} onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })} placeholder="Ahmed Khan"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-white/40">City</label>
                    <input value={reviewForm.city} onChange={e => setReviewForm({ ...reviewForm, city: e.target.value })} placeholder="Islamabad"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs text-white/40">Rating *</label>
                  <StarSelector value={reviewForm.rating} onChange={(v) => setReviewForm({ ...reviewForm, rating: v })} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/40">Your Review *</label>
                  <textarea required value={reviewForm.text} onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })} placeholder="Aapka experience kaisa tha?" rows={3}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50 resize-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/40">Add Photo (optional) 📸</label>
                  {reviewPhotoPreview ? (
                    <div className="relative inline-block">
                      <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-white/10">
                        <Image src={reviewPhotoPreview} alt="Preview" fill sizes="96px" className="object-cover" />
                      </div>
                      <button type="button" onClick={() => { setReviewPhoto(null); setReviewPhotoPreview(null); }}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">✕</button>
                    </div>
                  ) : (
                    <label className="flex h-20 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 text-white/40 transition hover:border-white/40 hover:text-white/70">
                      <span className="text-xl">📷</span>
                      <span className="text-xs">Apni unboxing ya phone ki photo upload karein</span>
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

        {lightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}>
            <button onClick={() => setLightboxOpen(false)} aria-label="Close image viewer"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white text-lg hover:bg-white/10 transition">
              ✕
            </button>
            <p className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-white/50">
              {lightboxIndex + 1} / {displayImages.length}
            </p>
            {displayImages.length > 1 && lightboxIndex > 0 && (
              <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i - 1); }}
                aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white hover:bg-white/10 transition text-lg">
                ←
              </button>
            )}
            {displayImages.length > 1 && lightboxIndex < displayImages.length - 1 && (
              <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i + 1); }}
                aria-label="Next image" className="absolute right-14 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white hover:bg-white/10 transition text-lg">
                →
              </button>
            )}
            <div className="relative h-[70vh] w-[90vw] max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <Image src={displayImages[lightboxIndex]} alt={phone.model} fill sizes="90vw" className="object-contain select-none" style={{ touchAction: "pinch-zoom" }} />
            </div>
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-xs sm:max-w-md px-2">
                {displayImages.map((img, i) => (
                  <button key={i} onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                    className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 transition ${lightboxIndex === i ? "border-blue-400" : "border-white/20 opacity-50"}`}>
                    <Image src={img} alt="" fill sizes="48px" className="object-contain p-0.5" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
