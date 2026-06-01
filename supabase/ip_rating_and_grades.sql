-- Run in Supabase SQL Editor

ALTER TABLE phones ADD COLUMN IF NOT EXISTS ip_rating text;

ALTER TABLE phone_variants DROP CONSTRAINT IF EXISTS phone_variants_condition_grade_check;
ALTER TABLE phone_variants ADD CONSTRAINT phone_variants_condition_grade_check
CHECK (condition_grade IN ('Premium', 'Excellent', 'Good', 'Fair', 'New'));
