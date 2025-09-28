-- Enable Row Level Security
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    company VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    photos TEXT[], -- Array of base64 encoded images or URLs
    tags TEXT[],
    specs JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_company ON public.products(company);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);

-- Row Level Security Policies

-- Products policies (allow public read, authenticated users can insert/update/delete)
CREATE POLICY "Allow public read access on products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert products" ON public.products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update products" ON public.products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete products" ON public.products
    FOR DELETE USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON public.products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO public.products (name, description, company, price, stock, tags) VALUES
    ('Laptop Pro', 'High-performance laptop for professionals', 'c1', 1299.99, 50, ARRAY['electronics', 'computers']),
    ('Wireless Headphones', 'Premium noise-cancelling headphones', 'c2', 299.99, 100, ARRAY['electronics', 'audio']),
    ('Smart Watch', 'Fitness tracking smartwatch', 'c3', 399.99, 75, ARRAY['electronics', 'wearables']),
    ('Gaming Mouse', 'High-precision gaming mouse', 'c4', 79.99, 200, ARRAY['electronics', 'gaming'])
ON CONFLICT DO NOTHING;
