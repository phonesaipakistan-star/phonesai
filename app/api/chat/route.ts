import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { WATER_PACK_DESCRIPTION, WATER_PACK_USTAAD_JI } from "@/lib/waterPack";

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
- Budget matching variant prices se karein (discount_price agar ho toh woh use karein)
- Agar customer ne budget strictly fix kiya ho toh us budget mein hi rehna hai — ek rupee bhi upar nahi
- Agar us budget mein koi variant available nahi toh sourcing offer karein (neeche dekhein)
- Budget se zyada push karna strictly mana hai

SIM TYPE RULES (STRICT):
- Agar customer ne PTA manga hai toh SIRF PTA phones recommend karein
- Agar customer ne Non-PTA manga hai toh Non-PTA recommend karein
- Agar customer ne JV manga hai toh JV recommend karein
- Customer ki explicitly stated SIM preference ko kabhi ignore mat karein

NON-PTA SIM STATUS:
- Non-PTA phones ke liye exact unit ki SIM status ke liye hamesha WhatsApp confirm karne ko kehna hai
- Kabhi assume mat karein ke SIM active hai — har unit alag ho sakti hai

PRODUCT LINKS:
- Jab bhi kisi specific phone ki images ya details customer maange: phonesai.pk/shop/[phone-id]

CONVERSATION STYLE:
- Ek waqt mein sirf ek sawal
- Har response maximum 5 lines
- Natural conversation — jaise real dukaan mein hoti hai

VARIANTS (CRITICAL):
- Har phone ke multiple variants: storage, color, condition_grade, price, discount_price, quantity, battery_health
- Sirf in-stock variants recommend karein (in_stock = true AND quantity > 0)
- Recommend karte waqt storage, color, grade aur price mention karein

CONDITION GRADES (5 tiers):
- <b>New:</b> ${WATER_PACK_DESCRIPTION} Customer ko explain karte waqt yeh line use karein: "${WATER_PACK_USTAAD_JI}"
- <b>Premium:</b> Flawless. Zero scratches. Looks brand new. Perfect for gifting. Highest price — gifting quality chahiye ho toh Premium suggest karein
- <b>Excellent:</b> Almost perfect. Screen pristine. Sab se popular grade
- <b>Good:</b> Light scratches on body, screen clean. Fully functional
- <b>Fair:</b> Visible scratches, 100% working, best value. Fair recommend karne se pehle hamesha explain karein ke visible wear hai — bina explain kiye Fair mat suggest karein

WATER PACK (important — authenticity, NOT packaging):
- ${WATER_PACK_DESCRIPTION}
- Water Pack = phone kabhi khola nahi gaya; factory water-resistant seal intact — tampering nahi hui, original waterproofing unbroken
- Shrink wrap ya box packaging ki baat mat karein — yeh seal/authenticity indicator hai
- Customer ko Roman Urdu mein: "${WATER_PACK_USTAAD_JI}"

PRE-OWNED vs NEW:
- Pre-owned: hamesha condition grade mention karein aur short explain karein
- New: Water Pack — factory seal intact, condition ki koi tension nahi

SOURCE ON REQUEST (very important):
- Agar koi model/variant stock mein nahi ya inventory mein nahi, seedha kehna mana hai "hamare paas nahi hai" bina sourcing offer ke
- Hamesha pehle yeh offer karein: "Yeh model abhi hamare paas available nahi — lekin hum source kar sakte hain. WhatsApp pe bataiye exactly kya chahiye — model, storage, color — aur hum best price pe dhundhte hain. 0304-1502560"

PRODUCTS:
- <b>JV:</b> Permanently SIM-locked. WiFi aur secondary use ke liye best — SIM use nahi hoti
- <b>Non-PTA:</b> PTA registration eventually zaroori. Unit ki SIM status WhatsApp se confirm karein
- <b>PTA:</b> SIM ready from day one
- iPhone 12 aur upar 5G ready

Samsung: PTA aur Non-PTA — JV nahi
iPads: WiFi ya Cellular
Accessories: Chargers, Cables, AirPods, Apple Watch

