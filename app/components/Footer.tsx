export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="text-xl font-extrabold text-white">PhonesAI</p>
            <p className="mt-2 text-sm text-white/40 leading-relaxed">
              Premium Shopping, Reinvented. Pakistan ka most trusted smart store — verified devices, AI-powered experience.
            </p>
            <p className="mt-4 text-xs text-white/25">📍 Wah Cantt, Pakistan</p>
          </div>

          {/* Shop */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">Shop</p>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li><a href="/shop" className="transition hover:text-white">All Products</a></li>
              <li><a href="/shop?brand=Apple" className="transition hover:text-white">iPhones</a></li>
              <li><a href="/shop?brand=Samsung" className="transition hover:text-white">Samsung Flagships</a></li>
              <li><a href="/shop?brand=iPad" className="transition hover:text-white">iPads</a></li>
              <li><a href="/shop?brand=Accessories" className="transition hover:text-white">Accessories</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">Info</p>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li><a href="/about" className="transition hover:text-white">About PhonesAI</a></li>
              <li><a href="/warranty" className="transition hover:text-white">7-Day Warranty Policy</a></li>
              <li>
                <a href="https://taxcalculator.pk/pta-tax" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  PTA Tax Calculator
                </a>
              </li>
              <li><a href="/contact" className="transition hover:text-white">Contact Us</a></li>
              <li><a href="/terms" className="transition hover:text-white">Terms & Conditions</a></li>
              <li><a href="/privacy" className="transition hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">Contact</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/50 transition hover:text-white">
                  <span className="text-green-400">●</span> WhatsApp Us
                </a>
              </li>
              <li>
                <a href="https://instagram.com/phonesai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/50 transition hover:text-white">
                  <span className="text-pink-400">●</span> Instagram
                </a>
              </li>
              <li>
                <a href="https://facebook.com/phonesai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/50 transition hover:text-white">
                  <span className="text-blue-400">●</span> Facebook
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/25">© 2026 PhonesAI. All rights reserved. Wah Cantt, Pakistan.</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/25">Powered by</span>
            <span className="text-xs font-semibold text-white/40">AI + Trust</span>
          </div>
        </div>

      </div>
    </footer>
  );
}