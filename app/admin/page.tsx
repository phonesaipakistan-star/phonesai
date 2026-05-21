"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = "PhonesAI321@";
const SUPABASE_URL = "https://xadxdkbdwyulprfukrjb.supabase.co";

type Phone = {
  id: string; model: string; storage: string; color: string; category: string;
  brand: string; condition: string; price: number; battery_health: number;
  in_stock: boolean; featured: boolean; badge: string | null; images: string[]; free_case: boolean;
};

type Accessory = {
  id: string; name: string; brand: string; category: string; price: number;
  in_stock: boolean; featured: boolean; is_original: boolean; images: string[];
};

type Review = {
  id: string; customer_name: string; customer_city: string; rating: number;
  review_text: string; product_model: string | null; review_type: string;
  verified_buyer: boolean; approved: boolean; created_at: string;
};

const emptyPhoneForm = {
  model: "", storage: "", color: "", brand: "Apple", category: "JV", condition: "New",
  price: "", cost_price: "", discount_price: "", battery_health: "", physical_condition: "10/10",
  face_id: true, five_g: true, region: "LLA", ios_version: "", sim_status: "", sim_type: "Dual SIM",
  accessories_included: "", description: "", badge: "", featured: false, in_stock: true,
  free_case: false,
  images: [] as string[],
  condition_video: "",
  battery_screenshot: [] as string[],
  imei_number: "", supplier: "",
};

const emptyAccessoryForm = {
  name: "", brand: "Apple", category: "Charger", price: "", cost_price: "", discount_price: "",
  condition: "New", in_stock: true, featured: false, is_original: true, description: "",
  compatible_with: "", images: [] as string[], badge: "",
};

const emptyReviewForm = {
  customer_name: "", customer_city: "", rating: 5, review_text: "",
  product_model: "", review_type: "store", verified_buyer: true, approved: true,
};

const getCategoriesForBrand = (brand: string) => {
  switch (brand) {
    case "Apple": return ["JV", "Non-PTA", "PTA"];
    case "Samsung": return ["PTA", "Non-PTA"];
    case "iPad": return ["WiFi", "Cellular"];
    default: return ["JV", "Non-PTA", "PTA"];
  }
};

const getAccessoryIcon = (category: string) => {
  switch (category) {
    case "Charger": return "🔌";
    case "Cable": return "🔗";
    case "AirPods": return "🎧";
    case "Apple Watch": return "⌚";
    default: return "📦";
  }
};

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => <span key={s} className={s <= rating ? "text-amber-400" : "text-white/20"}>★</span>)}
  </div>
);

