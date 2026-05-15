export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-6 text-center">
      <p className="text-8xl font-extrabold text-white/10">404</p>
      <h1 className="mt-4 text-3xl font-extrabold text-white">Page Not Found</h1>
      <p className="mt-3 text-sm text-white/40 max-w-sm leading-relaxed">
        Yeh page exist nahi karta Janab. Shayad link galat hai ya page hata diya gaya.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href="/"
          className="rounded-2xl bg-blue-500 px-8 py-3 text-sm font-bold text-white transition hover:bg-blue-400"
        >
          Go to Homepage
        </a>
        <a
          href="/shop"
          className="rounded-2xl border border-white/15 px-8 py-3 text-sm font-semibold text-white/60 transition hover:text-white"
        >
          Browse iPhones →
        </a>
      </div>
      <p className="mt-12 text-xs text-white/20">
        Koi masla? Ustaad Ji se poochein 👇
      </p>
    </div>
  );
}