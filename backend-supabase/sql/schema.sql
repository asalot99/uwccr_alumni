-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create alumni table
CREATE TABLE IF NOT EXISTS alumni (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  graduation_year INTEGER NOT NULL CHECK (graduation_year >= 1950 AND graduation_year <= EXTRACT(YEAR FROM NOW()) + 5),
  program VARCHAR(100) NOT NULL CHECK (program IN ('Computer Science', 'Engineering', 'Business', 'Arts', 'Science', 'Other')),
  
  -- Location information
  location_name VARCHAR(255) NOT NULL,
  location_country VARCHAR(255) NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL CHECK (location_lat >= -90 AND location_lat <= 90),
  location_lon DECIMAL(11, 8) NOT NULL CHECK (location_lon >= -180 AND location_lon <= 180),
  
  -- Profile information
  bio TEXT DEFAULT '',
  current_company VARCHAR(100) DEFAULT '',
  job_title VARCHAR(100) DEFAULT '',
  
  -- Privacy settings
  is_public BOOLEAN DEFAULT false,
  show_location BOOLEAN DEFAULT true,
  show_email BOOLEAN DEFAULT false,
  
  -- System fields
  is_verified BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_alumni_email ON alumni(email);
CREATE INDEX IF NOT EXISTS idx_alumni_location ON alumni(location_lat, location_lon);
CREATE INDEX IF NOT EXISTS idx_alumni_graduation_year ON alumni(graduation_year);
CREATE INDEX IF NOT EXISTS idx_alumni_program ON alumni(program);
CREATE INDEX IF NOT EXISTS idx_alumni_verified ON alumni(is_verified);
CREATE INDEX IF NOT EXISTS idx_alumni_last_active ON alumni(last_active);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_alumni_updated_at 
  BEFORE UPDATE ON alumni 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile" ON alumni
  FOR SELECT USING (auth.uid()::text = id::text);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile" ON alumni
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Policy 3: Public can view verified alumni with location (for map)
CREATE POLICY "Public can view verified alumni for map" ON alumni
  FOR SELECT USING (
    is_verified = true 
    AND show_location = true 
    AND location_lat IS NOT NULL 
    AND location_lon IS NOT NULL
  );

-- Policy 4: Public can view verified alumni profiles (limited data)
CREATE POLICY "Public can view verified alumni profiles" ON alumni
  FOR SELECT USING (
    is_verified = true 
    AND is_public = true
  );

-- Policy 5: Allow registration (insert)
CREATE POLICY "Allow alumni registration" ON alumni
  FOR INSERT WITH CHECK (true);

-- Create view for public map data
CREATE OR REPLACE VIEW public_alumni_map AS
SELECT 
  id,
  first_name,
  last_name,
  graduation_year,
  program,
  location_name,
  location_country,
  location_lat,
  location_lon,
  bio,
  current_company,
  job_title,
  last_active
FROM alumni
WHERE 
  is_verified = true 
  AND show_location = true 
  AND location_lat IS NOT NULL 
  AND location_lon IS NOT NULL;

-- Create view for search results (for verified users)
CREATE OR REPLACE VIEW searchable_alumni AS
SELECT 
  id,
  first_name,
  last_name,
  graduation_year,
  program,
  location_name,
  location_country,
  location_lat,
  location_lon,
  bio,
  current_company,
  job_title,
  last_active,
  is_public,
  show_location,
  show_email
FROM alumni
WHERE is_verified = true;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON alumni TO anon, authenticated;
GRANT ALL ON public_alumni_map TO anon, authenticated;
GRANT ALL ON searchable_alumni TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated; 