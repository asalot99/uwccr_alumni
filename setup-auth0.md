# Auth0 Setup Guide for Alumni Network Map

## Step 1: Create Auth0 Account
1. Go to [auth0.com/signup](https://auth0.com/signup)
2. Sign up for a free account
3. Verify your email

## Step 2: Create Application
1. Log into Auth0 Dashboard
2. Click "Create Application"
3. Name: "Alumni Network Map"
4. Type: "Single Page Application"
5. Click "Create"

## Step 3: Configure Application Settings
1. Go to "Settings" tab
2. Copy your **Domain** and **Client ID**
3. Under "Application URIs" set:
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`
4. Click "Save Changes"

## Step 4: Configure Environment Variables
1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your Auth0 credentials:
   ```
   VITE_AUTH0_DOMAIN=your-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id-here
   ```

## Step 5: Test the Setup
1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173
3. You should see the login page
4. Test both email/password and SSO login

## Step 6: Enable Social Logins (Optional)
1. In Auth0 Dashboard, go to "Authentication" → "Social"
2. Enable providers like Google, GitHub, etc.
3. Configure each provider with their API keys

## Troubleshooting
- If you see "Auth0 Configuration Required", check your `.env` file
- Make sure your callback URLs match exactly
- Check the browser console for any errors
- Verify your Auth0 application is set to "Single Page Application"

## Production Deployment
For production, update your Auth0 settings with your actual domain:
- Allowed Callback URLs: `https://yourdomain.com`
- Allowed Logout URLs: `https://yourdomain.com`
- Allowed Web Origins: `https://yourdomain.com` 