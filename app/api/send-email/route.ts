import { NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "orders@phonesai.pk";
const ADMIN_EMAIL = "phonesaipakistan@gmail.com";

type OrderEmailData = {
  type: "order_confirmation" | "unboxing_guide" | "admin_notification";
  customerName: string;
  customerEmail: string;
  customerWhatsApp: string;
  customerCity: string;
  items: {
    model: string;
    storage: string;
    color: string;
    category: string;
    condition: string;
    price: number;
  }[];
  totalPrice: number;
  paymentMethod: string;
  couponApplied?: boolean;
};

const getOrderConfirmationEmail = (data: OrderEmailData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Order Confirmed — PhonesAI</title>
</head>
<body style="margin:0;padding:0;background:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0;">
        Phones<span style="color:#3B82F6;">AI</span>
      </h1>
      <p style="color:#6B7280;font-size:14px;margin:8px 0 0;">Premium Shopping, Reinvented.</p>
    </div>

    <!-- Success Banner -->
    <div style="background:#052e16;border:1px solid #166534;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="font-size:40px;margin:0 0 8px;">✅</p>
      <h2 style="color:#4ade80;font-size:22px;font-weight:800;margin:0 0 8px;">Order Received!</h2>
      <p style="color:#86efac;font-size:14px;margin:0;">Shukriya ${data.customerName} Janab! Aapka order mil gaya.</p>
    </div>

    <!-- Order Details -->
    <div style="background:#111111;border:1px solid #1f2937;border-radius:16px;padding:24px;margin-bottom:24px;">
      <h3 style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px;">Order Summary</h3>
      ${data.items.map(item => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #1f2937;">
        <div>
          <p style="color:#ffffff;font-size:14px;font-weight:700;margin:0;">${item.model}</p>
          <p style="color:#6b7280;font-size:12px;margin:4px 0 0;">${item.storage} • ${item.color} • ${item.category} • ${item.condition}</p>
        </div>
        <p style="color:#ffffff;font-size:14px;font-weight:700;margin:0;">Rs. ${item.price.toLocaleString()}</p>
      </div>
      `).join("")}
      <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 0 0;">
        <p style="color:#ffffff;font-size:16px;font-weight:800;margin:0;">Total</p>
        <p style="color:#ffffff;font-size:18px;font-weight:800;margin:0;">Rs. ${data.totalPrice.toLocaleString()}</p>
      </div>
      ${data.couponApplied ? `<p style="color:#4ade80;font-size:12px;margin:8px 0 0;">✓ SPECIAL5 discount applied</p>` : ""}
    </div>

    <!-- Payment Info -->
    <div style="background:#111111;border:1px solid #1f2937;border-radius:16px;padding:24px;margin-bottom:24px;">
      <h3 style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px;">Payment & Delivery</h3>
      <p style="color:#d1d5db;font-size:14px;margin:0 0 8px;">💳 Payment Method: <span style="color:#ffffff;font-weight:600;">${data.paymentMethod}</span></p>
      <p style="color:#d1d5db;font-size:14px;margin:0 0 8px;">📍 Delivery to: <span style="color:#ffffff;font-weight:600;">${data.customerCity}</span></p>
      <p style="color:#d1d5db;font-size:14px;margin:0;">🚚 Delivery Time: <span style="color:#ffffff;font-weight:600;">1-3 working days</span></p>
    </div>

    <!-- Payment Screenshot Reminder -->
    <div style="background:#1c1917;border:1px solid #92400e;border-radius:16px;padding:24px;margin-bottom:24px;">
      <p style="color:#fcd34d;font-size:14px;font-weight:700;margin:0 0 8px;">⚠️ Payment Screenshot Bhejein</p>
      <p style="color:#fbbf24;font-size:13px;margin:0 0 16px;">Payment complete karne ke baad screenshot WhatsApp par bhejein — order tab confirm hoga.</p>
      <a href="https://wa.me/923041502560?text=Assalam o Alaikum! Maine order place kiya hai. Payment screenshot bhej raha/rahi hoon."
        style="display:inline-block;background:#16a34a;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:12px;">
        📱 Send Screenshot on WhatsApp
      </a>
    </div>

    <!-- Ustaad Ji Note -->
    <div style="background:#111111;border:1px solid #1f2937;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center;">
      <p style="font-size:28px;margin:0 0 8px;">🧔</p>
      <p style="color:#fcd34d;font-size:14px;font-weight:700;margin:0 0 8px;">Ustaad Ji ka Wada</p>
      <p style="color:#9ca3af;font-size:13px;margin:0;">7-din warranty ke saath aapka phone verified hai. Koi bhi masla ho toh directly WhatsApp karein.</p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:24px;border-top:1px solid #1f2937;">
      <p style="color:#6b7280;font-size:12px;margin:0 0 4px;">PhonesAI • Wah Cantt, Punjab, Pakistan</p>
      <p style="color:#6b7280;font-size:12px;margin:0;">
        <a href="https://phonesai.pk" style="color:#3b82f6;text-decoration:none;">phonesai.pk</a> •
        <a href="https://wa.me/923041502560" style="color:#3b82f6;text-decoration:none;margin-left:8px;">WhatsApp</a>
      </p>
    </div>

  </div>
</body>
</html>
`;

const getUnboxingGuideEmail = (data: OrderEmailData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Unboxing Guide — PhonesAI</title>
</head>
<body style="margin:0;padding:0;background:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0;">
        Phones<span style="color:#3B82F6;">AI</span>
      </h1>
    </div>

    <div style="background:#0c0a2e;border:1px solid #4338ca;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="font-size:40px;margin:0 0 8px;">🎬</p>
      <h2 style="color:#a5b4fc;font-size:22px;font-weight:800;margin:0 0 8px;">Aapka Phone Aa Raha Hai!</h2>
      <p style="color:#c7d2fe;font-size:14px;margin:0;">${data.customerName} Janab, tayaar ho jao — unboxing ka waqt aa gaya!</p>
    </div>

    <div style="background:#111111;border:1px solid #1f2937;border-radius:16px;padding:24px;margin-bottom:24px;">
      <h3 style="color:#ffffff;font-size:16px;font-weight:700;margin:0 0 16px;">📱 Perfect Unboxing Video Kaise Banayein</h3>
      <div style="space-y:12px;">
        ${[
          { num: "1", text: "Achhi lighting mein record karein — natural light ya lamp ke saamne" },
          { num: "2", text: "Pehle sealed box dikhao — tamper evident seal intact hona chahiye" },
          { num: "3", text: "Slowly open karein — rush mat karein" },
          { num: "4", text: "Face ID ya fingerprint test karein on camera" },
          { num: "5", text: "Camera test karein — front aur back dono" },
          { num: "6", text: "Charging test karein — cable lagao aur charging icon show ho" },
          { num: "7", text: "Speaker test karein — music chala ke dikhao" },
          { num: "8", text: "Battery health check karein — Settings > Battery" },
        ].map(step => `
        <div style="display:flex;gap:12px;margin-bottom:12px;">
          <div style="flex-shrink:0;width:28px;height:28px;background:#1d4ed8;border-radius:50%;display:flex;align-items:center;justify-content:center;">
            <span style="color:#ffffff;font-size:12px;font-weight:700;">${step.num}</span>
          </div>
          <p style="color:#d1d5db;font-size:14px;margin:4px 0 0;">${step.text}</p>
        </div>
        `).join("")}
      </div>
    </div>

    <div style="background:#0f172a;border:1px solid #1e3a5f;border-radius:16px;padding:24px;margin-bottom:24px;">
      <h3 style="color:#93c5fd;font-size:15px;font-weight:700;margin:0 0 12px;">🎁 Yeh Video Kyun Zaroori Hai?</h3>
      <ul style="color:#94a3b8;font-size:13px;padding-left:20px;margin:0;line-height:1.8;">
        <li>Aapki <strong style="color:#ffffff;">7-din warranty ka official proof</strong> hai</li>
        <li>Apne doston ko dikhao — <strong style="color:#ffffff;">flex kar lo!</strong></li>
        <li>Hamare saath share karo — tag us on Instagram</li>
        <li>Koi issue nikle toh proof ke saath claim asaan hoga</li>
      </ul>
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      <a href="https://wa.me/923041502560?text=Unboxing video bhej raha/rahi hoon!"
        style="display:inline-block;background:#16a34a;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:12px;margin-bottom:12px;">
        📤 Send Us Your Unboxing Video
      </a>
    </div>

    <div style="text-align:center;padding-top:24px;border-top:1px solid #1f2937;">
      <p style="color:#6b7280;font-size:12px;margin:0 0 4px;">PhonesAI • Wah Cantt, Punjab, Pakistan</p>
      <p style="color:#6b7280;font-size:12px;margin:0;">
        <a href="https://phonesai.pk" style="color:#3b82f6;text-decoration:none;">phonesai.pk</a>
      </p>
    </div>

  </div>
</body>
</html>
`;

const getAdminNotificationEmail = (data: OrderEmailData) => `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;background:#f3f4f6;padding:20px;">
  <div style="max-width:500px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;">
    <h2 style="color:#111827;margin:0 0 16px;">🛒 New Order — PhonesAI</h2>
    <p><strong>Customer:</strong> ${data.customerName}</p>
    <p><strong>WhatsApp:</strong> <a href="https://wa.me/${data.customerWhatsApp}">${data.customerWhatsApp}</a></p>
    <p><strong>Email:</strong> ${data.customerEmail}</p>
    <p><strong>City:</strong> ${data.customerCity}</p>
    <p><strong>Payment:</strong> ${data.paymentMethod}</p>
    <p><strong>Total:</strong> Rs. ${data.totalPrice.toLocaleString()}</p>
    ${data.couponApplied ? `<p><strong>Coupon:</strong> SPECIAL5 applied</p>` : ""}
    <hr>
    <h3>Items:</h3>
    ${data.items.map(item => `
      <div style="background:#f9fafb;padding:12px;border-radius:8px;margin-bottom:8px;">
        <p style="margin:0;font-weight:bold;">${item.model} — ${item.storage} — ${item.color}</p>
        <p style="margin:4px 0 0;color:#6b7280;">${item.category} • ${item.condition} • Rs. ${item.price.toLocaleString()}</p>
      </div>
    `).join("")}
  </div>
</body>
</html>
`;

export async function POST(req: Request) {
  try {
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
    }

    const data: OrderEmailData = await req.json();

    const emailPromises = [];

    // 1. Order confirmation to customer
    if (data.customerEmail) {
      emailPromises.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: `PhonesAI <${FROM_EMAIL}>`,
            to: [data.customerEmail],
            subject: `Order Confirmed — ${data.items[0]?.model ?? "Your Phone"} 📱`,
            html: getOrderConfirmationEmail(data),
          }),
        })
      );
    }

    // 2. Admin notification
    emailPromises.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `PhonesAI Orders <${FROM_EMAIL}>`,
          to: [ADMIN_EMAIL],
          subject: `🛒 New Order — ${data.customerName} — Rs. ${data.totalPrice.toLocaleString()}`,
          html: getAdminNotificationEmail(data),
        }),
      })
    );

    await Promise.all(emailPromises);

    // 3. Unboxing guide email — send after 1 hour delay (we just send it immediately for now)
    if (data.customerEmail) {
      await fetch("https://api.resend.com/emails", {
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
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }),
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}