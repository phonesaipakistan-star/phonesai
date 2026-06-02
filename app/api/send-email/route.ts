import { NextResponse } from "next/server";
import { WATER_PACK_DESCRIPTION } from "@/lib/waterPack";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "orders@phonesai.pk";
const ADMIN_EMAIL = "phonesaipakistan@gmail.com";
const SITE_URL = "https://phonesai.pk";

type OrderEmailData = {
  type: "order_confirmation" | "unboxing_guide" | "admin_notification" | "verify_email";
  customerName?: string;
  customerEmail: string;
  customerWhatsApp?: string;
  customerCity?: string;
  verificationToken?: string;
  items?: {
    model: string;
    storage: string;
    color: string;
    category: string;
    condition: string;
    condition_grade?: string;
    price: number;
    freeAccessoryLine?: string;
    quantityRemaining?: number | null;
  }[];
  totalPrice?: number;
  paymentMethod?: string;
  couponApplied?: boolean;
};

// Spam notice shown at bottom of all customer emails
const spamNotice = `
  <div style="background:#1a1a1a;border:1px solid #2d2d2d;border-radius:12px;padding:16px;margin-top:24px;text-align:center;">
    <p style="color:#6b7280;font-size:12px;margin:0 0 6px;">📬 <strong style="color:#9ca3af;">Yeh email spam mein gayi hai?</strong></p>
    <p style="color:#6b7280;font-size:12px;margin:0;">Apni spam/junk folder check karein aur email ko <strong style="color:#9ca3af;">"Not Spam"</strong> mark karein taake future emails directly inbox mein aayein.</p>
  </div>
`;

