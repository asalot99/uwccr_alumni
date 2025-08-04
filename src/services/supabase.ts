import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cgeqlpqvwognibtwjohb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnZXFscHF2d29nbmlidHdqb2hiIiwicm9sZSI6ImFub25fa2V5IiwiaWF0IjoxNzUzOTA0MDg2LCJleHAiOjIwNjk0ODAwODZ9.YQlWQUmu0aI7rJOLrGJmOJWqOBZQGhzJhOJqOBZQGhzJ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Alumni service functions
export const alumniService = {
  // Create or update alumni profile using email as identifier
  async upsertAlumni(alumniData) {
    try {
      // First, try to find existing user by email
      const { data: existingUser, error: selectError } = await supabase
        .from('alumni')
        .select('*')
        .eq('email', alumniData.email)
        .single()
      
      if (existingUser) {
        // Update existing user
        const { data, error } = await supabase
          .from('alumni')
          .update({
            first_name: alumniData.first_name,
            last_name: alumniData.last_name,
            location_name: alumniData.location_name,
            location_country: alumniData.location_country,
            location_lat: alumniData.location_lat,
            location_lon: alumniData.location_lon,
            graduation_year: alumniData.graduation_year || existingUser.graduation_year,
            program: alumniData.program || existingUser.program,
            bio: alumniData.bio || existingUser.bio,
            current_company: alumniData.current_company || existingUser.current_company,
            job_title: alumniData.job_title || existingUser.job_title,
            last_active: new Date().toISOString()
          })
          .eq('email', alumniData.email)
          .select()
        
        if (error) {
          console.error('Supabase update error:', error)
          throw error
        }
        
        return { success: true, data, isUpdate: true }
      } else {
        // Insert new user
        const { data, error } = await supabase
          .from('alumni')
          .insert({
            first_name: alumniData.first_name,
            last_name: alumniData.last_name,
            email: alumniData.email,
            password_hash: 'auth0-managed', // Placeholder since Auth0 handles auth
            location_name: alumniData.location_name,
            location_country: alumniData.location_country,
            location_lat: alumniData.location_lat,
            location_lon: alumniData.location_lon,
            graduation_year: alumniData.graduation_year || 2020, // Default value
            program: alumniData.program || 'Other', // Default value
            bio: alumniData.bio || '',
            current_company: alumniData.current_company || '',
            job_title: alumniData.job_title || '',
            show_location: true,
            is_public: true,
            last_active: new Date().toISOString()
          })
          .select()
        
        if (error) {
          console.error('Supabase insert error:', error)
          throw error
        }
        
        return { success: true, data, isUpdate: false }
      }
    } catch (error) {
      console.error('Error upserting alumni:', error)
      return { success: false, error: error.message }
    }
  },

  // Get all alumni for map
  async getAllAlumni() {
    try {
      const { data, error } = await supabase
        .from('alumni')
        .select(`
          id,
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
          last_active
        `)
        .eq('show_location', true)
        .not('location_lat', 'is', null)
        .not('location_lon', 'is', null)
      
      if (error) {
        console.error('Supabase select error:', error)
        throw error
      }
      
      return { success: true, alumni: data || [] }
    } catch (error) {
      console.error('Error fetching alumni:', error)
      return { success: false, error: error.message, alumni: [] }
    }
  },

  // Get specific alumni by email
  async getAlumniByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Supabase select error:', error)
        throw error
      }
      
      return { success: true, alumni: data }
    } catch (error) {
      console.error('Error fetching alumni by email:', error)
      return { success: false, error: error.message }
    }
  },

  // Update location only
  async updateLocation(email, locationData) {
    try {
      const { data, error } = await supabase
        .from('alumni')
        .update({
          location_name: locationData.name,
          location_country: locationData.country,
          location_lat: locationData.lat,
          location_lon: locationData.lon,
          last_active: new Date().toISOString()
        })
        .eq('email', email)
        .select()
      
      if (error) {
        console.error('Supabase update error:', error)
        throw error
      }
      
      return { success: true, data }
    } catch (error) {
      console.error('Error updating location:', error)
      return { success: false, error: error.message }
    }
  }
}

export default alumniService
