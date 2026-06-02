export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Legal</p>
        <h1 className="text-4xl font-extrabold text-white mb-2">Terms & Conditions</h1>
        <p className="text-white/40 text-sm mb-10">Last updated: May 2026</p>
        <div className="space-y-8 text-sm text-white/60 leading-relaxed">
          <div>
            <h2 className="text-white font-bold text-lg mb-3">1. General</h2>
            <p>PhonesAI (phonesai.pk) is an online phone store based in Wah Cantt, Pakistan. By using this website or placing an order, you agree to these terms.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-3">2. Products</h2>
            <p>All devices are verified before dispatch. Product descriptions — battery health, condition, Face ID status, category (PTA/Non-PTA/JV) — are accurate at time of listing. Minor variations in color due to photography lighting may occur.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-3">3. Pricing</h2>
            <p>All prices are in Pakistani Rupees (PKR) and are fixed. No haggling or negotiation. Prices may change without notice but confirmed orders are honoured at the price at time of order.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-3">4. Orders & Payment</h2>
            <p>Orders are confirmed after payment is received and verified. We accept EasyPaisa, JazzCash, Raast, Bank Transfer, and Debit/Credit Card. COD is not available. Payment screenshots must be sent on WhatsApp for verification.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-3">5. Delivery</h2>
            <p>Once payment is confirmed, your order is dispatched within 24 hours. Delivery: 1-3 working days all Pakistan via courier. Delivery is free on all orders. Risk passes to the customer upon handover to courier.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-3">6. Warranty</h2>
            <p>All devices come with a 7-day hardware warranty. See our full <a href="/warranty" className="text-blue-400 hover:underline">Warranty Policy</a> for details on what is and is not covered.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-3">7. JV & Non-PTA Devices</h2>
            <p>JV phones are permanently SIM-locked and this cannot be reversed. Non-PTA phones require PTA registration after approximately 2 months. Customers acknowledge these conditions at time of purchase. PTA taxes are the responsibility of the buyer.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-3">8. Returns</h2>
            <p>Returns are only accepted for hardware defects covered under our 7-day warranty. Change of mind, buyer's remorse, or cosmetic issues not reported before purchase are not grounds for return.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-3">9. Limitation of Liability</h2>
            <p>PhonesAI is not liable for any indirect or consequential damages arising from use of our products beyond the purchase price paid.</p>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-3">10. Contact</h2>
            <p>For any queries: <a href="https://wa.me/923001234567" className="text-blue-400 hover:underline">WhatsApp 0300-1234567</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
