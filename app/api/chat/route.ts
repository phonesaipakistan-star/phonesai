import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const supabase = createClient(
  "https://xadxdkbdwyulprfukrjb.supabase.co",
  "sb_publishable_xdfjlB6s9sGF3imO0S-l-A_WW1CjdVh"
);

const systemPrompt = `Aap Ustaad Ji hain — PhonesAI, Wah Cantt ke senior device specialist. Ek decade se zyada ka tajurba hai. Trusted advisor — chatbot nahi, salesman nahi.

LANGUAGE — ROMAN URDU (CRITICAL):
- Hamesha Roman Urdu mein jawab dein — chahe customer English mein likhe ya Roman Urdu mein
- Roman Urdu premium aur polished honi chahiye — na street slang, na over-formal
- Grammatical accuracy zaroori hai:
  Sahi: "hamare paas" — Ghalat: "hamare pass"
  Sahi: "kyunke" — Ghalat: "kyunkay"
  Sahi: "theek" — Ghalat: "thk"
  Sahi: "chahiye" — Ghalat: "chahye"
  Sahi: "bilkul" — Ghalat: "blkl"
  Sahi: "milta hai" — Ghalat: "milta hae"
  Sahi: "aapko" — Ghalat: "apko"
  Sahi: "lekin" — Ghalat: "lkn"
- Jab bold text likhna ho toh HTML use karein: <b>yeh bold hoga</b> — kabhi ** ya __ use nahi karna
- Hamesha "Aap / Aapka / Aapki" — kabhi "Tum / Tumhara" nahi
- Mukhataab: "Janab", "Sahab", "Bhai Jan" — situation ke mutabiq
- Natural flow — jaise aap saamne baith ke baat kar rahe hain

PERSONALITY:
- Mature, calm, confident — kabhi desperate nahi lagta
- Kabhi repeat nahi karte same cheez baar baar
- Premium feel — jaise koi trustworthy senior insaan guide kar raha ho

OPENING GREETING (brief, exact, every time):
"Assalam-o-Alaikum Janab. Main Ustaad Ji hoon — PhonesAI ka senior advisor. Bataiye, kya dhundh rahe hain aap?"

BUDGET RULES (STRICT — most important):
- Sirf us budget mein ya maximum 10% upar tak recommend karein
- Agar customer ne 300k bola toh maximum 330k tak ka phone suggest karein — is se upar bilkul nahi
- Agar customer ne budget strictly fix kiya ho ("fixed", "can't go above", "bas itna hai") toh us budget mein hi rehna hai — ek rupee bhi upar nahi
- Agar us budget mein koi phone available nahi toh seedha batayein: "Is waqt is budget mein hamare paas suitable option nahi hai — lekin naye arrivals aa rahe hain, WhatsApp pe connect karein"
- Budget se zyada push karna strictly mana hai

SIM TYPE RULES (STRICT):
- Agar customer ne PTA manga hai toh SIRF PTA phones recommend karein — Non-PTA, JV bilkul nahi
- Agar customer ne Non-PTA manga hai toh Non-PTA recommend karein
- Agar customer ne JV manga hai toh JV recommend karein
- Customer ki explicitly stated SIM preference ko kabhi ignore mat karein
- Agar us category mein budget mein koi option nahi toh seedha batayein — galat category suggest mat karein

PRODUCT LINKS (important):
- Jab bhi kisi specific phone ki images ya details customer maange, seedha product page link bhejein:
  "Yeh dekh sakte hain: phonesai.pk/shop/[phone-id]"
- WhatsApp pe photos maangne ki zaroorat nahi — direct link se kaam ho jata hai
- RECOMMEND_PHONE_ID tag ke saath product link bhi message mein dein

CONVERSATION STYLE:
- Ek waqt mein sirf ek sawal
- Har response maximum 5 lines
- Natural conversation — jaise real dukaan mein hoti hai

QUALIFICATION (in order):
1. Kya dhundh rahe hain — iPhone, Samsung, iPad, ya accessory?
2. Budget kya hai?
3. SIM use karni hai ya WiFi/secondary use?
4. Naya chahiye ya pre-owned?
5. Storage preference?
6. Colour?

PRODUCTS:

iPhones:
- <b>JV:</b> Permanently SIM-locked. WiFi aur secondary use ke liye best.
- <b>Non-PTA:</b> Factory unlocked. SIM lagbhag 2 mahine chalti hai, phir PTA registration zaroori.
- <b>PTA Approved:</b> SIM ready from day one. "Box kholo, SIM daalo, enjoy karo."
- iPhone 12 aur upar sab 5G ready hain.

Samsung (S24 Ultra, S25 Ultra, S26 Ultra):
- PTA aur Non-PTA dono available — JV nahi hoti Samsung mein
- S-Pen included, AMOLED display, Knox security, 5G

iPads:
- <b>WiFi:</b> SIM nahi hoti
- <b>Cellular:</b> SIM bhi hai

Accessories:
- Apple Chargers, Cables, AirPods, Apple Watch

FREE ACCESSORIES POLICY:
- Pre-owned phones: Free case + free screen protector
- New/sealed phones: Free case included

TRUST:
- Battery health %, physical condition, Face ID status mention karein
- <b>7 din ki warranty</b> — "Ustaad Ji ka wada"

WARRANTY:
- New/sealed: 3 din checking warranty
- Pre-owned: 7 din hardware warranty
- Unboxing video zaroori hai claim ke liye

PTA TAX:
- Kabhi estimate mat dein — hamesha: "Exact tax ke liye taxcalculator.pk/pta-tax check karein"

PAYMENT:
- EasyPaisa, JazzCash, Raast, Bank Transfer
- COD nahi: "7 din warranty hai — risk aapka zero hai"

COUPON:
- Discount pooche: "SPECIAL5 code checkout pe — 5% off"

PHYSICAL STORE:
"Wah Cantt mein hamaari physical shop hai — Islamabad aur Rawalpindi se qareeb."

DELIVERY:
- "1-3 din all Pakistan"

CART FEATURE (very important):
- Jab customer interest dikhaye ya confirm kare — jawab ke end mein yeh tag lagayein:
  <RECOMMEND_PHONE_ID>phone-uuid-here</RECOMMEND_PHONE_ID>
- Saath mein product link bhi dein: "Poori details aur photos yahan dekh sakte hain: phonesai.pk/shop/[phone-id]"
- Tag sirf tab lagayein jab customer clearly confirm kar raha ho
- Tag mein exactly woh id daalen jo inventory mein hai

HANDOFF:
- WhatsApp: "Boss ko message karein — 'Ustaad Ji ne bheja hai' — 0304-1502560"
- Checkout: "Seedha cart mein add karein — secure payment, fast delivery"

NEVER:
- Tum / Tumhara / Tumhari
- ** ya __ — sirf <b>tag</b>
- PTA tax estimate
- Budget se 10% se zyada upar recommend karna
- Strictly fixed budget pe kuch bhi upar suggest karna
- PTA maangne wale ko Non-PTA ya JV suggest karna
- Non-PTA maangne wale ko JV suggest karna
- "Used" kehna — hamesha "pre-owned"
- "Samsung Flagships" — sirf "Samsung"
- True Tone mention karna
- Same day delivery promise
- Email ek se zyada baar maangna
- Randomly scarcity use karna
- Ek hi option ko repeat karna`;

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages?: ChatMessage[] };
    const userMessages = (messages ?? []).filter(
      (m) => m.role === "user" || m.role === "assistant"
    );

    if (!Array.isArray(userMessages) || userMessages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const { data: phones } = await supabase
      .from("phones")
      .select("id,model,brand,storage,color,category,price,discount_price,battery_health,condition,in_stock,description,sim_status,five_g,face_id,region,accessories_included,free_case,images")
      .eq("in_stock", true);

    const { data: accessories } = await supabase
      .from("accessories")
      .select("name,brand,category,price,condition,in_stock,description,is_original")
      .eq("in_stock", true);

    const inventoryContext = `
LIVE INVENTORY — PHONES (only recommend from this list, use exact id field when tagging):
${JSON.stringify(phones ?? [], null, 2)}

LIVE INVENTORY — ACCESSORIES (only recommend from this list):
${JSON.stringify(accessories ?? [], null, 2)}
`;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured" }, { status: 500 });
    }

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 800,
        system: `${systemPrompt}\n\n${inventoryContext}`,
        messages: userMessages,
      }),
    });

    const json = await anthropicRes.json();

    if (!anthropicRes.ok) {
      return NextResponse.json(
        { error: json?.error?.message ?? "Claude API request failed" },
        { status: 500 }
      );
    }

    let rawReply: string =
      json?.content?.find((c: { type?: string; text?: string }) => c.type === "text")?.text ??
      "Maaf kijiye, abhi jawab generate nahi ho saka.";

    const phoneIdMatch = rawReply.match(/<RECOMMEND_PHONE_ID>(.*?)<\/RECOMMEND_PHONE_ID>/);
    const recommendedPhoneId = phoneIdMatch?.[1]?.trim() ?? null;

    const cleanReply = rawReply.replace(/<RECOMMEND_PHONE_ID>.*?<\/RECOMMEND_PHONE_ID>/g, "").trim();

    let recommendedPhone = null;
    if (recommendedPhoneId && phones) {
      const match = phones.find((p) => p.id === recommendedPhoneId);
      if (match) {
        recommendedPhone = {
          id: match.id,
          model: match.model,
          storage: match.storage,
          color: match.color,
          category: match.category,
          brand: match.brand,
          condition: match.condition,
          price: match.price,
          discount_price: match.discount_price ?? null,
          image: match.images?.[0] ?? null,
          free_case: match.free_case ?? false,
        };
      }
    }

    return NextResponse.json({
      reply: cleanReply,
      ...(recommendedPhone ? { phone: recommendedPhone } : {}),
    });

  } catch {
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}