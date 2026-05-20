import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xadxdkbdwyulprfukrjb.supabase.co",
  process.env.SUPABASE_SERVICE_KEY ?? "sb_publishable_xdfjlB6s9sGF3imO0S-l-A_WW1CjdVh"
);

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "orders@phonesai.pk";

const getAbandonedCartEmail = (name: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0;">Phones<span style="color:#3B82F6;">AI</span></h1>
    </div>
    <div style="background:#111111;border:1px solid #1f2937;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
      <p style="font-size:40px;margin:0 0 12px;">🛒</p>
      <h2 style="color:#ffffff;font-size:22px;font-weight:800;margin:0 0 8px;">Janab, aapka cart wait kar raha hai!</h2>
      <p style="color:#9ca3af;font-size:14px;margin:0 0 24px;">${name} Sahab, aapne kuch phones cart mein add kiye thay — kya aap checkout karna chahenge?</p>
      <a href="https://phonesai.pk/checkout?cart=true"
        style="display:inline-block;background:#3b82f6;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:12px;margin-bottom:12px;">
        Complete My Order →
      </a>
    </div>
    <div style="background:#111111;border:1px solid #1f2937;border-radius:16px;padding:24px;margin-bottom:24px;">
      <p style="color:#fcd34d;font-size:14px;font-weight:700;margin:0 0 8px;">🧔 Ustaad Ji yaad dilata hai:</p>
      <p style="color:#9ca3af;font-size:13px;margin:0;">Har verified device pe 7-din ki warranty hai. Koi risk nahi — bas asli, verified phone.</p>
    </div>
    <div style="background:#111111;border:1px solid #166534;border-radius:16px;padding:20px;text-align:center;margin-bottom:24px;">
      <p style="color:#4ade80;font-size:13px;margin:0;">💡 Coupon code <strong>SPECIAL5</strong> use karein — 5% extra off milega!</p>
    </div>
    <div style="text-align:center;padding-top:24px;border-top:1px solid #1f2937;">
      <p style="color:#6b7280;font-size:12px;margin:0;">PhonesAI • <a href="https://phonesai.pk" style="color:#3b82f6;text-decoration:none;">phonesai.pk</a></p>
      <p style="color:#374151;font-size:11px;margin:8px 0 0;">Yeh email automatically bheja gaya hai. Unsubscribe karne ke liye <a href="https://phonesai.pk" style="color:#374151;">yahan click karein</a>.</p>
    </div>
  </div>
</body>
</html>
`;

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: "No API key" }, { status: 500 });
  }

  try {
    // Find orders placed in last 24 hours to exclude those customers
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recentOrders } = await supabase
      .from("orders")
      .select("customer_email")
      .gte("created_at", yesterday);

    const recentEmails = (recentOrders ?? []).map(o => o.customer_email).filter(Boolean);

    // Find verified leads who ordered in the past but not in last 24h
    // We use customer_leads as proxy — anyone verified who hasn't ordered recently
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const { data: leads } = await supabase
      .from("customer_leads")
      .select("email, name")
      .eq("verified", true)
      .lte("created_at", twoHoursAgo)
      .not("email", "in", `(${recentEmails.length > 0 ? recentEmails.map(e => `"${e}"`).join(",") : '"none"'})`);

    if (!leads || leads.length === 0) {
      return NextResponse.json({ sent: 0, message: "No abandoned carts found" });
    }

    let sent = 0;
    for (const lead of leads.slice(0, 50)) { // max 50 per run
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `Ustaad Ji at PhonesAI <${FROM_EMAIL}>`,
          to: [lead.email],
          subject: "🛒 Aapka cart wait kar raha hai — complete karein!",
          html: getAbandonedCartEmail(lead.name ?? "Janab"),
        }),
      });
      sent++;
    }

    return NextResponse.json({ sent, message: `Abandoned cart emails sent: ${sent}` });
  } catch (error) {
    console.error("Abandoned cart cron error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}