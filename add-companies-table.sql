-- Add companies table to Supabase database
-- Run this in your Supabase SQL Editor

-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo TEXT, -- Base64 encoded image or URL
    website VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_name ON public.companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON public.companies(created_at);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Companies policies (allow public read, authenticated users can insert/update/delete)
CREATE POLICY "Allow public read access on companies" ON public.companies
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert companies" ON public.companies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update companies" ON public.companies
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete companies" ON public.companies
    FOR DELETE USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON public.companies 
    FOR EACH ROW EXECUTE FUNCTION update_companies_updated_at();

-- Insert sample companies (optional)
INSERT INTO public.companies (id, name, description, website) VALUES
    ('c1', 'TechCorp', 'Leading technology company specializing in consumer electronics', 'https://techcorp.com'),
    ('c2', 'InnovateLab', 'Innovation-focused company creating cutting-edge products', 'https://innovatelab.com'),
    ('c3', 'FutureTech', 'Future-oriented technology solutions provider', 'https://futuretech.com'),
    ('c4', 'SmartDevices', 'Smart device manufacturer and software developer', 'https://smartdevices.com')
ON CONFLICT (id) DO NOTHING;

-- Verify the table was created
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'companies' 
AND table_schema = 'public'
ORDER BY ordinal_position;
