CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    logo TEXT,
    photo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add photo column if it doesn't exist (for existing databases)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS photo TEXT;

-- Make description column nullable (remove NOT NULL constraint)
ALTER TABLE companies ALTER COLUMN description DROP NOT NULL;

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL CHECK (stock >= 0),
    description TEXT,
    photos JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    specs JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_company ON products(company);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view companies" ON companies
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert companies" ON companies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update companies" ON companies
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete companies" ON companies
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view products" ON products
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert products" ON products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" ON products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products" ON products
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO companies (id, name, description) VALUES
    ('nokia', 'Nokia', 'Leading telecommunications and technology company'),
    ('samsung', 'Samsung', 'Global technology conglomerate'),
    ('apple', 'Apple', 'Premium consumer electronics and software'),
    ('premium', 'Premium', 'Luxury and premium products')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, company, price, stock, description, photos, tags, specs) VALUES
    ('p1', 'Nokia Smartphone Pro', 'nokia', 299.99, 45, 
     'Advanced smartphone with cutting-edge technology, featuring a powerful processor, exceptional camera system, and long-lasting battery life.',
     '[]',
     '["smartphone", "electronics", "mobile"]',
     '{"screen": "6.5 inch OLED", "storage": "128GB", "ram": "8GB", "camera": "48MP Triple Camera"}'),
    
    ('p2', 'Samsung Galaxy Ultra', 'samsung', 899.99, 32,
     'Premium flagship smartphone with professional-grade camera and display technology for the ultimate mobile experience.',
     '[]',
     '["smartphone", "flagship", "premium"]',
     '{"screen": "6.8 inch Dynamic AMOLED", "storage": "256GB", "ram": "12GB", "camera": "108MP Quad Camera"}'),
    
    ('p3', 'Apple iPhone Pro', 'apple', 1199.99, 28,
     'The most advanced iPhone ever, featuring the powerful A17 Pro chip, titanium design, and revolutionary camera system.',
     '[]',
     '["iphone", "premium", "apple"]',
     '{"screen": "6.7 inch Super Retina XDR", "storage": "256GB", "ram": "8GB", "camera": "48MP Pro Camera System"}'),
    
    ('p4', 'Nokia Tablet Elite', 'nokia', 449.99, 18,
     'Professional tablet designed for productivity and creativity, with a stunning display and powerful performance.',
     '[]',
     '["tablet", "productivity", "electronics"]',
     '{"screen": "11 inch LCD", "storage": "128GB", "ram": "6GB", "battery": "8000mAh"}'),
    
    ('p5', 'Samsung Smart TV 4K', 'samsung', 799.99, 15,
     'Ultra-high definition smart TV with vibrant colors, smart features, and immersive sound for the ultimate viewing experience.',
     '[]',
     '["tv", "smart", "4k"]',
     '{"screen": "55 inch 4K UHD", "resolution": "3840x2160", "features": "Smart TV, HDR", "connectivity": "WiFi, Bluetooth"}'),
    
    ('p6', 'Apple MacBook Pro', 'apple', 1999.99, 12,
     'Supercharged by the M3 Pro chip, this MacBook Pro delivers exceptional performance for professionals and creators.',
     '[]',
     '["laptop", "professional", "apple"]',
     '{"screen": "14 inch Liquid Retina XDR", "processor": "M3 Pro chip", "ram": "16GB", "storage": "512GB SSD"}')
ON CONFLICT (id) DO NOTHING;
