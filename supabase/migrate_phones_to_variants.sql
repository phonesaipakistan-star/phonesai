-- One-time migration: copy legacy phones rows into phone_variants
-- Safe to re-run — skips phones that already have variants
-- Run AFTER supabase/phone_variants.sql (table + RLS must exist)

INSERT INTO phone_variants (
  phone_id,
  storage,
  color,
  condition_grade,
  price,
  discount_price,
  quantity,
  images,
  battery_health,
  in_stock
)
SELECT
  p.id,
  p.storage,
  p.color,
  CASE
    WHEN p.condition = 'New' OR COALESCE(p.physical_condition, '') ILIKE '%10/10%'
      OR COALESCE(p.physical_condition, '') ILIKE '%excellent%' THEN 'Excellent'
    WHEN COALESCE(p.physical_condition, '') ILIKE '%fair%'
      OR COALESCE(p.physical_condition, '') ~ '[78]/10' THEN 'Fair'
    ELSE 'Good'
  END,
  p.price,
  p.discount_price,
  CASE WHEN p.in_stock THEN 1 ELSE 0 END,
  COALESCE(p.images, '{}'),
  p.battery_health,
  p.in_stock
FROM phones p
WHERE NOT EXISTS (
  SELECT 1 FROM phone_variants pv WHERE pv.phone_id = p.id
)
AND p.storage IS NOT NULL AND TRIM(p.storage) <> ''
AND p.color IS NOT NULL AND TRIM(p.color) <> ''
AND p.price IS NOT NULL;

-- Summary
SELECT
  (SELECT COUNT(*) FROM phones) AS total_phones,
  (SELECT COUNT(DISTINCT phone_id) FROM phone_variants) AS phones_with_variants,
  (SELECT COUNT(*) FROM phone_variants) AS total_variants;
