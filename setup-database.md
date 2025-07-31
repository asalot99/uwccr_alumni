# 🗄️ Database Setup Guide for UWCCR Alumni Network

## 📋 **Overview**
This guide will help you set up a secure MongoDB database and connect it to your alumni network application.

## 🎯 **What We're Building:**
- **Secure MongoDB Atlas Database** (cloud-hosted)
- **Node.js Backend API** with JWT authentication
- **Real alumni data** instead of mock data
- **Privacy controls** for alumni information

## 🚀 **Step 1: Set Up MongoDB Atlas (Free)**

### **1.1 Create MongoDB Atlas Account**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose "Free" tier (M0 Sandbox)

### **1.2 Create Database Cluster**
1. Click "Build a Database"
2. Choose "FREE" tier
3. Select cloud provider (AWS/Google Cloud/Azure)
4. Choose region closest to you
5. Click "Create"

### **1.3 Set Up Database Access**
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Username: `uwccr-admin`
4. Password: Generate a strong password
5. Role: "Atlas admin"
6. Click "Add User"

### **1.4 Set Up Network Access**
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### **1.5 Get Connection String**
1. Go to "Database" in left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

## 🔧 **Step 2: Set Up Backend**

### **2.1 Install Backend Dependencies**
```bash
cd backend
npm install
```

### **2.2 Configure Environment Variables**
```bash
cp env.example .env
```

Edit `.env` file:
```env
# MongoDB Atlas Connection (replace with your connection string)
MONGODB_URI=mongodb+srv://uwccr-admin:YOUR_PASSWORD@cluster.mongodb.net/uwccr-alumni?retryWrites=true&w=majority

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### **2.3 Generate JWT Secret**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output and paste it as your `JWT_SECRET`.

### **2.4 Start Backend Server**
```bash
npm run dev
```

You should see:
```
🚀 UWCCR Alumni Network API running on port 5000
✅ Connected to MongoDB Atlas
```

## 🌱 **Step 3: Seed Database with Sample Data**

### **3.1 Run Database Seeding**
```bash
node scripts/seedData.js
```

You should see:
```
✅ Connected to MongoDB Atlas
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

## 🔗 **Step 4: Connect Frontend to Backend**

### **4.1 Update Frontend Environment**
Create `.env` in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### **4.2 Test the Connection**
1. Start your frontend: `npm run dev`
2. Go to the map page
3. You should now see real alumni data instead of mock data

## 🔐 **Step 5: Test Authentication**

### **5.1 Test Login**
You can test with any of the seeded alumni:
- **Email:** `sarah.johnson@uwccr.edu`
- **Password:** `password123`

### **5.2 API Endpoints Available**
- `POST /api/alumni/register` - Register new alumni
- `POST /api/alumni/login` - Login alumni
- `GET /api/alumni/map` - Get map data (public)
- `GET /api/alumni/profile` - Get profile (authenticated)
- `PUT /api/alumni/location` - Update location (authenticated)

## 🛡️ **Security Features**

### **Data Protection:**
- ✅ **Password hashing** with bcrypt
- ✅ **JWT authentication** for API access
- ✅ **Rate limiting** to prevent abuse
- ✅ **Input validation** on all endpoints
- ✅ **CORS protection** for cross-origin requests
- ✅ **Helmet.js** for security headers

### **Privacy Controls:**
- ✅ **Location visibility** toggle
- ✅ **Email visibility** toggle
- ✅ **Public profile** toggle
- ✅ **Verified alumni** system

## 📊 **Database Schema**

### **Alumni Collection:**
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  graduationYear: Number,
  program: String,
  location: {
    name: String,
    country: String,
    lat: Number,
    lon: Number
  },
  bio: String,
  currentCompany: String,
  jobTitle: String,
  isVerified: Boolean,
  showLocation: Boolean,
  showEmail: Boolean,
  isPublic: Boolean,
  lastActive: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 **Production Deployment**

### **Backend Deployment (Railway/Render):**
1. Push backend code to GitHub
2. Connect to Railway or Render
3. Set environment variables
4. Deploy

### **Database Migration:**
- MongoDB Atlas scales automatically
- No migration needed for schema changes
- Backup automatically handled

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **MongoDB Connection Failed:**
   - Check connection string
   - Verify network access settings
   - Ensure password is correct

2. **CORS Errors:**
   - Check `FRONTEND_URL` in backend `.env`
   - Ensure frontend is running on correct port

3. **JWT Errors:**
   - Verify `JWT_SECRET` is set
   - Check token expiration

4. **API Not Responding:**
   - Check if backend is running on port 5000
   - Verify all dependencies are installed

### **Support:**
- MongoDB Atlas: [docs.mongodb.com](https://docs.mongodb.com)
- Node.js: [nodejs.org](https://nodejs.org)
- Express: [expressjs.com](https://expressjs.com)

## 🎉 **Next Steps**

1. **Customize Alumni Data:** Update the seed script with real UWCCR alumni
2. **Add Admin Panel:** Create admin interface for managing alumni
3. **Email Verification:** Add email verification for new registrations
4. **Analytics:** Add usage analytics and reporting
5. **Mobile App:** Consider React Native mobile app

Your UWCCR Alumni Network now has a secure, scalable database backend! 🚀 