const getVerificationEmail = (email: string, token: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0;">Phones<span style="color:#3B82F6;">AI</span></h1>
      <p style="color:#6B7280;font-size:14px;margin:8px 0 0;">Premium Shopping, Reinvented.</p>
    </div>
    <div style="background:#0c1a3a;border:1px solid #1e40af;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
      <p style="font-size:40px;margin:0 0 12px;">🎁</p>
      <h2 style="color:#93c5fd;font-size:22px;font-weight:800;margin:0 0 8px;">Email Verify Karein</h2>
      <p style="color:#bfdbfe;font-size:14px;margin:0 0 24px;">Apna SPECIAL5 discount code hasil karne ke liye neeche button dabayein.</p>
      <a href="${SITE_URL}/api/verify-email?token=${token}"
        style="display:inline-block;background:#3b82f6;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:12px;">
        ✅ Email Verify Karein — Discount Lein
      </a>
    </div>
    <div style="background:#111111;border:1px solid #1f2937;border-radius:16px;padding:24px;margin-bottom:24px;">
      <p style="color:#9ca3af;font-size:13px;margin:0 0 8px;">Verify karne ke baad milega:</p>
      <div style="background:#1a2a1a;border:1px solid #166534;border-radius:12px;padding:16px;text-align:center;">
        <p style="color:#4ade80;font-size:24px;font-weight:800;letter-spacing:0.1em;margin:0;">SPECIAL5</p>
        <p style="color:#86efac;font-size:12px;margin:4px 0 0;">5% off your first order</p>
      </div>
    </div>
    <p style="color:#6b7280;font-size:12px;text-align:center;margin:0;">Yeh link 24 ghante mein expire ho jata hai. Agar aapne signup nahi kiya toh is email ko ignore karein.</p>
    ${spamNotice}
    <div style="text-align:center;padding-top:24px;border-top:1px solid #1f2937;margin-top:24px;">
      <p style="color:#6b7280;font-size:12px;margin:0;">PhonesAI • <a href="https://phonesai.pk" style="color:#3b82f6;text-decoration:none;">phonesai.pk</a></p>
    </div>
  </div>
</body>
</html>
`;

const getOrderConfirmationEmail = (data: OrderEmailData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0;">
        Phones<span style="color:#3B82F6;">AI</span>
      </h1>
      <p style="color:#6B7280;font-size:14px;margin:8px 0 0;">Premium Shopping, Reinvented.</p>
    </div>

    <div style="background:#052e16;border:1px solid #166534;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="font-size:40px;margin:0 0 8px;">✅</p>
      <h2 style="color:#4ade80;font-size:22px;font-weight:800;margin:0 0 8px;">Order Received!</h2>
      <p style="color:#86efac;font-size:14px;margin:0;">Shukriya ${data.customerName} Janab! Aapka order mil gaya.</p>
    </div>

    <div style="background:#111111;border:1px solid #1f2937;border-radius:16px;padding:24px;margin-bottom:24px;">
      <h3 style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px;">Order Summary</h3>
      ${(data.items ?? []).map(item => `
      <div style="padding:12px 0;border-bottom:1px solid #1f2937;">
        <p style="color:#ffffff;font-size:14px;font-weight:700;margin:0;">${item.model}</p>
        <p style="color:#6b7280;font-size:12px;margin:4px 0 0;">${item.storage} • ${item.color} • ${item.category}${item.condition_grade ? ` • ${item.condition_grade}` : item.condition ? ` • ${item.condition}` : ""}</p>
        <p style="color:#ffffff;font-size:14px;font-weight:700;margin:4px 0 0;">Rs. ${item.price.toLocaleString()}</p>
        ${item.freeAccessoryLine ? `<p style="color:#4ade80;font-size:11px;margin:4px 0 0;">📦 Free ${item.freeAccessoryLine} included</p>` : ""}
      </div>
      `).join("")}
      <div style="padding:16px 0 0;">
        <p style="color:#ffffff;font-size:16px;font-weight:800;margin:0;">Total: Rs. ${data.totalPrice?.toLocaleString()}</p>
        ${data.couponApplied ? `<p style="color:#4ade80;font-size:12px;margin:8px 0 0;">✓ SPECIAL5 discount applied</p>` : ""}
      </div>
    </div>

    <div style="background:#111111;border:1px solid #1f2937;border-radius:16px;padding:24px;margin-bottom:24px;">
      <p style="color:#d1d5db;font-size:14px;margin:0 0 8px;">💳 Payment: <strong style="color:#fff;">${data.paymentMethod}</strong></p>
      <p style="color:#d1d5db;font-size:14px;margin:0 0 8px;">📍 Delivery to: <strong style="color:#fff;">${data.customerCity}</strong></p>
      <p style="color:#d1d5db;font-size:14px;margin:0;">🚚 After payment confirmed: dispatched within 24 hours. Delivery 1-3 working days all Pakistan.</p>
    </div>

    <div style="background:#1c1917;border:2px solid #d97706;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center;">
      <p style="color:#fcd34d;font-size:16px;font-weight:800;margin:0 0 8px;">⏳ What happens next</p>
      <p style="color:#fbbf24;font-size:14px;margin:0 0 8px;line-height:1.6;">We will confirm availability within <strong>24 hours via WhatsApp (0304-1502560)</strong>.</p>
      <p style="color:#f87171;font-size:14px;font-weight:700;margin:0;">Please do not send payment until we confirm.</p>
    </div>

    ${(data.items ?? []).some((i) => i.condition === "New") ? `
    <div style="background:#052e16;border:1px solid #166534;border-radius:16px;padding:20px;margin-bottom:24px;">
      <p style="color:#4ade80;font-size:14px;font-weight:700;margin:0 0 8px;">💧 Water Pack</p>
      <p style="color:#86efac;font-size:13px;margin:0;line-height:1.5;">${WATER_PACK_DESCRIPTION}</p>
    </div>
    ` : ""}

    <div style="background:#052e16;border:1px solid #166534;border-radius:16px;padding:20px;margin-bottom:24px;text-align:center;">
      <p style="color:#4ade80;font-size:14px;font-weight:700;margin:0 0 6px;">📦 Free Accessories Included</p>
      <p style="color:#86efac;font-size:13px;margin:0;">Your order includes a free ${(data.items ?? [])[0]?.freeAccessoryLine ?? "case"} — arrives ready to use. No extra trip to the market needed!</p>
    </div>

    <div style="background:#1c1917;border:1px solid #92400e;border-radius:16px;padding:24px;margin-bottom:24px;">
      <p style="color:#fcd34d;font-size:14px;font-weight:700;margin:0 0 8px;">⚠️ After We Confirm — Payment Screenshot</p>
      <p style="color:#fbbf24;font-size:13px;margin:0 0 16px;">Jab hum availability confirm kar dein, tab payment complete karke screenshot WhatsApp par bhejein.</p>
      <a href="https://wa.me/923041502560?text=Assalam o Alaikum! Maine order place kiya hai. Availability confirm kar dein please."
        style="display:inline-block;background:#16a34a;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:12px;">
        Confirm on WhatsApp → 0304-1502560
      </a>
    </div>

    <div style="background:#111111;border:1px solid #1f2937;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center;">
      <p style="font-size:28px;margin:0 0 8px;">🧔</p>
      <p style="color:#fcd34d;font-size:14px;font-weight:700;margin:0 0 8px;">Ustaad Ji ka Wada</p>
      <p style="color:#9ca3af;font-size:13px;margin:0;">7-din warranty ke saath aapka phone verified hai.</p>
    </div>

    ${spamNotice}

    <div style="text-align:center;padding-top:24px;border-top:1px solid #1f2937;margin-top:24px;">
      <p style="color:#6b7280;font-size:12px;margin:0 0 4px;">PhonesAI • Wah Cantt, Punjab, Pakistan</p>
      <p style="color:#6b7280;font-size:12px;margin:0;">
        <a href="https://phonesai.pk" style="color:#3b82f6;text-decoration:none;">phonesai.pk</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

const getUnboxingGuideEmail = (data: OrderEmailData) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0;">Phones<span style="color:#3B82F6;">AI</span></h1>
    </div>

    <div style="background:#0c0a2e;border:1px solid #4338ca;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="font-size:40px;margin:0 0 8px;">🎬</p>
      <h2 style="color:#a5b4fc;font-size:22px;font-weight:800;margin:0 0 8px;">Aapka Phone Aa Raha Hai!</h2>
      <p style="color:#c7d2fe;font-size:14px;margin:0;">${data.customerName} Janab — unboxing ke liye tayaar ho jao!</p>
    </div>

    <div style="background:#111111;border:1px solid #1f2937;border-radius:16px;padding:24px;margin-bottom:24px;">
      <h3 style="color:#ffffff;font-size:16px;font-weight:700;margin:0 0 16px;">Perfect Unboxing Video Kaise Banayein</h3>
      ${[
        "Achhi lighting mein record karein",
        "Pehle factory water pack / seal intact dikhao (never opened proof)",
        "Slowly open karein — seal break check karein",
        "Screen aur touch test karein",
        "Camera test karein — front aur back",
        "Charging test karein",
        "Speaker test karein",
        "Battery health check — Settings > Battery",
      ].map((step, i) => `
        <div style="display:flex;gap:12px;margin-bottom:12px;">
          <div style="flex-shrink:0;width:24px;height:24px;background:#1d4ed8;border-radius:50%;text-align:center;line-height:24px;">
            <span style="color:#fff;font-size:11px;font-weight:700;">${i + 1}</span>
          </div>
          <p style="color:#d1d5db;font-size:14px;margin:2px 0 0;">${step}</p>
        </div>
      `).join("")}
    </div>

    <div style="background:#0f172a;border:1px solid #1e3a5f;border-radius:16px;padding:24px;margin-bottom:24px;">
      <h3 style="color:#93c5fd;font-size:15px;font-weight:700;margin:0 0 12px;">Yeh Video Kyun Zaroori Hai?</h3>
      <p style="color:#94a3b8;font-size:13px;margin:0 0 8px;">✅ Aapki 7-din warranty ka official proof</p>
      <p style="color:#94a3b8;font-size:13px;margin:0 0 8px;">📱 Apne doston ko dikhao — flex kar lo!</p>
      <p style="color:#94a3b8;font-size:13px;margin:0;">⚠️ Bina unboxing video ke warranty claim accept nahi hoga</p>
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      <a href="https://wa.me/923041502560?text=Unboxing video bhej raha/rahi hoon!"
        style="display:inline-block;background:#16a34a;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:12px;">
        Send Us Your Unboxing Video
      </a>
    </div>

    <div style="text-align:center;padding-top:24px;border-top:1px solid #1f2937;">
      <p style="color:#6b7280;font-size:12px;margin:0;">PhonesAI • <a href="https://phonesai.pk" style="color:#3b82f6;text-decoration:none;">phonesai.pk</a></p>
    </div>
  </div>
</body>
</html>
`;

const getAdminNotificationEmail = (data: OrderEmailData) => `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;background:#f3f4f6;padding:20px;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;">
    <h2 style="color:#111827;margin:0 0 16px;">🛒 New Order — PhonesAI</h2>

    <div style="background:#fef2f2;border:2px solid #ef4444;border-radius:12px;padding:20px;margin-bottom:20px;">
      <p style="color:#dc2626;font-size:18px;font-weight:800;margin:0 0 8px;">🚨 ACTION REQUIRED</p>
      <p style="color:#991b1b;font-size:14px;margin:0 0 8px;line-height:1.5;">Confirm stock availability within <strong>24 hours</strong> and send payment details to customer on WhatsApp:</p>
      <p style="color:#111827;font-size:20px;font-weight:800;margin:0;">
        <a href="https://wa.me/${(data.customerWhatsApp ?? "").replace(/[^0-9]/g, "")}" style="color:#16a34a;text-decoration:none;">${data.customerWhatsApp}</a>
      </p>
    </div>

    <p><strong>Customer:</strong> ${data.customerName}</p>
    <p><strong>WhatsApp:</strong> <a href="https://wa.me/${(data.customerWhatsApp ?? "").replace(/[^0-9]/g, "")}">${data.customerWhatsApp}</a></p>
    <p><strong>Email:</strong> ${data.customerEmail}</p>
    <p><strong>City:</strong> ${data.customerCity}</p>
    <p><strong>Payment:</strong> ${data.paymentMethod}</p>
    <p><strong>Total:</strong> Rs. ${data.totalPrice?.toLocaleString()}</p>
    ${data.couponApplied ? `<p><strong>Coupon:</strong> SPECIAL5 applied</p>` : ""}
    <hr>
    <h3>Items:</h3>
    ${(data.items ?? []).map(item => `
      <div style="background:#f9fafb;padding:12px;border-radius:8px;margin-bottom:8px;border-left:4px solid #3b82f6;">
        <p style="margin:0;font-weight:bold;">${item.model}</p>
        <p style="margin:4px 0 0;color:#374151;"><strong>Storage:</strong> ${item.storage} • <strong>Color:</strong> ${item.color}${item.condition_grade ? ` • <strong>Grade:</strong> ${item.condition_grade}` : ""}</p>
        <p style="margin:4px 0 0;color:#6b7280;">${item.category} • Rs. ${item.price.toLocaleString()}</p>
        ${item.quantityRemaining != null ? `<p style="margin:6px 0 0;color:#dc2626;font-weight:bold;">⚠️ Quantity remaining after this order: ${item.quantityRemaining}</p>` : ""}
      </div>
    `).join("")}
  </div>
</body>
</html>
`;

export async function POST(req: Request) {
  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set");
      return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
    }

    const data: OrderEmailData = await req.json();

    if (data.type === "verify_email") {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `PhonesAI <${FROM_EMAIL}>`,
          to: [data.customerEmail],
          subject: "Email Verify Karein — SPECIAL5 Discount Pao 🎁",
          html: getVerificationEmail(data.customerEmail, data.verificationToken!),
        }),
      });
      const r = await res.json();
      console.log("Verification email result:", r);
      return NextResponse.json({ success: true });
    }

    console.log("Sending order email for:", data.customerName, data.customerEmail);

    // 1. Order confirmation to customer
    if (data.customerEmail) {
      const res1 = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `PhonesAI <${FROM_EMAIL}>`,
          to: [data.customerEmail],
          subject: `Order Confirmed — ${data.items?.[0]?.model ?? "Your Phone"} 📱`,
          html: getOrderConfirmationEmail(data),
        }),
      });
      const r1 = await res1.json();
      console.log("Customer email result:", r1);
    }

    // 2. Admin notification
    const res2 = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `PhonesAI Orders <${FROM_EMAIL}>`,
        to: [ADMIN_EMAIL],
        subject: `🛒 New Order — ${data.customerName} — Rs. ${data.totalPrice?.toLocaleString()}`,
        html: getAdminNotificationEmail(data),
      }),
    });
    const r2 = await res2.json();
    console.log("Admin email result:", r2);

    // 3. Unboxing guide to customer
    if (data.customerEmail) {
      const res3 = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `Ustaad Ji at PhonesAI <${FROM_EMAIL}>`,
          to: [data.customerEmail],
          subject: `🎬 Aapka Phone Aa Raha Hai — Unboxing Guide!`,
          html: getUnboxingGuideEmail(data),
        }),
      });
      const r3 = await res3.json();
      console.log("Unboxing email result:", r3);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}