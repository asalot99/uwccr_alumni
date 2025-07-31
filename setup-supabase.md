# 🗄️ Supabase Setup Guide for UWCCR Alumni Network

## 📋 **Overview**
This guide will help you set up a secure Supabase PostgreSQL database and connect it to your alumni network application.

## 🎯 **Why Supabase?**
- ✅ **PostgreSQL database** (enterprise-grade)
- ✅ **Real-time capabilities** 
- ✅ **Built-in authentication** (optional)
- ✅ **Row Level Security** (RLS)
- ✅ **Free tier** (500MB database, 50MB bandwidth)
- ✅ **Auto-scaling** and backups
- ✅ **SQL interface** for complex queries

## 🚀 **Step 1: Set Up Supabase Project**

### **1.1 Create Supabase Account**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up
3. Choose "Free" tier

### **1.2 Create New Project**
1. Click "New Project"
2. **Organization:** Select your org (or create one)
3. **Name:** `uwccr-alumni`
4. **Database Password:** Generate a strong password (save it!)
5. **Region:** Choose closest to you
6. Click "Create new project"

### **1.3 Wait for Setup**
- Database setup takes 2-3 minutes
- You'll see "Project is ready" when complete

## 🔧 **Step 2: Get API Keys**

### **2.1 Find Your Project URL**
1. Go to **Settings** → **API**
2. Copy your **Project URL** (looks like: `https://xyz.supabase.co`)

### **2.2 Get Service Role Key**
1. In **Settings** → **API**
2. Copy **service_role** key (starts with `eyJ...`)
3. ⚠️ **Keep this secret** - it has admin privileges

## 🗄️ **Step 3: Set Up Database Schema**

### **3.1 Open SQL Editor**
1. Go to **SQL Editor** in left sidebar
2. Click **New Query**

### **3.2 Run Schema Script**
1. Copy the entire contents of `backend-supabase/sql/schema.sql`
2. Paste into SQL Editor
3. Click **Run** (or press Cmd/Ctrl + Enter)

You should see:
```
✅ Successfully ran 1 query
```

### **3.3 Verify Tables Created**
1. Go to **Table Editor** in left sidebar
2. You should see:
   - `alumni` table
   - `public_alumni_map` view
   - `searchable_alumni` view

## 🔧 **Step 4: Set Up Backend**

### **4.1 Install Dependencies**
```bash
cd backend-supabase
npm install
```

### **4.2 Configure Environment Variables**
```bash
cp env.example .env
```

Edit `.env` file:
```env
# Supabase Configuration (replace with your values)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### **4.3 Generate JWT Secret**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output and paste it as your `JWT_SECRET`.

### **4.4 Start Backend Server**
```bash
npm run dev
```

You should see:
```
🚀 UWCCR Alumni Network API running on port 5000
📊 Environment: development
🌐 Frontend URL: http://localhost:5173
🗄️  Database: Supabase PostgreSQL
```

## 🌱 **Step 5: Seed Database with Sample Data**

### **5.1 Run Database Seeding**
```bash
node scripts/seedData.js
```

You should see:
```
🌱 Starting database seeding...
✅ Connected to Supabase
🗑️  Cleared existing alumni data
✅ Successfully seeded 8 alumni records

📋 Created Alumni:
1. Sarah Johnson - New York, United States
2. Michael Chen - London, United Kingdom
3. Emily Rodriguez - Tokyo, Japan
4. David Thompson - Sydney, Australia
5. Lisa Müller - Berlin, Germany
6. James Wilson - San Francisco, United States
7. Maria Garcia - Madrid, Spain
8. Alex Kim - Seoul, South Korea