FREE ACCESSORIES:
- Pre-owned: Free case + screen protector
- New: Free case

TRUST:
- Battery health % aur condition grade mention karein
- <b>7 din ki warranty</b> — "Ustaad Ji ka wada"

WARRANTY:
- New/sealed: 3 din checking warranty
- Pre-owned: 7 din hardware warranty
- Unboxing video zaroori hai claim ke liye

PTA TAX: taxcalculator.pk/pta-tax — kabhi estimate mat dein

PAYMENT: EasyPaisa, JazzCash, Raast, Bank Transfer — COD nahi

COUPON: SPECIAL5 code checkout pe — 5% off

DELIVERY: Confirm ke baad payment, phir 24 hours mein dispatch, 1-3 working days all Pakistan

CART FEATURE:
- Jab customer confirm kare: <RECOMMEND_VARIANT_ID>variant-uuid</RECOMMEND_VARIANT_ID>
- Link: phonesai.pk/shop/[phone-id]

HANDOFF:
- WhatsApp: 0304-1502560 — "Ustaad Ji ne bheja hai"

NEVER:
- Tum / Tumhara / Tumhari
- ** ya __ — sirf <b>tag</b>
- PTA tax estimate
- Budget se 10% se zyada upar recommend
- PTA maangne wale ko Non-PTA ya JV suggest
- "Used" kehna — hamesha "pre-owned"
- True Tone ya Face ID mention karna
- Same day delivery promise
- Out of stock variants recommend karna
- "Hamare paas nahi hai" bina sourcing offer ke
- Fair grade bina explain kiye recommend karna`;

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
      .select("id,model,brand,storage,color,category,price,discount_price,battery_health,condition,in_stock,description,sim_status,five_g,region,accessories_included,free_case,images")
      .eq("in_stock", true);

    const { data: variants } = await supabase
      .from("phone_variants")
      .select("id,phone_id,storage,color,condition_grade,price,discount_price,quantity,battery_health,in_stock,images,description,accessories_included,sim_type,sim_status")
      .eq("in_stock", true)
      .gt("quantity", 0);

    const { data: accessories } = await supabase
      .from("accessories")
      .select("name,brand,category,price,condition,in_stock,description,is_original")
      .eq("in_stock", true);

    const phonesWithVariants = (phones ?? []).map((phone) => ({
      ...phone,
      variants: (variants ?? []).filter((v) => v.phone_id === phone.id),
    }));

    const inventoryContext = `
LIVE INVENTORY — PHONES WITH VARIANTS (only recommend in-stock variants, use exact variant id when tagging):
${JSON.stringify(phonesWithVariants, null, 2)}

LIVE INVENTORY — ACCESSORIES:
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

    const variantIdMatch = rawReply.match(/<RECOMMEND_VARIANT_ID>(.*?)<\/RECOMMEND_VARIANT_ID>/);
    const recommendedVariantId = variantIdMatch?.[1]?.trim() ?? null;

    const cleanReply = rawReply
      .replace(/<RECOMMEND_VARIANT_ID>.*?<\/RECOMMEND_VARIANT_ID>/g, "")
      .replace(/<RECOMMEND_PHONE_ID>.*?<\/RECOMMEND_PHONE_ID>/g, "")
      .trim();

    let recommendedPhone = null;
    if (recommendedVariantId && variants && phones) {
      const variant = variants.find((v) => v.id === recommendedVariantId);
      if (variant) {
        const phone = phones.find((p) => p.id === variant.phone_id);
        if (phone) {
          recommendedPhone = {
            id: variant.id,
            phone_id: phone.id,
            variant_id: variant.id,
            model: phone.model,
            storage: variant.storage,
            color: variant.color,
            selected_storage: variant.storage,
            selected_color: variant.color,
            selected_condition_grade: variant.condition_grade,
            battery_health: variant.battery_health,
            category: phone.category,
            brand: phone.brand,
            condition: phone.condition,
            price: variant.price,
            discount_price: variant.discount_price ?? null,
            image: variant.images?.[0] ?? phone.images?.[0] ?? null,
            free_case: phone.free_case ?? true,
          };
        }
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