// ── Image Uploader ────────────────────────────────────────────────────────────
function ImageUploader({ bucket, existingUrls, onUpload, label, accept = "image/*" }: {
  bucket: string;
  existingUrls: string[];
  onUpload: (urls: string[]) => void;
  label: string;
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(existingUrls);

  const isVideo = (url: string) => url.match(/\.(mp4|mov|webm|avi)$/i);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
      if (!error) {
        const url = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
        newUrls.push(url);
      } else {
        console.error("Upload error:", error);
      }
    }
    const combined = [...previews, ...newUrls];
    setPreviews(combined);
    onUpload(combined);
    setUploading(false);
  };

  const removeItem = (index: number) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onUpload(updated);
  };

  return (
    <div>
      <label className="mb-2 block text-xs text-white/40">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {previews.map((url, i) => (
          <div key={i} className="relative group">
            {isVideo(url) ? (
              <div className="h-16 w-24 flex items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <span className="text-2xl">🎬</span>
              </div>
            ) : (
              <img src={url} alt="" className="h-16 w-16 object-contain rounded-xl border border-white/10 bg-white/5 p-1" />
            )}
            <button type="button" onClick={() => removeItem(i)}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white opacity-0 group-hover:opacity-100 transition">✕</button>
          </div>
        ))}
        <label className={`flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/20 text-white/40 transition hover:border-blue-400/50 hover:text-blue-300 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
          {uploading ? (
            <span className="text-xs animate-pulse">Uploading...</span>
          ) : (
            <>
              <span className="text-lg">+</span>
              <span className="text-[10px]">Upload</span>
            </>
          )}
          <input type="file" multiple accept={accept} className="hidden" disabled={uploading}
            onChange={e => handleFiles(e.target.files)} />
        </label>
      </div>
      {uploading && <p className="text-xs text-blue-400 animate-pulse">⏳ Uploading to Supabase Storage...</p>}
    </div>
  );
}

// ── Video Uploader (single video) ─────────────────────────────────────────────
function VideoUploader({ bucket, existingUrl, onUpload, label }: {
  bucket: string;
  existingUrl: string;
  onUpload: (url: string) => void;
  label: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState(existingUrl);

  const handleFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "mp4";
    const fileName = `video-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
    if (!error) {
      const newUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
      setUrl(newUrl);
      onUpload(newUrl);
    } else {
      console.error("Video upload error:", error);
    }
    setUploading(false);
  };

  return (
    <div>
      <label className="mb-2 block text-xs text-white/40">{label}</label>
      {url ? (
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="text-2xl">🎬</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-green-400 font-medium">Video uploaded ✓</p>
            <p className="text-[10px] text-white/30 truncate">{url}</p>
          </div>
          <button type="button" onClick={() => { setUrl(""); onUpload(""); }}
            className="text-red-400 text-xs hover:text-red-300">Remove</button>
        </div>
      ) : (
        <label className={`flex h-20 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 text-white/40 transition hover:border-blue-400/50 hover:text-blue-300 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
          {uploading ? (
            <p className="text-xs animate-pulse">⏳ Uploading video...</p>
          ) : (
            <>
              <span className="text-2xl">🎬</span>
              <span className="text-xs">Click to upload video (MP4, MOV)</span>
              <span className="text-[10px] text-white/25">Max 100MB recommended</span>
            </>
          )}
          <input type="file" accept="video/*" className="hidden" disabled={uploading}
            onChange={e => handleFile(e.target.files)} />
        </label>
      )}
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const [phones, setPhones] = useState<Phone[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"phones" | "accessories" | "reviews">("phones");
  const [view, setView] = useState<"list" | "add" | "edit" | "add_review" | "edit_accessory">("list");
  const [phoneForm, setPhoneForm] = useState(emptyPhoneForm);
  const [accessoryForm, setAccessoryForm] = useState(emptyAccessoryForm);
  const [reviewForm, setReviewForm] = useState(emptyReviewForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [reviewFilter, setReviewFilter] = useState<"all" | "pending" | "approved">("all");

  const fetchData = async () => {
    const { data: phoneData } = await supabase.from("phones").select("id,model,storage,color,category,brand,condition,price,battery_health,in_stock,featured,badge,images,free_case").order("created_at", { ascending: false });
    const { data: accessoryData } = await supabase.from("accessories").select("id,name,brand,category,price,in_stock,featured,is_original,images").order("created_at", { ascending: false });
    const { data: reviewData } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (phoneData) setPhones(phoneData);
    if (accessoryData) setAccessories(accessoryData);
    if (reviewData) setReviews(reviewData);
    setLoading(false);
  };

  useEffect(() => { if (authed) fetchData(); }, [authed]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { setAuthed(true); setWrongPassword(false); }
    else setWrongPassword(true);
  };

  const handleToggle = async (id: string, field: string, current: boolean, table: string) => {
    await supabase.from(table).update({ [field]: !current }).eq("id", id);
    fetchData();
  };

  const handleDelete = async (id: string, table: string) => {
    if (!confirm("Are you sure?")) return;
    await supabase.from(table).delete().eq("id", id);
    fetchData();
  };

  const handleApproveReview = async (id: string, current: boolean) => {
    await supabase.from("reviews").update({ approved: !current }).eq("id", id);
    fetchData();
  };

  const handleVerifyReview = async (id: string, current: boolean) => {
    await supabase.from("reviews").update({ verified_buyer: !current }).eq("id", id);
    fetchData();
  };

  const handleEditPhone = (phone: Phone) => {
    setEditId(phone.id);
    setPhoneForm({
      ...emptyPhoneForm,
      model: phone.model, storage: phone.storage, color: phone.color,
      brand: phone.brand ?? "Apple", category: phone.category, condition: phone.condition,
      price: phone.price.toString(), battery_health: phone.battery_health?.toString() ?? "",
      badge: phone.badge ?? "", featured: phone.featured, in_stock: phone.in_stock,
      free_case: phone.free_case ?? false, images: phone.images ?? [],
    });
    setActiveTab("phones");
    setView("edit");
  };

  const handleEditAccessory = (acc: Accessory) => {
    setEditId(acc.id);
    setAccessoryForm({
      ...emptyAccessoryForm,
      name: acc.name, brand: acc.brand, category: acc.category,
      price: acc.price.toString(), in_stock: acc.in_stock, featured: acc.featured,
      is_original: acc.is_original, images: acc.images ?? [],
    });
    setView("edit_accessory");
  };

  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      model: phoneForm.model, storage: phoneForm.storage, color: phoneForm.color, brand: phoneForm.brand,
      category: phoneForm.category, condition: phoneForm.condition, price: parseInt(phoneForm.price),
      cost_price: phoneForm.cost_price ? parseInt(phoneForm.cost_price) : null,
      discount_price: phoneForm.discount_price ? parseInt(phoneForm.discount_price) : null,
      battery_health: phoneForm.battery_health ? parseInt(phoneForm.battery_health) : null,
      physical_condition: phoneForm.physical_condition, face_id: phoneForm.face_id,
      five_g: phoneForm.five_g, region: phoneForm.region, ios_version: phoneForm.ios_version || null,
      sim_status: phoneForm.sim_status || null, sim_type: phoneForm.sim_type || null,
      accessories_included: phoneForm.accessories_included || null,
      description: phoneForm.description || null, badge: phoneForm.badge || null,
      featured: phoneForm.featured, in_stock: phoneForm.in_stock, free_case: phoneForm.free_case,
      images: phoneForm.images,
      condition_video: phoneForm.condition_video || null,
      battery_screenshot: phoneForm.battery_screenshot,
      imei_number: phoneForm.imei_number || null, supplier: phoneForm.supplier || null,
    };
    if (view === "edit" && editId) {
      await supabase.from("phones").update(payload).eq("id", editId);
      setSuccessMsg("Phone updated!");
    } else {
      await supabase.from("phones").insert(payload);
      setSuccessMsg("Phone added!");
    }
    setSaving(false); setPhoneForm(emptyPhoneForm); setEditId(null); setView("list"); fetchData();
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleSaveAccessory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: accessoryForm.name, brand: accessoryForm.brand, category: accessoryForm.category,
      price: parseInt(accessoryForm.price),
      cost_price: accessoryForm.cost_price ? parseInt(accessoryForm.cost_price) : null,
      discount_price: accessoryForm.discount_price ? parseInt(accessoryForm.discount_price) : null,
      condition: accessoryForm.condition, in_stock: accessoryForm.in_stock, featured: accessoryForm.featured,
      is_original: accessoryForm.is_original, description: accessoryForm.description || null,
      compatible_with: accessoryForm.compatible_with ? accessoryForm.compatible_with.split(",").map(s => s.trim()).filter(Boolean) : [],
      images: accessoryForm.images,
      badge: accessoryForm.badge || null,
    };
    if (view === "edit_accessory" && editId) {
      await supabase.from("accessories").update(payload).eq("id", editId);
      setSuccessMsg("Accessory updated!");
    } else {
      await supabase.from("accessories").insert(payload);
      setSuccessMsg("Accessory added!");
    }
    setSaving(false); setAccessoryForm(emptyAccessoryForm); setEditId(null); setView("list"); fetchData();
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from("reviews").insert({
      customer_name: reviewForm.customer_name, customer_city: reviewForm.customer_city,
      rating: reviewForm.rating, review_text: reviewForm.review_text,
      product_model: reviewForm.product_model || null, review_type: reviewForm.review_type,
      verified_buyer: reviewForm.verified_buyer, approved: reviewForm.approved,
    });
    setSuccessMsg("Review added!"); setSaving(false); setReviewForm(emptyReviewForm); setView("list"); fetchData();
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const filteredReviews = reviews.filter(r => {
    if (reviewFilter === "pending") return !r.approved;
    if (reviewFilter === "approved") return r.approved;
    return true;
  });

  const pendingCount = reviews.filter(r => !r.approved).length;

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <p className="text-2xl font-extrabold text-white">PhonesAI</p>
            <p className="mt-1 text-sm text-white/40">Admin Panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-blue-400/50" />
            {wrongPassword && <p className="text-xs text-red-400">Wrong password. Try again.</p>}
            <button type="submit" className="w-full rounded-xl bg-blue-500 py-3 text-sm font-bold text-white transition hover:bg-blue-400">Login →</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="border-b border-amber-300/20 bg-amber-300/5 px-6 py-2 flex items-center justify-between">
        <span className="text-xs text-amber-300 font-semibold">🔐 Admin Panel</span>
        <div className="flex items-center gap-4">
          <a href="/shop" target="_blank" className="text-xs text-white/50 hover:text-white transition">View Shop →</a>
          <button onClick={() => setAuthed(false)} className="text-xs text-white/30 hover:text-white transition">Logout</button>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {successMsg && (
          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">✅ {successMsg}</div>
        )}

        {view === "list" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => setActiveTab("phones")}
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${activeTab === "phones" ? "bg-blue-500 text-white" : "border border-white/10 text-white/50 hover:text-white"}`}>
                  📱 Phones ({phones.length})
                </button>
                <button onClick={() => setActiveTab("accessories")}
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${activeTab === "accessories" ? "bg-blue-500 text-white" : "border border-white/10 text-white/50 hover:text-white"}`}>
                  🎧 Accessories ({accessories.length})
                </button>
                <button onClick={() => setActiveTab("reviews")}
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition relative ${activeTab === "reviews" ? "bg-blue-500 text-white" : "border border-white/10 text-white/50 hover:text-white"}`}>
                  ⭐ Reviews ({reviews.length})
                  {pendingCount > 0 && <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{pendingCount}</span>}
                </button>
              </div>
              <button onClick={() => { setPhoneForm(emptyPhoneForm); setAccessoryForm(emptyAccessoryForm); setView(activeTab === "reviews" ? "add_review" : "add"); }}
                className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-400">
                + Add {activeTab === "phones" ? "Phone" : activeTab === "accessories" ? "Accessory" : "Review"}
              </button>
            </div>

            {loading ? <p className="animate-pulse text-white/30">Loading...</p> : activeTab === "phones" ? (
              <div className="space-y-3">
                {phones.length === 0 && <p className="text-white/30">No phones yet.</p>}
                {phones.map(phone => (
                  <div key={phone.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      {phone.images?.[0] ? <img src={phone.images[0]} alt="" className="h-full w-full object-contain" /> : <span className="text-white/20 text-xs">📱</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{phone.brand} {phone.model} • {phone.storage} • {phone.color}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-2 py-0.5 text-xs ${phone.category === "PTA" ? "border-green-500/30 text-green-300" : phone.category === "Non-PTA" ? "border-blue-500/30 text-blue-300" : phone.category === "JV" ? "border-amber-500/30 text-amber-300" : "border-purple-500/30 text-purple-300"}`}>{phone.category}</span>
                        <span className={`text-xs ${phone.condition === "Pre-Owned" ? "text-amber-300" : "text-green-300"}`}>{phone.condition}</span>
                        {phone.battery_health && <span className="text-xs text-white/40">🔋 {phone.battery_health}%</span>}
                        {phone.free_case && <span className="text-xs text-green-300">🎁 Free Case</span>}
                      </div>
                    </div>
                    <p className="shrink-0 font-bold text-white">Rs. {phone.price.toLocaleString()}</p>
                    <div className="flex shrink-0 items-center gap-2">
                      <button onClick={() => handleToggle(phone.id, "in_stock", phone.in_stock, "phones")}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${phone.in_stock ? "border-green-500/30 bg-green-500/10 text-green-300" : "border-red-500/30 bg-red-500/10 text-red-300"}`}>
                        {phone.in_stock ? "In Stock" : "Sold"}
                      </button>
                      <button onClick={() => handleToggle(phone.id, "featured", phone.featured, "phones")}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${phone.featured ? "border-amber-500/30 bg-amber-500/10 text-amber-300" : "border-white/10 text-white/30 hover:text-white/60"}`}>⭐</button>
                      <button onClick={() => handleEditPhone(phone)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 transition hover:text-white">Edit</button>
                      <button onClick={() => handleDelete(phone.id, "phones")} className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeTab === "accessories" ? (
              <div className="space-y-3">
                {accessories.length === 0 && <p className="text-white/30">No accessories yet.</p>}
                {accessories.map(acc => (
                  <div key={acc.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 text-2xl">
                      {acc.images?.[0] ? <img src={acc.images[0]} alt="" className="h-full w-full object-contain" /> : getAccessoryIcon(acc.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{acc.name}</p>
                      <div className="mt-1 flex gap-2">
                        <span className="text-xs text-white/40">{acc.brand}</span>
                        <span className="text-xs text-white/40">{acc.category}</span>
                        {acc.is_original && <span className="text-xs text-amber-300">Original ✓</span>}
                      </div>
                    </div>
                    <p className="shrink-0 font-bold text-white">Rs. {acc.price.toLocaleString()}</p>
                    <div className="flex shrink-0 items-center gap-2">
                      <button onClick={() => handleToggle(acc.id, "in_stock", acc.in_stock, "accessories")}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${acc.in_stock ? "border-green-500/30 bg-green-500/10 text-green-300" : "border-red-500/30 bg-red-500/10 text-red-300"}`}>
                        {acc.in_stock ? "In Stock" : "Sold Out"}
                      </button>
                      <button onClick={() => handleEditAccessory(acc)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 transition hover:text-white">Edit</button>
                      <button onClick={() => handleDelete(acc.id, "accessories")} className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="mb-4 flex gap-3">
                  {(["all", "pending", "approved"] as const).map(f => (
                    <button key={f} onClick={() => setReviewFilter(f)}
                      className={`rounded-full border px-4 py-1.5 text-xs font-medium transition capitalize ${reviewFilter === f ? "border-blue-400/60 bg-blue-500/20 text-blue-200" : "border-white/10 text-white/40 hover:text-white/60"}`}>
                      {f} {f === "pending" && pendingCount > 0 ? `(${pendingCount})` : ""}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  {filteredReviews.length === 0 && <p className="text-white/30">No reviews found.</p>}
                  {filteredReviews.map(review => (
                    <div key={review.id} className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <StarDisplay rating={review.rating} />
                            <span className="text-sm font-bold text-white">{review.customer_name}</span>
                            <span className="text-xs text-white/40">{review.customer_city}</span>
                            {review.product_model && <span className="text-xs text-blue-300/60">re: {review.product_model}</span>}
                          </div>
                          <p className="mt-2 text-sm text-white/70 leading-relaxed">"{review.review_text}"</p>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2">
                          <button onClick={() => handleApproveReview(review.id, review.approved)}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${review.approved ? "border-green-500/30 bg-green-500/10 text-green-300" : "border-white/10 text-white/40 hover:text-white/70"}`}>
                            {review.approved ? "✓ Approved" : "Approve"}
                          </button>
                          <button onClick={() => handleVerifyReview(review.id, review.verified_buyer)}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${review.verified_buyer ? "border-blue-500/30 bg-blue-500/10 text-blue-300" : "border-white/10 text-white/40"}`}>
                            {review.verified_buyer ? "Verified" : "Mark Verified"}
                          </button>
                          <button onClick={() => handleDelete(review.id, "reviews")} className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ── Phone Form ── */}
        {(view === "add" || view === "edit") && activeTab === "phones" && (
          <>
            <div className="mb-8"><h1 className="text-2xl font-extrabold text-white">{view === "edit" ? "Edit Phone" : "Add New Phone"}</h1></div>
            <form onSubmit={handleSavePhone} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-white/40">Brand *</label>
                  <select value={phoneForm.brand} onChange={e => setPhoneForm({...phoneForm, brand: e.target.value, category: getCategoriesForBrand(e.target.value)[0]})}
                    className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-2.5 text-sm text-white outline-none">
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="iPad">iPad</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/40">Category *</label>
                  <select value={phoneForm.category} onChange={e => setPhoneForm({...phoneForm, category: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-2.5 text-sm text-white outline-none">
                    {getCategoriesForBrand(phoneForm.brand).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/40">Condition *</label>
                  <select value={phoneForm.condition} onChange={e => setPhoneForm({...phoneForm, condition: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-2.5 text-sm text-white outline-none">
                    <option value="New">New</option>
                    <option value="Pre-Owned">Pre-Owned</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/40">SIM Type</label>
                  <select value={phoneForm.sim_type} onChange={e => setPhoneForm({...phoneForm, sim_type: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-2.5 text-sm text-white outline-none">
                    <option value="Single SIM">Single SIM</option>
                    <option value="Dual SIM">Dual SIM</option>
                    <option value="eSIM">eSIM</option>
                    <option value="Dual eSIM">Dual eSIM</option>
                    <option value="SIM + eSIM">SIM + eSIM</option>
                  </select>
                </div>
                {[
                  { label: "Model *", key: "model", placeholder: "iPhone 16 Pro Max", required: true },
                  { label: "Storage *", key: "storage", placeholder: "256GB", required: true },
                  { label: "Color *", key: "color", placeholder: "Desert Titanium", required: true },
                  { label: "Sale Price (PKR) *", key: "price", placeholder: "285000", type: "number", required: true },
                  { label: "Discount Price (PKR)", key: "discount_price", placeholder: "265000", type: "number" },
                  { label: "Cost Price (PKR) — private", key: "cost_price", placeholder: "240000", type: "number" },
                  { label: "Battery Health (%)", key: "battery_health", placeholder: "91", type: "number" },
                  { label: "Region", key: "region", placeholder: "LLA" },
                  { label: "iOS/OS Version", key: "ios_version", placeholder: "iOS 18.4" },
                  { label: "SIM Status", key: "sim_status", placeholder: "SIM Ready / SIM Locked" },
                  { label: "In the Box", key: "accessories_included", placeholder: "Cable Only / Full Box" },
                  { label: "Physical Condition", key: "physical_condition", placeholder: "10/10" },
                  { label: "IMEI — private", key: "imei_number", placeholder: "352ABC..." },
                  { label: "Supplier — private", key: "supplier", placeholder: "Dubai Supplier" },
                ].map(({ label, key, placeholder, type, required }) => (
                  <div key={key}>
                    <label className="mb-1 block text-xs text-white/40">{label}</label>
                    <input required={required} value={phoneForm[key as keyof typeof phoneForm] as string}
                      onChange={e => setPhoneForm({...phoneForm, [key]: e.target.value})}
                      placeholder={placeholder} type={type ?? "text"}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
                  </div>
                ))}
                <div>
                  <label className="mb-1 block text-xs text-white/40">Badge</label>
                  <select value={phoneForm.badge} onChange={e => setPhoneForm({...phoneForm, badge: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-2.5 text-sm text-white outline-none">
                    <option value="">None</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Hot Deal">Hot Deal</option>
                    <option value="Best Value">Best Value</option>
                    <option value="Last Unit">Last Unit</option>
                  </select>
                </div>
              </div>

              {/* Phone Images Upload */}
              <ImageUploader
                bucket="phone-images"
                existingUrls={phoneForm.images}
                onUpload={(urls) => setPhoneForm({...phoneForm, images: urls})}
                label="📸 Phone Photos — upload from laptop or phone (JPEG, HEIC, PNG)"
                accept="image/*"
              />

              {/* Condition Video Upload */}
              <VideoUploader
                bucket="phone-images"
                existingUrl={phoneForm.condition_video}
                onUpload={(url) => setPhoneForm({...phoneForm, condition_video: url})}
                label="🎬 Condition Video — upload MP4 or MOV (shows phone working condition)"
              />

              {/* Battery Screenshot Upload */}
              <ImageUploader
                bucket="phone-images"
                existingUrls={phoneForm.battery_screenshot}
                onUpload={(urls) => setPhoneForm({...phoneForm, battery_screenshot: urls})}
                label="🔋 Battery Health Screenshot — upload from phone settings"
                accept="image/*"
              />

              <div>
                <label className="mb-1 block text-xs text-white/40">Ustaad Ji Notes</label>
                <textarea value={phoneForm.description} onChange={e => setPhoneForm({...phoneForm, description: e.target.value})}
                  placeholder="Pin-pack sealed unit." rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50 resize-none" />
              </div>
              <div className="flex flex-wrap gap-6">
                {[
                  { label: "Face ID / Fingerprint", key: "face_id" },
                  { label: "5G", key: "five_g" },
                  { label: "In Stock", key: "in_stock" },
                  { label: "Featured", key: "featured" },
                  { label: "Free Case 🎁", key: "free_case" },
                ].map(({ label, key }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={phoneForm[key as keyof typeof phoneForm] as boolean}
                      onChange={e => setPhoneForm({...phoneForm, [key]: e.target.checked})}
                      className="h-4 w-4 rounded accent-blue-500" />
                    <span className="text-sm text-white/70">{label}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setView("list"); setPhoneForm(emptyPhoneForm); setEditId(null); }}
                  className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/60 hover:text-white transition">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 rounded-xl bg-blue-500 py-3 text-sm font-bold text-white transition hover:bg-blue-400 disabled:opacity-50">
                  {saving ? "Saving..." : view === "edit" ? "Update Phone" : "Add Phone"}
                </button>
              </div>
            </form>
          </>
        )}

        {/* ── Accessory Form ── */}
        {(view === "add" && activeTab === "accessories") || view === "edit_accessory" ? (
          <>
            <div className="mb-8"><h1 className="text-2xl font-extrabold text-white">{view === "edit_accessory" ? "Edit Accessory" : "Add New Accessory"}</h1></div>
            <form onSubmit={handleSaveAccessory} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-white/40">Name *</label>
                  <input required value={accessoryForm.name} onChange={e => setAccessoryForm({...accessoryForm, name: e.target.value})}
                    placeholder="AirPods Pro 2nd Gen"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/40">Brand *</label>
                  <select value={accessoryForm.brand} onChange={e => setAccessoryForm({...accessoryForm, brand: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-2.5 text-sm text-white outline-none">
                    <option value="Apple">Apple</option>
                    <option value="Third Party">Third Party</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/40">Category *</label>
                  <select value={accessoryForm.category} onChange={e => setAccessoryForm({...accessoryForm, category: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-2.5 text-sm text-white outline-none">
                    <option value="Charger">Charger</option>
                    <option value="Cable">Cable</option>
                    <option value="AirPods">AirPods</option>
                    <option value="Apple Watch">Apple Watch</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/40">Sale Price (PKR) *</label>
                  <input required value={accessoryForm.price} onChange={e => setAccessoryForm({...accessoryForm, price: e.target.value})}
                    placeholder="45000" type="number"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/40">Cost Price — private</label>
                  <input value={accessoryForm.cost_price} onChange={e => setAccessoryForm({...accessoryForm, cost_price: e.target.value})}
                    placeholder="38000" type="number"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/40">Compatible With</label>
                  <input value={accessoryForm.compatible_with} onChange={e => setAccessoryForm({...accessoryForm, compatible_with: e.target.value})}
                    placeholder="iPhone 15, 16, 17, iPad"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
                </div>
              </div>

              {/* Accessory Images Upload */}
              <ImageUploader
                bucket="phone-images"
                existingUrls={accessoryForm.images}
                onUpload={(urls) => setAccessoryForm({...accessoryForm, images: urls})}
                label="📸 Accessory Photos — upload from laptop or phone"
                accept="image/*"
              />

              <div>
                <label className="mb-1 block text-xs text-white/40">Description</label>
                <textarea value={accessoryForm.description} onChange={e => setAccessoryForm({...accessoryForm, description: e.target.value})}
                  placeholder="Original Apple — pin-pack condition." rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50 resize-none" />
              </div>
              <div className="flex flex-wrap gap-6">
                {[{ label: "Original / Genuine", key: "is_original" }, { label: "In Stock", key: "in_stock" }, { label: "Featured", key: "featured" }].map(({ label, key }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={accessoryForm[key as keyof typeof accessoryForm] as boolean}
                      onChange={e => setAccessoryForm({...accessoryForm, [key]: e.target.checked})}
                      className="h-4 w-4 rounded accent-blue-500" />
                    <span className="text-sm text-white/70">{label}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setView("list"); setAccessoryForm(emptyAccessoryForm); setEditId(null); }}
                  className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/60 hover:text-white transition">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 rounded-xl bg-blue-500 py-3 text-sm font-bold text-white transition hover:bg-blue-400 disabled:opacity-50">
                  {saving ? "Saving..." : view === "edit_accessory" ? "Update Accessory" : "Add Accessory"}
                </button>
              </div>
            </form>
          </>
        ) : null}

        {/* ── Review Form ── */}
        {view === "add_review" && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-white">Add Review</h1>
              <p className="text-sm text-white/40 mt-1">Add existing customer reviews from your physical store</p>
            </div>
            <form onSubmit={handleSaveReview} className="space-y-5 max-w-xl">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-white/40">Customer Name *</label>
                  <input required value={reviewForm.customer_name} onChange={e => setReviewForm({...reviewForm, customer_name: e.target.value})}
                    placeholder="Ahmed Khan"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/40">City</label>
                  <input value={reviewForm.customer_city} onChange={e => setReviewForm({...reviewForm, customer_city: e.target.value})}
                    placeholder="Islamabad"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/40">Rating *</label>
                  <select value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
                    className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-2.5 text-sm text-white outline-none">
                    {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r !== 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/40">Review Type</label>
                  <select value={reviewForm.review_type} onChange={e => setReviewForm({...reviewForm, review_type: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-2.5 text-sm text-white outline-none">
                    <option value="store">Store Experience</option>
                    <option value="product">Product Review</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/40">Product Model (if product review)</label>
                <input value={reviewForm.product_model} onChange={e => setReviewForm({...reviewForm, product_model: e.target.value})}
                  placeholder="iPhone 16 Pro Max"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/40">Review Text *</label>
                <textarea required value={reviewForm.review_text} onChange={e => setReviewForm({...reviewForm, review_text: e.target.value})}
                  placeholder="Customer ka review yahan likhein..." rows={4}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/50 resize-none" />
              </div>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={reviewForm.verified_buyer} onChange={e => setReviewForm({...reviewForm, verified_buyer: e.target.checked})} className="h-4 w-4 rounded accent-blue-500" />
                  <span className="text-sm text-white/70">Verified Buyer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={reviewForm.approved} onChange={e => setReviewForm({...reviewForm, approved: e.target.checked})} className="h-4 w-4 rounded accent-blue-500" />
                  <span className="text-sm text-white/70">Approve immediately</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setView("list"); setReviewForm(emptyReviewForm); }}
                  className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/60 hover:text-white transition">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 rounded-xl bg-blue-500 py-3 text-sm font-bold text-white transition hover:bg-blue-400 disabled:opacity-50">
                  {saving ? "Saving..." : "Add Review"}
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}