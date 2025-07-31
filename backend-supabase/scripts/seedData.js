const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample UWCCR alumni data
const sampleAlumni = [
  {
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.johnson@uwccr.edu",
    password: "password123",
    graduation_year: 2020,
    program: "Computer Science",
    location_name: "New York",
    location_country: "United States",
    location_lat: 40.7128,
    location_lon: -74.0060,
    bio: "Software Engineer at Google, passionate about AI and machine learning.",
    current_company: "Google",
    job_title: "Senior Software Engineer",
    is_verified: true,
    show_location: true,
    show_email: true
  },
  {
    first_name: "Michael",
    last_name: "Chen",
    email: "michael.chen@uwccr.edu",
    password: "password123",
    graduation_year: 2019,
    program: "Engineering",
    location_name: "London",
    location_country: "United Kingdom",
    location_lat: 51.5074,
    location_lon: -0.1278,
    bio: "Civil Engineer working on sustainable infrastructure projects.",
    current_company: "Arup",
    job_title: "Project Engineer",
    is_verified: true,
    show_location: true,
    show_email: true
  },
  {
    first_name: "Emily",
    last_name: "Rodriguez",
    email: "emily.rodriguez@uwccr.edu",
    password: "password123",
    graduation_year: 2021,
    program: "Business",
    location_name: "Tokyo",
    location_country: "Japan",
    location_lat: 35.6762,
    location_lon: 139.6503,
    bio: "Business Analyst specializing in international markets and strategy.",
    current_company: "Sony",
    job_title: "Business Analyst",
    is_verified: true,
    show_location: true,
    show_email: true
  },
  {
    first_name: "David",
    last_name: "Thompson",
    email: "david.thompson@uwccr.edu",
    password: "password123",
    graduation_year: 2018,
    program: "Science",
    location_name: "Sydney",
    location_country: "Australia",
    location_lat: -33.8688,
    location_lon: 151.2093,
    bio: "Research Scientist focusing on renewable energy technologies.",
    current_company: "CSIRO",
    job_title: "Research Scientist",
    is_verified: true,
    show_location: true,
    show_email: true
  },
  {
    first_name: "Lisa",
    last_name: "Müller",
    email: "lisa.muller@uwccr.edu",
    password: "password123",
    graduation_year: 2022,
    program: "Arts",
    location_name: "Berlin",
    location_country: "Germany",
    location_lat: 52.5200,
    location_lon: 13.4050,
    bio: "Digital Artist and UX Designer creating immersive experiences.",
    current_company: "BMW",
    job_title: "UX Designer",
    is_verified: true,
    show_location: true,
    show_email: true
  },
  {
    first_name: "James",
    last_name: "Wilson",
    email: "james.wilson@uwccr.edu",
    password: "password123",
    graduation_year: 2017,
    program: "Computer Science",
    location_name: "San Francisco",
    location_country: "United States",
    location_lat: 37.7749,
    location_lon: -122.4194,
    bio: "Full-stack developer and startup founder in the fintech space.",
    current_company: "Stripe",
    job_title: "Senior Developer",
    is_verified: true,
    show_location: true,
    show_email: true
  },
  {
    first_name: "Maria",
    last_name: "Garcia",
    email: "maria.garcia@uwccr.edu",
    password: "password123",
    graduation_year: 2020,
    program: "Engineering",
    location_name: "Madrid",
    location_country: "Spain",
    location_lat: 40.4168,
    location_lon: -3.7038,
    bio: "Mechanical Engineer working on sustainable transportation solutions.",
    current_company: "Renault",
    job_title: "Mechanical Engineer",
    is_verified: true,
    show_location: true,
    show_email: true
  },
  {
    first_name: "Alex",
    last_name: "Kim",
    email: "alex.kim@uwccr.edu",
    password: "password123",
    graduation_year: 2021,
    program: "Business",
    location_name: "Seoul",
    location_country: "South Korea",
    location_lat: 37.5665,
    location_lon: 126.9780,
    bio: "Marketing Manager specializing in digital marketing and brand strategy.",
    current_company: "Samsung",
    job_title: "Marketing Manager",
    is_verified: true,
    show_location: true,
    show_email: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('alumni')
      .select('count')
      .limit(1);
    
    if (testError) {
      throw new Error(`Database connection failed: ${testError.message}`);
    }
    
    console.log('✅ Connected to Supabase');

    // Clear existing data
    const { error: deleteError } = await supabase
      .from('alumni')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (deleteError) {
      throw deleteError;
    }
    
    console.log('🗑️  Cleared existing alumni data');

    // Hash passwords and prepare data
    const alumniWithHashedPasswords = await Promise.all(
      sampleAlumni.map(async (alumni) => {
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(alumni.password, salt);
        
        return {
          ...alumni,
          password_hash: passwordHash
        };
      })
    );

    // Remove password field from final data
    const finalAlumniData = alumniWithHashedPasswords.map(({ password, ...alumni }) => alumni);

    // Insert sample data
    const { data: createdAlumni, error: insertError } = await supabase
      .from('alumni')
      .insert(finalAlumniData)
      .select();

    if (insertError) {
      throw insertError;
    }

    console.log(`✅ Successfully seeded ${createdAlumni.length} alumni records`);

    // Display created alumni
    console.log('\n📋 Created Alumni:');
    createdAlumni.forEach((alumni, index) => {
      console.log(`${index + 1}. ${alumni.first_name} ${alumni.last_name} - ${alumni.location_name}, ${alumni.location_country}`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('🔐 All alumni have password: "password123"');
    console.log('📧 Email format: firstname.lastname@uwccr.edu');
    console.log('\n🌐 You can now test the API endpoints:');
    console.log('   - GET /api/health (health check)');
    console.log('   - GET /api/alumni/map (public map data)');
    console.log('   - POST /api/alumni/login (login with any alumni email)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase(); 