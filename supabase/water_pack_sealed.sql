-- Run in Supabase SQL Editor

ALTER TABLE phones ADD COLUMN IF NOT EXISTS water_pack_sealed boolean NOT NULL DEFAULT false;
