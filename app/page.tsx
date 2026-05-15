"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

const openUstaadJi = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("openUstaadJi"));
  }
};

type Review = {
  id: string;
  customer_name: string;
  customer_city: string;
  rating: number;
  review_text: string;
  product_model: string | null;
  verified_buyer: boolean;
};

const categories = [
  {
    name: "iPhones",
    description: "PTA Approved, Non-PTA, and JV — verified units with 7-day warranty.",
    link: "/shop?brand=Apple",
    color: "from-blue-500/20 to-blue-600/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
        <rect x="7" y="2" width="10" height="20" rx="2.5" />
        <path d="M10 5.5H14" strokeLinecap="round" />
        <circle cx="12" cy="18.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Samsung Flagships",
    description: "Galaxy S Ultra series — PTA & Non-PTA, verified and 5G ready.",
    link: "/shop?brand=Samsung",
    color: "from-purple-500/20 to-purple-600/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
        <rect x="7" y="2" width="10" height="20" rx="2.5" />
        <path d="M10 5.5H14" strokeLinecap="round" />
        <circle cx="12" cy="18.5" r="1" fill="currentColor" stroke="none" />
        <path d="M10 9.5C10 8.4 10.9 8 12 8s2 .4 2 1.5-1 2-2 2-2-.9-2-2z" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "iPads",
    description: "WiFi and Cellular models — verified and ready to use.",
    link: "/shop?brand=iPad",
    color: "from-cyan-500/20 to-cyan-600/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="3" width="16" height="18" rx="2.5" />
        <circle cx="12" cy="18" r="0.8" fill="currentColor" stroke="none" />
        <rect x="7" y="6" width="10" height="9" rx="1" />
      </svg>
    ),
  },
  {
    name: "Accessories",
    description: "Original chargers, cables, cases, and screen protectors.",
    link: "/shop?brand=Accessories",
    color: "from-amber-500/20 to-amber-600/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg key={star} viewBox="0 0 20 20" fill={star <= rating ? "#FBBF24" : "none"} stroke="#FBBF24" strokeWidth="1" className="h-4 w-4">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export default function Home() {
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 80) setNavVisible(true);
      else if (currentY > lastScrollY.current + 10) setNavVisible(false);
      else if (currentY < lastScrollY.current - 10) setNavVisible(true);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const dismissed = localStorage.getItem("phonesai_email_dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setShowEmailPopup(true), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("id,customer_name,customer_city,rating,review_text,product_model,verified_buyer")
        .eq("approved", true)
        .order("rating", { ascending: false });
      if (data) setReviews(data);
    };
    fetchReviews();
  }, []);

  const handleDismiss = () => {
    setShowEmailPopup(false);
    localStorage.setItem("phonesai_email_dismissed", "true");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await supabase.from("customer_leads").insert({ email, discount_used: false });
    } catch { /* silent */ }
    setSubmitted(true);
    setTimeout(() => {
      setShowEmailPopup(false);
      localStorage.setItem("phonesai_email_dismissed", "true");
    }, 2500);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
    : null;

  const CARDS_PER_VIEW = 3;
  const maxSlide = Math.max(0, reviews.length - CARDS_PER_VIEW);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Email Popup */}
      {showEmailPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-[#0d0d0d] p-8 shadow-2xl">
            <button onClick={handleDismiss} className="absolute right-4 top-4 text-white/30 transition hover:text-white text-lg">✕</button>
            {!submitted ? (
              <>
                <div className="mb-6 text-center">
                  <p className="text-3xl mb-3">🎁</p>
                  <h2 className="text-2xl font-extrabold text-white">Get 5% Off Your First Order</h2>
                  <p className="mt-2 text-sm text-white/50 leading-relaxed">
                    Apna email dein aur pehli purchase pe 5% discount pao.
                  </p>
                </div>
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="aapka@email.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-blue-400/50" />
                  <button type="submit" className="w-full rounded-xl bg-blue-500 py-3 text-sm font-bold text-white transition hover:bg-blue-400">
                    Claim My 5% Discount →
                  </button>
                </form>
                <button onClick={handleDismiss} className="mt-4 w-full text-center text-xs text-white/25 transition hover:text-white/50">
                  No thanks, I'll pay full price
                </button>
                <p className="mt-4 text-center text-xs text-white/25">🧔 Ustaad Ji Verified • No spam</p>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-4xl mb-4">✅</p>
                <h2 className="text-xl font-extrabold text-white">Shukriya Janab!</h2>
                <p className="mt-2 text-sm text-white/50">Aapka 5% discount code email pe bhej diya gaya!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-20 border-b border-white/15 bg-black/80 backdrop-blur-xl transition-transform duration-300 ${navVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo + Wordmark */}
          <a href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="PhonesAI" className="h-9 w-auto" />
            <span className="text-lg font-semibold tracking-wide text-white">PhonesAI</span>
          </a>
          <ul className="flex items-center gap-7 text-sm font-medium text-white/80">
            <li><a href="/" className="transition hover:text-white">Home</a></li>
            <li><a href="/shop" className="transition hover:text-white">Shop</a></li>
            <li><button onClick={openUstaadJi} className="transition hover:text-white">Ustaad Ji</button></li>
            <li><a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="w-full pb-28">
        {/* Hero — starts right at top, no gap */}
        <section className="hero-gradient hero-dots relative left-1/2 w-screen -translate-x-1/2 px-6 pt-20 pb-12 sm:px-10 sm:pt-24 sm:pb-16">
          <div className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-7xl items-center gap-10 lg:grid-cols-2">

            {/* Left — Text */}
            <div className="relative z-10 flex min-h-full items-center">
              <div className="max-w-3xl">
                <p className="mb-6 inline-block rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-1 text-xs font-medium tracking-[0.2em] text-amber-200">
                  NOW WITH AI SHOPKEEPER
                </p>
                <div className="relative inline-block">
  <span className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/35 via-cyan-400/20 to-amber-300/25 blur-2xl" />
  <h1 className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-6xl font-extrabold tracking-[-0.02em] text-transparent sm:text-8xl">
    PhonesAI
  </h1>
</div>
                <div className="mt-6 block w-fit rounded-full border border-blue-300/40 bg-blue-400/15 px-4 py-1.5 text-sm font-semibold text-blue-200 shadow-[0_0_30px_rgba(59,130,246,0.25)]">
                  5G Ready
                </div>
                <p className="mt-6 max-w-2xl text-2xl font-light leading-tight text-white sm:text-4xl">
                  Premium Shopping, Reinvented.
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <button type="button" onClick={openUstaadJi}
                    className="inline-flex items-center justify-center rounded-full border border-blue-300/60 bg-gradient-to-r from-blue-500/35 to-cyan-400/30 px-8 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_0_35px_rgba(59,130,246,0.55)] transition duration-300 hover:scale-[1.03]">
                    Talk to AI Shopkeeper
                  </button>
                  <a href="/shop" className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3 text-sm font-semibold tracking-wide text-white/70 transition duration-300 hover:border-white/40 hover:text-white">
                    Browse All →
                  </a>
                </div>
              </div>
            </div>

            {/* Right — iPhone Image */}
            <div className="relative flex min-h-[min(84vh,560px)] items-center justify-center overflow-hidden lg:justify-end [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
              <img src="/iphone17.png" alt="iPhone 17 Pro"
                className="relative z-10 h-auto max-h-[84vh] w-full max-w-[640px] object-contain animate-[scaleReveal_1.4s_cubic-bezier(0.16,1,0.3,1)_forwards] [filter:brightness(0.9)_saturate(0.95)]" />
            </div>
          </div>
        </section>

        <div className="mx-auto h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-blue-400/70 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.55)]" />

        {/* Category Cards */}
        <section className="mx-auto mt-10 grid w-full max-w-6xl gap-6 px-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-6">
          {categories.map((category) => (
            <a key={category.name} href={category.link}
              className={`group rounded-2xl border border-white/15 bg-gradient-to-br ${category.color} p-6 transition duration-300 hover:-translate-y-1.5 hover:scale-[1.02] hover:border-white/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]`}>
              <div className="mb-4 text-white/70 transition group-hover:text-white">{category.icon}</div>
              <h2 className="text-lg font-bold text-white">{category.name}</h2>
              <p className="mt-2 text-xs leading-6 text-white/60">{category.description}</p>
              <p className="mt-4 text-xs font-semibold text-blue-300 transition group-hover:text-blue-200">Shop Now →</p>
            </a>
          ))}
        </section>

        {/* Trust Strip */}
        <section className="mx-auto mt-16 max-w-6xl px-6">
          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-2xl">🧔</p>
              <p className="mt-2 text-sm font-bold text-white">Ustaad Ji Verified</p>
              <p className="mt-1 text-xs text-white/40">Every device personally checked by our 25-year veteran</p>
            </div>
            <div className="text-center">
              <p className="text-2xl">🛡️</p>
              <p className="mt-2 text-sm font-bold text-white">7-Day Warranty</p>
              <p className="mt-1 text-xs text-white/40">Box kholo, check karo — koi masla nikla toh hum responsible</p>
            </div>
            <div className="text-center">
              <p className="text-2xl">🚚</p>
              <p className="mt-2 text-sm font-bold text-white">All Pakistan Delivery</p>
              <p className="mt-1 text-xs text-white/40">Islamabad/Rawalpindi same day. Other cities 2-3 days.</p>
            </div>
          </div>
        </section>

        {/* Reviews Carousel */}
        {reviews.length > 0 && (
          <section className="mx-auto mt-16 max-w-6xl px-6">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Customer Reviews</p>
                <h2 className="mt-2 text-3xl font-extrabold text-white">Real Reviews. Real Customers.</h2>
                {avgRating && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(star => (
                        <svg key={star} viewBox="0 0 20 20" fill={star <= Math.round(parseFloat(avgRating)) ? "#FBBF24" : "none"} stroke="#FBBF24" strokeWidth="1" className="h-5 w-5">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-lg font-extrabold text-white">{avgRating}</span>
                    <span className="text-sm text-white/40">out of 5 • {reviews.length} reviews</span>
                  </div>
                )}
              </div>
              {reviews.length > CARDS_PER_VIEW && (
                <div className="flex gap-2">
                  <button onClick={() => setCurrentSlide(s => Math.max(0, s - 1))} disabled={currentSlide === 0}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/50 transition hover:border-white/40 hover:text-white disabled:opacity-25">←</button>
                  <button onClick={() => setCurrentSlide(s => Math.min(maxSlide, s + 1))} disabled={currentSlide >= maxSlide}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/50 transition hover:border-white/40 hover:text-white disabled:opacity-25">→</button>
                </div>
              )}
            </div>

            <div className="overflow-hidden">
              <div
                className="flex gap-4 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(calc(-${currentSlide} * (100% / ${CARDS_PER_VIEW} + 16px / ${CARDS_PER_VIEW})))` }}
              >
                {reviews.map((review) => (
                  <div key={review.id}
                    className="relative w-[calc(33.333%-11px)] shrink-0 rounded-2xl border border-white/10 bg-white/[0.02] p-7 flex flex-col gap-4">
                    <span className="absolute right-5 top-4 text-5xl leading-none text-white/5 font-serif select-none">"</span>
                    <StarRating rating={review.rating} />
                    <p className="text-sm text-white/80 leading-relaxed flex-1">"{review.review_text}"</p>
                    {review.product_model && (
                      <p className="text-xs text-blue-300/60">re: {review.product_model}</p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div>
                        <p className="text-sm font-bold text-white">{review.customer_name}</p>
                        <p className="text-xs text-white/40">{review.customer_city}</p>
                      </div>
                      {review.verified_buyer && (
                        <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-xs text-green-300">✓ Verified</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {reviews.length > CARDS_PER_VIEW && (
              <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                  <button key={i} onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "w-6 bg-blue-400" : "w-1.5 bg-white/20"}`} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
