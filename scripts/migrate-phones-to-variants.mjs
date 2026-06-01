/**
 * One-time migration: phones → phone_variants
 *
 * Usage:
 *   node scripts/migrate-phones-to-variants.mjs           # run migration
 *   node scripts/migrate-phones-to-variants.mjs --dry-run   # preview only
 *
 * Skips phones that already have variants. Safe to re-run.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://xadxdkbdwyulprfukrjb.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  "sb_publishable_xdfjlB6s9sGF3imO0S-l-A_WW1CjdVh";

const dryRun = process.argv.includes("--dry-run");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function inferConditionGrade(phone) {
  const pc = (phone.physical_condition ?? "").toLowerCase();
  if (phone.condition === "New" || pc.includes("10/10") || pc.includes("excellent")) {
    return "Excellent";
  }
  if (pc.includes("fair") || /[78]\/10/.test(pc)) {
    return "Fair";
  }
  return "Good";
}

function buildVariant(phone) {
  const inStock = Boolean(phone.in_stock);
  return {
    phone_id: phone.id,
    storage: phone.storage,
    color: phone.color,
    condition_grade: inferConditionGrade(phone),
    price: phone.price,
    discount_price: phone.discount_price ?? null,
    quantity: inStock ? 1 : 0,
    images: phone.images?.length ? phone.images : [],
    battery_health: phone.battery_health ?? null,
    in_stock: inStock,
  };
}

async function main() {
  console.log(dryRun ? "🔍 DRY RUN — no writes\n" : "🚀 Migrating phones → phone_variants\n");

  const { data: phones, error: phonesError } = await supabase
    .from("phones")
    .select(
      "id, model, storage, color, condition, price, discount_price, battery_health, physical_condition, in_stock, images"
    )
    .order("created_at", { ascending: true });

  if (phonesError) {
    console.error("Failed to fetch phones:", phonesError.message);
    process.exit(1);
  }

  const { data: existingVariants, error: variantsError } = await supabase
    .from("phone_variants")
    .select("phone_id");

  if (variantsError) {
    if (variantsError.message.includes("phone_variants")) {
      console.error(
        "phone_variants table not found. Run supabase/phone_variants.sql in Supabase first."
      );
      process.exit(1);
    }
    console.error("Failed to fetch variants:", variantsError.message);
    process.exit(1);
  }

  const phonesWithVariants = new Set((existingVariants ?? []).map((v) => v.phone_id));

  const toMigrate = (phones ?? []).filter((p) => {
    if (phonesWithVariants.has(p.id)) return false;
    if (!p.storage?.trim() || !p.color?.trim() || p.price == null) {
      console.warn(`⚠️  Skip ${p.model} (${p.id}) — missing storage, color, or price`);
      return false;
    }
    return true;
  });

  console.log(`Phones in DB:        ${phones?.length ?? 0}`);
  console.log(`Already have variants: ${phonesWithVariants.size}`);
  console.log(`To migrate:            ${toMigrate.length}\n`);

  if (toMigrate.length === 0) {
    console.log("Nothing to migrate.");
    return;
  }

  let ok = 0;
  let fail = 0;

  for (const phone of toMigrate) {
    const variant = buildVariant(phone);
    const label = `${phone.model} | ${variant.storage} | ${variant.color} | ${variant.condition_grade} | Rs.${variant.price}`;

    if (dryRun) {
      console.log(`  [dry-run] ${label}`);
      ok++;
      continue;
    }

    const { error } = await supabase.from("phone_variants").insert(variant);

    if (error) {
      console.error(`  ❌ ${label}\n     ${error.message}`);
      fail++;
    } else {
      console.log(`  ✅ ${label}`);
      ok++;
    }
  }

  console.log(`\nDone. ${ok} migrated${fail ? `, ${fail} failed` : ""}.`);

  if (fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
