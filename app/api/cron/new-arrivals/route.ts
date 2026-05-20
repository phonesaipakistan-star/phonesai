import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xadxdkbdwyulprfukrjb.supabase.co",
  process.env.SUPABASE_SERVICE_KEY ?? "sb_publishable_xdfjlB6s9sGF3imO0S-l-A_WW1CjdVh"
);

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "orders@phonesai.pk";

const getNewArrivalsEmail = (name: string, phones: { model: string; storage: string; category: string; price: number; discount_price: number | null; images: string[] }[]) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0;">Phones<span style="color:#3B82F6;">AI</span></h1>
      <p style="color:#6B7280;font-size:14px;margin:8px 0 0;">Premium Shopping, Reinvented.</p>
    </div>
    <div style="background:#111111;border:1px solid #1f2937;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
      <p style="font-size:40px;margin:0 0 12px;">🆕</p>
      <h2 style="color:#ffffff;font-size:22px;font-weight:800;margin:0 0 8px;">Naye Phones Aa Gaye!</h2>
      <p style="color:#9ca3af;font-size:14px;margin:0;">${name} Janab — fresh verified stock aaya hai. Pehle aayein, pehle paayein!</p>
    </div>
    <div style="margin-bottom:24px;">
      ${phones.map(phone => `
      <div style="background:#111111;border:1px solid #1f2937;border-radius:16px;padding:20px;margin-bottom:12px;display:flex;gap:16px;align-items:center;">
        ${phone.images?.[0] ? `<img src="${phone.images[0]}" alt="${phone.model}" style="width:60px;height:60px;object-fit:contain;border-radius:12px;background:#1f2937;padding:4px;" />` : `<div style="width:60px;height:60px;background:#1f2937;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;">📱</div>`}
        <div style="flex:1;">
          <p style="color:#ffffff;font-size:14px;font-weight:700;margin:0;">${phone.model}</p>
          <p style="color:#9ca3af;font-size:12px;margin:4px 0;">${phone.storage} • ${phone.category}</p>
          <p style="color:#ffffff;font-size:16px;font-weight:800;margin:4px 0 0;">Rs. ${(phone.discount_price ?? phone.price).toLocaleString()}</p>
        </div>
        <a href="https://phonesai.pk/shop" style="display:inline-block;background:#3b82f6;color:#fff;font-size:12px;font-weight:700;text-decoration:none;padding:8px 16px;border-radius:10px;">View →</a>
      </div>
      `).join("")}
    </div>
    <div style="text-align:center;margin-bottom:24px;">
      <a href="https://phonesai.pk/shop"
        style="display:inline-block;background:#3b82f6;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:12px;">
        Sab Phones Dekhein →
      </a>
    </div>
    <div style="background:#111111;border:1px solid #166534;border-radius:16px;padding:20px;text-align:center;margin-bottom:24px;">
      <p style="color:#4ade80;font-size:13px;margin:0;">💡 Coupon code <strong>SPECIAL5</strong> use karein — 5% extra off!</p>
    </div>
    <div style="text-align:center;padding-top:24px;border-top:1px solid #1f2937;">
      <p style="color:#6b7280;font-size:12px;margin:0;">PhonesAI • <a href="https://phonesai.pk" style="color:#3b82f6;text-decoration:none;">phonesai.pk</a> • Wah Cantt, Pakistan</p>
    </div>
  </div>
</body>
</html>
`;

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: "No API key" }, { status: 500 });
  }

  try {
    // Find phones added in last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: newPhones } = await supabase
      .from("phones")
      .select("model, storage, category, price, discount_price, images")
      .eq("in_stock", true)
      .gte("created_at", yesterday);

    if (!newPhones || newPhones.length === 0) {
      return NextResponse.json({ sent: 0, message: "No new phones today" });
    }

    // Get all verified subscribers
    const { data: leads } = await supabase
      .from("customer_leads")
      .select("email, name")
      .eq("verified", true);

    if (!leads || leads.length === 0) {
      return NextResponse.json({ sent: 0, message: "No verified subscribers" });
    }

    let sent = 0;
    for (const lead of leads.slice(0, 100)) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `PhonesAI <${FROM_EMAIL}>`,
          to: [lead.email],
          subject: `🆕 ${newPhones.length} Naye Phone${newPhones.length > 1 ? "s" : ""} Aa Ga${newPhones.length > 1 ? "ye" : "ya"}!`,
          html: getNewArrivalsEmail(lead.name ?? "Janab", newPhones),
        }),
      });
      sent++;
    }

    return NextResponse.json({ sent, message: `New arrivals emails sent: ${sent}` });
  } catch (error) {
    console.error("New arrivals cron error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}