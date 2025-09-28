-- Add photos column to existing products table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS photos TEXT[];

-- Add a comment to the column
COMMENT ON COLUMN public.products.photos IS 'Array of base64 encoded images or URLs';

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public'
ORDER BY ordinal_position;