🎉 Database seeding completed successfully!
🔐 All alumni have password: "password123"
📧 Email format: firstname.lastname@uwccr.edu
```

## 🔗 **Step 6: Connect Frontend to Backend**

### **6.1 Update Frontend Environment**
Create `.env` in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### **6.2 Test the Connection**
1. Start your frontend: `npm run dev`
2. Go to the map page
3. You should now see real alumni data from Supabase

## 🔐 **Step 7: Test Authentication**

### **7.1 Test Login**
You can test with any of the seeded alumni:
- **Email:** `sarah.johnson@uwccr.edu`
- **Password:** `password123`

### **7.2 API Endpoints Available**
- `POST /api/alumni/register` - Register new alumni
- `POST /api/alumni/login` - Login alumni
- `GET /api/alumni/map` - Get map data (public)
- `GET /api/alumni/profile` - Get profile (authenticated)
- `PUT /api/alumni/location` - Update location (authenticated)

## 🛡️ **Security Features**

### **Row Level Security (RLS):**
- ✅ **Users can only view their own profile**
- ✅ **Public can only see verified alumni with location**
- ✅ **Search requires authentication**
- ✅ **Automatic data filtering**

### **Data Protection:**
- ✅ **Password hashing** with bcrypt
- ✅ **JWT authentication** for API access
- ✅ **Rate limiting** to prevent abuse
- ✅ **Input validation** on all endpoints
- ✅ **CORS protection** for cross-origin requests

### **Privacy Controls:**
- ✅ **Location visibility** toggle
- ✅ **Email visibility** toggle
- ✅ **Public profile** toggle
- ✅ **Verified alumni** system

## 📊 **Database Schema**

### **Alumni Table:**
```sql
CREATE TABLE alumni (
  id UUID PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  graduation_year INTEGER NOT NULL,
  program VARCHAR(100) NOT NULL,
  location_name VARCHAR(255) NOT NULL,
  location_country VARCHAR(255) NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lon DECIMAL(11, 8) NOT NULL,
  bio TEXT DEFAULT '',
  current_company VARCHAR(100) DEFAULT '',
  job_title VARCHAR(100) DEFAULT '',
  is_public BOOLEAN DEFAULT false,
  show_location BOOLEAN DEFAULT true,
  show_email BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Views:**
- `public_alumni_map` - Public data for map display
- `searchable_alumni` - Searchable data for authenticated users

## 🚀 **Production Deployment**

### **Backend Deployment (Railway/Render):**
1. Push `backend-supabase` code to GitHub
2. Connect to Railway or Render
3. Set environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `FRONTEND_URL`
4. Deploy

### **Supabase Production:**
- Free tier scales automatically
- No migration needed for schema changes
- Automatic backups every 24 hours

## 💰 **Costs:**
- **Supabase:** Free tier (500MB database, 50MB bandwidth)
- **Backend hosting:** Free (Railway/Render)
- **Total:** $0/month

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **Supabase Connection Failed:**
   - Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
   - Verify project is active in Supabase dashboard
   - Check network access settings

2. **Schema Creation Failed:**
   - Ensure you're using the SQL Editor (not Table Editor)
   - Check for syntax errors in schema.sql
   - Verify you have admin privileges

3. **CORS Errors:**
   - Check `FRONTEND_URL` in backend `.env`
   - Ensure frontend is running on correct port

4. **JWT Errors:**
   - Verify `JWT_SECRET` is set
   - Check token expiration

### **Supabase Dashboard Features:**
- **Table Editor:** View and edit data
- **SQL Editor:** Run custom queries
- **Authentication:** Manage users (if using Supabase Auth)
- **Storage:** File uploads (if needed)
- **Edge Functions:** Serverless functions (if needed)

## 🎉 **Next Steps**

1. **Customize Alumni Data:** Update the seed script with real UWCCR alumni
2. **Add Admin Panel:** Create admin interface for managing alumni
3. **Email Verification:** Add email verification for new registrations
4. **Real-time Features:** Use Supabase real-time subscriptions
5. **Analytics:** Add usage analytics and reporting

Your UWCCR Alumni Network now has a secure, scalable Supabase PostgreSQL backend! 🚀 