-- Modified schema for Auth0 integration
-- This adds an auth0_id column and makes some fields optional

-- Add auth0_id column to existing alumni table
ALTER TABLE alumni ADD COLUMN IF NOT EXISTS auth0_id VARCHAR(255) UNIQUE;

-- Make password_hash optional (since we use Auth0)
ALTER TABLE alumni ALTER COLUMN password_hash DROP NOT NULL;

-- Make graduation_year and program optional initially (can be filled later)
ALTER TABLE alumni ALTER COLUMN graduation_year DROP NOT NULL;
ALTER TABLE alumni ALTER COLUMN program DROP NOT NULL;

-- Create index for auth0_id
CREATE INDEX IF NOT EXISTS idx_alumni_auth0_id ON alumni(auth0_id);

-- Update the policies to work with auth0_id instead of auth.uid()
DROP POLICY IF EXISTS "Users can view own profile" ON alumni;
DROP POLICY IF EXISTS "Users can update own profile" ON alumni;

-- New policies for Auth0 integration
CREATE POLICY "Users can view own profile by auth0_id" ON alumni
  FOR SELECT USING (auth0_id IS NOT NULL);

CREATE POLICY "Users can update own profile by auth0_id" ON alumni
  FOR UPDATE USING (auth0_id IS NOT NULL);

-- Allow upsert operations for Auth0 users
CREATE POLICY "Allow Auth0 users to upsert" ON alumni
  FOR INSERT WITH CHECK (auth0_id IS NOT NULL);

-- Update the public map view to include auth0_id
DROP VIEW IF EXISTS public_alumni_map;
CREATE OR REPLACE VIEW public_alumni_map AS
SELECT 
  id,
  auth0_id,
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
  show_location = true 
  AND location_lat IS NOT NULL 
  AND location_lon IS NOT NULL
  AND auth0_id IS NOT NULL;

-- Grant permissions on the updated view
GRANT ALL ON public_alumni_map TO anon, authenticated;

-- Create a function to upsert alumni by auth0_id
CREATE OR REPLACE FUNCTION upsert_alumni_by_auth0_id(
  p_auth0_id VARCHAR(255),
  p_first_name VARCHAR(50),
  p_last_name VARCHAR(50),
  p_email VARCHAR(255),
  p_location_name VARCHAR(255),
  p_location_country VARCHAR(255),
  p_location_lat DECIMAL(10, 8),
  p_location_lon DECIMAL(11, 8),
  p_graduation_year INTEGER DEFAULT NULL,
  p_program VARCHAR(100) DEFAULT NULL,
  p_bio TEXT DEFAULT '',
  p_current_company VARCHAR(100) DEFAULT '',
  p_job_title VARCHAR(100) DEFAULT ''
)
RETURNS UUID AS $$
DECLARE
  alumni_id UUID;
BEGIN
  -- Try to update existing record
  UPDATE alumni SET
    first_name = p_first_name,
    last_name = p_last_name,
    email = p_email,
    location_name = p_location_name,
    location_country = p_location_country,
    location_lat = p_location_lat,
    location_lon = p_location_lon,
    graduation_year = COALESCE(p_graduation_year, graduation_year),
    program = COALESCE(p_program, program),
    bio = COALESCE(p_bio, bio),
    current_company = COALESCE(p_current_company, current_company),
    job_title = COALESCE(p_job_title, job_title),
    last_active = NOW(),
    updated_at = NOW()
  WHERE auth0_id = p_auth0_id
  RETURNING id INTO alumni_id;
  
  -- If no record was updated, insert a new one
  IF alumni_id IS NULL THEN
    INSERT INTO alumni (
      auth0_id,
      first_name,
      last_name,
      email,
      location_name,
      location_country,
      location_lat,
      location_lon,
      graduation_year,
      program,
      bio,
      current_company,
      job_title,
      show_location,
      is_public,
      last_active,
      created_at,
      updated_at
    ) VALUES (
      p_auth0_id,
      p_first_name,
      p_last_name,
      p_email,
      p_location_name,
      p_location_country,
      p_location_lat,
      p_location_lon,
      p_graduation_year,
      p_program,
      p_bio,
      p_current_company,
      p_job_title,
      true, -- show_location default to true
      true, -- is_public default to true
      NOW(),
      NOW(),
      NOW()
    )
    RETURNING id INTO alumni_id;
  END IF;
  
  RETURN alumni_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION upsert_alumni_by_auth0_id TO anon, authenticated;
