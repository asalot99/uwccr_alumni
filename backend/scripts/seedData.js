const mongoose = require('mongoose');
const Alumni = require('../models/Alumni');
require('dotenv').config();

// Sample UWCCR alumni data
const sampleAlumni = [
  {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@uwccr.edu",
    password: "password123",
    graduationYear: 2020,
    program: "Computer Science",
    location: {
      name: "New York",
      country: "United States",
      lat: 40.7128,
      lon: -74.0060
    },
    bio: "Software Engineer at Google, passionate about AI and machine learning.",
    currentCompany: "Google",
    jobTitle: "Senior Software Engineer",
    isVerified: true,
    showLocation: true,
    showEmail: true
  },
  {
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@uwccr.edu",
    password: "password123",
    graduationYear: 2019,
    program: "Engineering",
    location: {
      name: "London",
      country: "United Kingdom",
      lat: 51.5074,
      lon: -0.1278
    },
    bio: "Civil Engineer working on sustainable infrastructure projects.",
    currentCompany: "Arup",
    jobTitle: "Project Engineer",
    isVerified: true,
    showLocation: true,
    showEmail: true
  },
  {
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@uwccr.edu",
    password: "password123",
    graduationYear: 2021,
    program: "Business",
    location: {
      name: "Tokyo",
      country: "Japan",
      lat: 35.6762,
      lon: 139.6503
    },
    bio: "Business Analyst specializing in international markets and strategy.",
    currentCompany: "Sony",
    jobTitle: "Business Analyst",
    isVerified: true,
    showLocation: true,
    showEmail: true
  },
  {
    firstName: "David",
    lastName: "Thompson",
    email: "david.thompson@uwccr.edu",
    password: "password123",
    graduationYear: 2018,
    program: "Science",
    location: {
      name: "Sydney",
      country: "Australia",
      lat: -33.8688,
      lon: 151.2093
    },
    bio: "Research Scientist focusing on renewable energy technologies.",
    currentCompany: "CSIRO",
    jobTitle: "Research Scientist",
    isVerified: true,
    showLocation: true,
    showEmail: true
  },
  {
    firstName: "Lisa",
    lastName: "Müller",
    email: "lisa.muller@uwccr.edu",
    password: "password123",
    graduationYear: 2022,
    program: "Arts",
    location: {
      name: "Berlin",
      country: "Germany",
      lat: 52.5200,
      lon: 13.4050
    },
    bio: "Digital Artist and UX Designer creating immersive experiences.",
    currentCompany: "BMW",
    jobTitle: "UX Designer",
    isVerified: true,
    showLocation: true,
    showEmail: true
  },
  {
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@uwccr.edu",
    password: "password123",
    graduationYear: 2017,
    program: "Computer Science",
    location: {
      name: "San Francisco",
      country: "United States",
      lat: 37.7749,
      lon: -122.4194
    },
    bio: "Full-stack developer and startup founder in the fintech space.",
    currentCompany: "Stripe",
    jobTitle: "Senior Developer",
    isVerified: true,
    showLocation: true,
    showEmail: true
  },
  {
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@uwccr.edu",
    password: "password123",
    graduationYear: 2020,
    program: "Engineering",
    location: {
      name: "Madrid",
      country: "Spain",
      lat: 40.4168,
      lon: -3.7038
    },
    bio: "Mechanical Engineer working on sustainable transportation solutions.",
    currentCompany: "Renault",
    jobTitle: "Mechanical Engineer",
    isVerified: true,
    showLocation: true,
    showEmail: true
  },
  {
    firstName: "Alex",
    lastName: "Kim",
    email: "alex.kim@uwccr.edu",
    password: "password123",
    graduationYear: 2021,
    program: "Business",
    location: {
      name: "Seoul",
      country: "South Korea",
      lat: 37.5665,
      lon: 126.9780
    },
    bio: "Marketing Manager specializing in digital marketing and brand strategy.",
    currentCompany: "Samsung",
    jobTitle: "Marketing Manager",
    isVerified: true,
    showLocation: true,
    showEmail: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    await Alumni.deleteMany({});
    console.log('🗑️  Cleared existing alumni data');

    // Insert sample data
    const createdAlumni = await Alumni.insertMany(sampleAlumni);
    console.log(`✅ Successfully seeded ${createdAlumni.length} alumni records`);

    // Display created alumni
    console.log('\n📋 Created Alumni:');
    createdAlumni.forEach((alumni, index) => {
      console.log(`${index + 1}. ${alumni.firstName} ${alumni.lastName} - ${alumni.location.name}, ${alumni.location.country}`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('🔐 All alumni have password: "password123"');
    console.log('📧 Email format: firstname.lastname@uwccr.edu');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding function
seedDatabase(); 