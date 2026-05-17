"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/app/components/CartContext";
import CompareTool from "@/app/components/CompareTool";

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
  free_case: boolean;
};

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
  badge: string | null;
  images: string[];
  is_original: boolean;
  description: string | null;
};

const brands = ["All", "Apple", "Samsung", "iPad", "Accessories"];

const categoryColors: Record<string, string> = {
  PTA: "bg-green-500/20 text-green-300 border-green-500/30",
  "Non-PTA": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  JV: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  WiFi: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Cellular: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

const badgeColors: Record<string, string> = {
  "New Arrival": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Hot Deal": "bg-red-500/20 text-red-300 border-red-500/30",
  "Best Value": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Last Unit": "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

const getCategoriesForBrand = (brand: string) => {
  switch (brand) {
    case "Apple": return ["All", "PTA", "Non-PTA", "JV"];
    case "Samsung": return ["All", "PTA", "Non-PTA"];
    case "iPad": return ["All", "WiFi", "Cellular"];
    default: return [];
  }
};

function ShopContent() {
  const searchParams = useSearchParams();
  const urlBrand = searchParams.get("brand");
  const urlCategory = searchParams.get("category");
  const { addItem, isInCart } = useCart();

  const [phones, setPhones] = useState<Phone[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [activeBrand, setActiveBrand] = useState(urlBrand ?? "All");
  const [activeCategory, setActiveCategory] = useState(urlCategory ?? "All");
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState<Phone[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: phoneData } = await supabase.from("phones").select("*").eq("in_stock", true)
        .order("featured", { ascending: false }).order("created_at", { ascending: false });
      const { data: accessoryData } = await supabase.from("accessories").select("*").eq("in_stock", true)
        .order("featured", { ascending: false });
      if (phoneData) setPhones(phoneData);
      if (accessoryData) setAccessories(accessoryData);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => { setActiveCategory("All"); }, [activeBrand]);

  const toggleCompare = (phone: Phone) => {
    setCompareList((prev) => {
      if (prev.find((p) => p.id === phone.id)) return prev.filter((p) => p.id !== phone.id);
      if (prev.length >= 2) return prev;
      return [...prev, phone];
    });
  };

  const filteredPhones = phones.filter((p) => {
    if (activeBrand === "Accessories") return false;
    if (activeBrand !== "All") {
      if (activeBrand === "iPad" && (p.brand !== "Apple" || !["WiFi", "Cellular"].includes(p.category))) return false;
      if (activeBrand === "Samsung" && p.brand !== "Samsung") return false;
      if (activeBrand === "Apple" && (p.brand !== "Apple" || ["WiFi", "Cellular"].includes(p.category))) return false;
    }
    if (activeCategory !== "All" && p.category !== activeCategory) return false;
    return true;
  });

  const filteredAccessories = activeBrand === "Accessories" || activeBrand === "All" ? accessories : [];
  const categories = getCategoriesForBrand(activeBrand);

  return (
    <div className="min-h-screen bg-black text-white pt-16 sm:pt-20">
      <main className="mx-auto max-w-6xl px-4 py-6 pb-32 sm:px-6 sm:py-10">

        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
            {activeBrand === "All" ? "All Products" : activeBrand === "Accessories" ? "Accessories" : activeBrand === "iPad" ? "iPads" : `${activeBrand} Phones`}
          </h1>
          <p className="mt-1 text-sm text-white/50">Verified, asli, aur 7-din warranty ke saath.</p>
        </div>

        {/* Brand Filter */}
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {brands.map((brand) => (
            <button key={brand} onClick={() => setActiveBrand(brand)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition sm:px-5 sm:py-2 sm:text-sm ${activeBrand === brand ? "border-white/40 bg-white/10 text-white" : "border-white/10 bg-transparent text-white/50 hover:text-white/80"}`}>
              {brand === "All" ? "All Products" : brand}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition ${activeCategory === cat ? "border-blue-400/60 bg-blue-500/20 text-blue-200" : "border-white/10 text-white/40 hover:text-white/60"}`}>
                {cat === "All" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        )}

        {loading && <div className="flex items-center justify-center py-24"><p className="animate-pulse text-white/40">Loading...</p></div>}

        {!loading && filteredPhones.length === 0 && filteredAccessories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-2xl font-bold text-white/20">No products found</p>
            <p className="mt-2 text-sm text-white/30">Is category mein abhi stock available nahi hai.</p>
          </div>
        )}

        {/* Phone Grid */}
        {filteredPhones.length > 0 && (
          <>
            {activeBrand === "All" && <h2 className="mb-4 text-sm font-bold text-white/50 uppercase tracking-widest">Phones & Tablets</h2>}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6">
              {filteredPhones.map((phone) => {
                const isInCompare = compareList.find((p) => p.id === phone.id);
                const inCart = isInCart(phone.id);
                return (
                  <div key={phone.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition duration-300 hover:border-white/20">
                    <a href={`/shop/${phone.id}`} className="flex gap-3 p-3 sm:flex-col sm:gap-0 sm:p-0">
                      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] sm:h-44 sm:w-full sm:rounded-none sm:rounded-t-2xl">
                        {phone.images && phone.images.length > 0 ? (
                          <img src={phone.images[0]} alt={phone.model} className="h-full w-full object-contain p-2 sm:p-4" />
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-white/10 sm:h-12 sm:w-12" stroke="currentColor" strokeWidth="1">
                            <rect x="7" y="2.5" width="10" height="19" rx="2.4" />
                            <path d="M10 5.5H14" strokeLinecap="round" />
                            <circle cx="12" cy="18.5" r="1" fill="currentColor" />
                          </svg>
                        )}
                        {phone.badge && (
                          <span className={`absolute left-2 top-2 rounded-full border px-2 py-0.5 text-[10px] font-medium ${badgeColors[phone.badge] ?? "bg-white/10 text-white/60 border-white/20"}`}>{phone.badge}</span>
                        )}
                        {phone.free_case && phone.condition === "Used" && (
                          <span className="absolute right-2 top-2 rounded-full border border-green-500/30 bg-green-500/20 px-2 py-0.5 text-[10px] text-green-300">Free Case</span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-center sm:p-4">
                        <div className="flex flex-wrap gap-1 mb-1.5">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${categoryColors[phone.category] ?? "bg-white/10 text-white/60 border-white/20"}`}>{phone.category}</span>
                          {phone.five_g && <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-0.5 text-[10px] text-blue-300">5G</span>}
                        </div>
                        <h2 className="text-sm font-bold text-white leading-tight sm:text-base">{phone.model}</h2>
                        <p className="text-xs text-white/40 mt-0.5">{phone.storage} • {phone.color}</p>
                        <div className="mt-1 flex gap-3 text-xs text-white/40">
                          {phone.battery_health && <span>🔋{phone.battery_health}%</span>}
                          {phone.face_id && <span>🔒FaceID</span>}
                        </div>
                        <div className="mt-2">
                          {phone.discount_price ? (
                            <>
                              <p className="text-[10px] text-white/30 line-through">Rs. {phone.price.toLocaleString()}</p>
                              <p className="text-base font-extrabold text-white sm:text-lg">Rs. {phone.discount_price.toLocaleString()}</p>
                            </>
                          ) : (
                            <p className="text-base font-extrabold text-white sm:text-lg">Rs. {phone.price.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </a>

                    {/* Action Buttons — pb-20 on mobile so Ustaad Ji float doesn't overlap */}
                    <div className="px-3 pb-20 flex gap-2 sm:px-4 sm:pb-4">
                      <button
                        onClick={() => addItem({ id: phone.id, model: phone.model, storage: phone.storage, color: phone.color, category: phone.category, brand: phone.brand, condition: phone.condition, price: phone.price, discount_price: phone.discount_price, image: phone.images?.[0] ?? null, free_case: phone.free_case })}
                        className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${inCart ? "border border-green-500/30 bg-green-500/10 text-green-300" : "bg-blue-500 text-white hover:bg-blue-400"}`}
                      >
                        {inCart ? "✓ In Cart" : "Add to Cart"}
                      </button>
                      <button
                        onClick={() => toggleCompare(phone)}
                        disabled={!isInCompare && compareList.length >= 2}
                        className={`rounded-xl border px-2.5 py-2 text-xs transition ${isInCompare ? "border-blue-400/60 bg-blue-500/20 text-blue-200" : compareList.length >= 2 ? "border-white/5 text-white/20 cursor-not-allowed" : "border-white/10 text-white/40 hover:text-white/70"}`}
                      >⇄</button>
                      <a href={`/shop/${phone.id}`} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/40 transition hover:text-white">
                        View
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Accessories Grid */}
        {filteredAccessories.length > 0 && (
          <div className={filteredPhones.length > 0 ? "mt-10" : ""}>
            {(activeBrand === "All" || activeBrand === "Accessories") && (
              <h2 className="mb-4 text-sm font-bold text-white/50 uppercase tracking-widest">Accessories</h2>
            )}
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
              {filteredAccessories.map((acc) => {
                const inCart = isInCart(acc.id);
                return (
                  <div key={acc.id} className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                    <div className="flex h-28 items-center justify-center overflow-hidden bg-white/5 sm:h-36">
                      {acc.images && acc.images.length > 0 ? (
                        <img src={acc.images[0]} alt={acc.name} className="h-full w-full object-contain p-3" />
                      ) : (
                        <div className="text-3xl">
                          {acc.category === "Charger" ? "🔌" : acc.category === "Cable" ? "🔋" : acc.category === "Case" ? "📱" : "🛡️"}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-3">
                      <p className="text-xs font-bold text-white leading-tight">{acc.name}</p>
                      <p className="text-xs text-white/40 mt-0.5">{acc.brand}</p>
                      <p className="mt-2 text-sm font-extrabold text-white">Rs. {acc.price.toLocaleString()}</p>
                      <button
                        onClick={() => addItem({ id: acc.id, model: acc.name, storage: "", color: "", category: acc.category, brand: acc.brand, condition: acc.condition, price: acc.price, discount_price: acc.discount_price, image: acc.images?.[0] ?? null, free_case: false })}
                        className={`mt-2 w-full rounded-xl py-2 text-xs font-bold transition ${inCart ? "border border-green-500/30 bg-green-500/10 text-green-300" : "bg-blue-500 text-white hover:bg-blue-400"}`}
                      >
                        {inCart ? "✓ In Cart" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <CompareTool
        selectedPhones={compareList}
        onRemove={(id) => setCompareList((prev) => prev.filter((p) => p.id !== id))}
        onClear={() => setCompareList([])}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center"><p className="text-white/40 animate-pulse">Loading...</p></div>}>
      <ShopContent />
    </Suspense>
  );
}