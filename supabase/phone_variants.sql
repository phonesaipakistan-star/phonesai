-- Run this in Supabase SQL Editor before deploying variants feature

CREATE TABLE IF NOT EXISTS phone_variants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_id uuid REFERENCES phones(id) ON DELETE CASCADE,
  storage text NOT NULL,
  color text NOT NULL,
  condition_grade text NOT NULL CHECK (condition_grade IN ('Excellent', 'Good', 'Fair')),
  price integer NOT NULL,
  discount_price integer,
  quantity integer DEFAULT 1,
  images text[] DEFAULT '{}',
  battery_health integer,
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phone_variants ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read variants' AND tablename = 'phone_variants') THEN
    CREATE POLICY "Public read variants" ON phone_variants FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin insert variants' AND tablename = 'phone_variants') THEN
    CREATE POLICY "Admin insert variants" ON phone_variants FOR INSERT TO public WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin update variants' AND tablename = 'phone_variants') THEN
    CREATE POLICY "Admin update variants" ON phone_variants FOR UPDATE TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin delete variants' AND tablename = 'phone_variants') THEN
    CREATE POLICY "Admin delete variants" ON phone_variants FOR DELETE TO public USING (true);
  END IF;
END $$;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS variant_id uuid REFERENCES phone_variants(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS selected_storage text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS selected_color text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS selected_condition text;
