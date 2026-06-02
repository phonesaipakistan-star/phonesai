-- Run in Supabase SQL Editor

ALTER TABLE phone_variants ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE phone_variants ADD COLUMN IF NOT EXISTS accessories_included text;
ALTER TABLE phone_variants ADD COLUMN IF NOT EXISTS sim_type text;
ALTER TABLE phone_variants ADD COLUMN IF NOT EXISTS sim_status text;
