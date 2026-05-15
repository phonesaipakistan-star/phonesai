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
      const { data: phoneData } = await supabase
        .from("phones").select("*").eq("in_stock", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      const { data: accessoryData } = await supabase
        .from("accessories").select("*").eq("in_stock", true)
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
    <div className="min-h-screen bg-black text-white pt-20">
      <main className="mx-auto max-w-6xl px-6 py-12 pb-32">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {activeBrand === "All" ? "All Products" : activeBrand === "Accessories" ? "Accessories" : activeBrand === "iPad" ? "iPads" : `${activeBrand} Phones`}
          </h1>
          <p className="mt-3 text-white/50">Verified, asli, aur 7-din warranty ke saath — har piece Ustaad Ji approved.</p>
        </div>

        {/* Brand Filter */}
        <div className="mb-4 flex flex-wrap gap-3">
          {brands.map((brand) => (
            <button key={brand} onClick={() => setActiveBrand(brand)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition ${activeBrand === brand ? "border-white/40 bg-white/10 text-white" : "border-white/10 bg-transparent text-white/50 hover:border-white/30 hover:text-white/80"}`}>
              {brand === "All" ? "All Products" : brand}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${activeCategory === cat ? "border-blue-400/60 bg-blue-500/20 text-blue-200" : "border-white/10 bg-transparent text-white/40 hover:border-white/20 hover:text-white/60"}`}>
                {cat === "All" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        )}

        {activeBrand !== "Accessories" && (
          <div className="mb-6 rounded-xl border border-blue-400/20 bg-blue-500/5 px-4 py-3">
            <p className="text-xs text-blue-300/70">💡 Click "Compare" on any two phones to compare them side by side</p>
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
            {activeBrand === "All" && <h2 className="mb-4 text-lg font-bold text-white/60">Phones & Tablets</h2>}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPhones.map((phone) => {
                const isInCompare = compareList.find((p) => p.id === phone.id);
                const inCart = isInCart(phone.id);
                return (
                  <div key={phone.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]">
                    <a href={`/shop/${phone.id}`} className="flex flex-col flex-1">
                      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-white/5">
                        {phone.images && phone.images.length > 0 ? (
                          <img src={phone.images[0]} alt={phone.model} className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-white/20">
                            <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12" stroke="currentColor" strokeWidth="1">
                              <rect x="7" y="2.5" width="10" height="19" rx="2.4" />
                              <path d="M10 5.5H14" strokeLinecap="round" />
                              <circle cx="12" cy="18.5" r="1" fill="currentColor" />
                            </svg>
                          </div>
                        )}
                        {phone.badge && (
                          <span className={`absolute left-3 top-3 rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeColors[phone.badge] ?? "bg-white/10 text-white/60 border-white/20"}`}>{phone.badge}</span>
                        )}
                        {phone.free_case && phone.condition === "Used" && (
                          <span className="absolute right-3 top-3 rounded-full border border-green-500/30 bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-300">Free Case 🎁</span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryColors[phone.category] ?? "bg-white/10 text-white/60 border-white/20"}`}>{phone.category}</span>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/50">{phone.condition}</span>
                          {phone.five_g && <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-0.5 text-xs text-blue-300">5G</span>}
                        </div>
                        <h2 className="text-lg font-bold leading-tight text-white">{phone.model}</h2>
                        <p className="mt-1 text-sm text-white/50">{phone.storage} • {phone.color}</p>
                        <div className="mt-3 flex gap-4 text-xs text-white/40">
                          {phone.battery_health && <span>🔋 {phone.battery_health}%</span>}
                          {phone.physical_condition && <span>✨ {phone.physical_condition}</span>}
                          {phone.face_id && <span>🔒 Face ID</span>}
                        </div>
                        <div className="mt-4">
                          {phone.discount_price ? (
                            <>
                              <p className="text-xs text-white/30 line-through">Rs. {phone.price.toLocaleString()}</p>
                              <p className="text-xl font-extrabold text-white">Rs. {phone.discount_price.toLocaleString()}</p>
                            </>
                          ) : (
                            <p className="text-xl font-extrabold text-white">Rs. {phone.price.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </a>

                    {/* Action Buttons */}
                    <div className="px-5 pb-4 flex gap-2">
                      <button
                        onClick={() => addItem({
                          id: phone.id, model: phone.model, storage: phone.storage,
                          color: phone.color, category: phone.category, brand: phone.brand,
                          condition: phone.condition, price: phone.price,
                          discount_price: phone.discount_price,
                          image: phone.images?.[0] ?? null, free_case: phone.free_case,
                        })}
                        className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${inCart ? "border border-green-500/30 bg-green-500/10 text-green-300" : "bg-blue-500 text-white hover:bg-blue-400"}`}
                      >
                        {inCart ? "✓ In Cart" : "Add to Cart"}
                      </button>
                      <button
                        onClick={() => toggleCompare(phone)}
                        disabled={!isInCompare && compareList.length >= 2}
                        className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                          isInCompare ? "border-blue-400/60 bg-blue-500/20 text-blue-200"
                            : compareList.length >= 2 ? "border-white/5 text-white/20 cursor-not-allowed"
                            : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
                        }`}
                      >
                        ⇄
                      </button>
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
          <div className={filteredPhones.length > 0 ? "mt-12" : ""}>
            {(activeBrand === "All" || activeBrand === "Accessories") && (
              <h2 className="mb-4 text-lg font-bold text-white/60">Accessories</h2>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAccessories.map((acc) => {
                const inCart = isInCart(acc.id);
                return (
                  <div key={acc.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition duration-300 hover:-translate-y-1 hover:border-white/25">
                    <div className="relative flex h-40 items-center justify-center overflow-hidden bg-white/5">
                      {acc.images && acc.images.length > 0 ? (
                        <img src={acc.images[0]} alt={acc.name} className="h-full w-full object-contain p-4" />
                      ) : (
                        <div className="text-4xl">
                          {acc.category === "Charger" ? "🔌" : acc.category === "Cable" ? "🔋" : acc.category === "Case" ? "📱" : "🛡️"}
                        </div>
                      )}
                      {acc.is_original && (
                        <span className="absolute left-3 top-3 rounded-full border border-amber-500/30 bg-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-300">Original ✓</span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-2 flex gap-2">
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/50">{acc.brand}</span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/50">{acc.category}</span>
                      </div>
                      <h2 className="text-lg font-bold leading-tight text-white">{acc.name}</h2>
                      {acc.description && <p className="mt-1 text-sm text-white/50 line-clamp-2">{acc.description}</p>}
                      <p className="mt-3 text-xl font-extrabold text-white">Rs. {acc.price.toLocaleString()}</p>
                    </div>
                    <div className="px-5 pb-4">
                      <button
                        onClick={() => addItem({
                          id: acc.id, model: acc.name, storage: "", color: "",
                          category: acc.category, brand: acc.brand, condition: acc.condition,
                          price: acc.price, discount_price: acc.discount_price,
                          image: acc.images?.[0] ?? null, free_case: false,
                        })}
                        className={`w-full rounded-xl py-2.5 text-xs font-bold transition ${inCart ? "border border-green-500/30 bg-green-500/10 text-green-300" : "bg-blue-500 text-white hover:bg-blue-400"}`}
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
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40 animate-pulse">Loading...</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}