-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    website TEXT,
    logo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default companies
INSERT INTO companies (id, name, description, website, created_at) VALUES 
('nokia', 'Nokia', 'Leading technology company', 'https://nokia.com', NOW()),
('samsung', 'Samsung', 'Innovation-focused company', 'https://samsung.com', NOW()),
('apple', 'Apple', 'Premium technology brand', 'https://apple.com', NOW()),
('premium', 'Premium Brand', 'Luxury products', '', NOW())
ON CONFLICT (id) DO NOTHING;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on companies" ON companies
    FOR SELECT USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert companies" ON companies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update companies" ON companies
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete companies" ON companies
    FOR DELETE USING (auth.role() = 'authenticated');
