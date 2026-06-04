import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xadxdkbdwyulprfukrjb.supabase.co",
  process.env.SUPABASE_SERVICE_KEY ?? "sb_publishable_xdfjlB6s9sGF3imO0S-l-A_WW1CjdVh"
);

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "orders@phonesai.pk";

const getReEngagementEmail = (name: string) => `
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
      <p style="font-size:40px;margin:0 0 12px;">👋</p>
      <h2 style="color:#ffffff;font-size:22px;font-weight:800;margin:0 0 8px;">${name} Janab, bahut din ho gaye!</h2>
      <p style="color:#9ca3af;font-size:14px;margin:0 0 24px;">Naye verified phones aa gaye hain — PTA approved, Non-PTA, JV — sab available hain. Dekh lein!</p>
      <a href="https://phonesai.pk/shop"
        style="display:inline-block;background:#3b82f6;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:12px;">
        Naye Phones Dekhein →
      </a>
    </div>
    <div style="background:#111111;border:1px solid #1f2937;border-radius:16px;padding:24px;margin-bottom:24px;">
      <h3 style="color:#ffffff;font-size:15px;font-weight:700;margin:0 0 16px;">Abhi available hain:</h3>
      <div style="display:flex;gap:12px;margin-bottom:12px;">
        <span style="font-size:20px;">📱</span>
        <div><p style="color:#ffffff;font-size:14px;font-weight:600;margin:0;">iPhones</p><p style="color:#9ca3af;font-size:12px;margin:4px 0 0;">PTA, Non-PTA, JV — verified aur asli</p></div>
      </div>
      <div style="display:flex;gap:12px;margin-bottom:12px;">
        <span style="font-size:20px;">📱</span>
        <div><p style="color:#ffffff;font-size:14px;font-weight:600;margin:0;">Samsung Galaxy S Ultra</p><p style="color:#9ca3af;font-size:12px;margin:4px 0 0;">S24, S25, S26 Ultra — PTA & Non-PTA</p></div>
      </div>
      <div style="display:flex;gap:12px;">
        <span style="font-size:20px;">🎧</span>
        <div><p style="color:#ffffff;font-size:14px;font-weight:600;margin:0;">Accessories</p><p style="color:#9ca3af;font-size:12px;margin:4px 0 0;">AirPods, Apple Watch, Chargers, Cables</p></div>
      </div>
    </div>
    <div style="background:#111111;border:1px solid #166534;border-radius:16px;padding:20px;text-align:center;margin-bottom:24px;">
      <p style="color:#4ade80;font-size:13px;margin:0;">💡 New arrivals aur restock alerts ke liye email list join karein — phonesai.pk</p>
    </div>
    <div style="background:#111111;border:1px solid #1f2937;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center;">
      <p style="font-size:24px;margin:0 0 8px;">🧔</p>
      <p style="color:#fcd34d;font-size:13px;font-weight:700;margin:0 0 4px;">Ustaad Ji ka Wada</p>
      <p style="color:#9ca3af;font-size:12px;margin:0;">7-din warranty • Verified devices • Wah Cantt physical store</p>
    </div>
    <div style="text-align:center;padding-top:24px;border-top:1px solid #1f2937;">
      <p style="color:#6b7280;font-size:12px;margin:0;">PhonesAI • <a href="https://phonesai.pk" style="color:#3b82f6;text-decoration:none;">phonesai.pk</a> • Wah Cantt, Pakistan</p>
      <p style="color:#374151;font-size:11px;margin:8px 0 0;">Yeh email automatically bheja gaya hai.</p>
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
    // Find verified subscribers who haven't ordered in 30+ days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: recentCustomers } = await supabase
      .from("orders")
      .select("customer_email")
      .gte("created_at", thirtyDaysAgo);

    const recentEmails = (recentCustomers ?? []).map(o => o.customer_email).filter(Boolean);

    const { data: leads } = await supabase
      .from("customer_leads")
      .select("email, name")
      .eq("verified", true);

    if (!leads || leads.length === 0) {
      return NextResponse.json({ sent: 0, message: "No leads found" });
    }

    // Filter out recent customers
    const inactiveLeads = leads.filter(l => !recentEmails.includes(l.email));

    let sent = 0;
    for (const lead of inactiveLeads.slice(0, 100)) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `Ustaad Ji at PhonesAI <${FROM_EMAIL}>`,
          to: [lead.email],
          subject: "👋 Bahut din ho gaye — naye phones aa gaye hain!",
          html: getReEngagementEmail(lead.name ?? "Janab"),
        }),
      });
      sent++;
    }

    return NextResponse.json({ sent, message: `Re-engagement emails sent: ${sent}` });
  } catch (error) {
    console.error("Re-engagement cron error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}