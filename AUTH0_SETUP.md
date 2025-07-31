# 🔐 Auth0 Setup Guide for UWCCR Alumni Network

This guide will help you set up Auth0 authentication for your UWCCR Alumni Network application.

## 📋 Prerequisites

- Auth0 account (free tier available)
- Your application running locally

## 🚀 Step-by-Step Setup

### 1. Create Auth0 Application

1. **Go to [Auth0 Dashboard](https://manage.auth0.com/)**
2. **Sign up/Login** to your Auth0 account
3. **Create a new application**:
   - Click "Applications" in the left sidebar
   - Click "Create Application"
   - Name: `UWCCR Alumni Network`
   - Type: **Single Page Application** (SPA)
   - Click "Create"

### 2. Configure Application Settings

In your Auth0 application settings:

1. **Allowed Callback URLs**: `http://localhost:5173/callback`
2. **Allowed Logout URLs**: `http://localhost:5173`
3. **Allowed Web Origins**: `http://localhost:5173`
4. **Application Type**: Single Page Application

### 3. Get Your Credentials

From your Auth0 application settings page, copy:
- **Domain** (e.g., `dev-xyz.us.auth0.com`)
- **Client ID** (e.g., `abc123def456`)

### 4. Create Environment File

Create a `.env` file in your project root with:

```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id-here

# Backend API URL
VITE_API_URL=http://localhost:5001/api
```

**Replace the placeholder values with your actual Auth0 credentials.**

### 5. Test the Setup

1. **Start your backend server**:
   ```bash
   cd backend-supabase
   npm run dev
   ```

2. **Start your frontend**:
   ```bash
   npm run dev
   ```

3. **Visit** `http://localhost:5173`
4. **You should see the login page** instead of the demo mode
5. **Click "Login"** to test Auth0 authentication

## 🔧 Troubleshooting

### Issue: Still seeing demo mode
**Solution**: Make sure your `.env` file has the correct Auth0 credentials and is in the project root.

### Issue: Auth0 redirect errors
**Solution**: Verify your callback URLs in Auth0 settings match exactly:
- Callback: `http://localhost:5173/callback`
- Logout: `http://localhost:5173`

### Issue: "Invalid redirect_uri" error
**Solution**: Check that your Auth0 application type is set to "Single Page Application" (SPA).

## 🎯 What Happens After Setup

1. **Users will see a proper login page** instead of demo mode
2. **Authentication is handled by Auth0** (Google, GitHub, email/password, etc.)
3. **User data is securely managed** by Auth0
4. **Protected routes** require authentication
5. **User locations are tied to their Auth0 user ID**

## 🔒 Security Features

- **JWT tokens** for secure authentication
- **Protected routes** that require login
- **User-specific data** tied to Auth0 user IDs
- **Secure token storage** in localStorage
- **Automatic token refresh** handled by Auth0

## 🚀 Next Steps

After Auth0 is set up:

1. **Test the full authentication flow**
2. **Set up your backend to handle Auth0 tokens**
3. **Configure user profile management**
4. **Deploy to production** (update Auth0 URLs for production domain)

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Auth0 settings match this guide
3. Ensure your `.env` file is properly configured
4. Restart your development server after making changes

---

**🎉 Congratulations!** Your UWCCR Alumni Network now has professional authentication powered by Auth0. 