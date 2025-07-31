# 🚀 Deployment Guide - UWCCR Alumni Network

This guide will walk you through deploying your UWCCR Alumni Network application to a live website.

## 📋 **Prerequisites**

1. **GitHub Account** (free)
2. **Vercel Account** (free)
3. **Supabase Project** (already set up)
4. **Auth0 Application** (already set up)

## 🎯 **Step 1: Prepare Your Code for Production**

### 1.1 **Create a GitHub Repository**

1. **Go to [GitHub](https://github.com)** and sign in
2. **Click "New repository"**
3. **Repository name**: `uwccr-alumni-network`
4. **Description**: `UWCCR Alumni Network - Connect with fellow alumni around the world`
5. **Make it Public** (for free hosting)
6. **Click "Create repository"**

### 1.2 **Push Your Code to GitHub**

```bash
# In your project directory
git init
git add .
git commit -m "Initial commit - UWCCR Alumni Network"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/uwccr-alumni-network.git
git push -u origin main
```

### 1.3 **Update Environment Variables for Production**

Create a `.env.production` file:

```env
# Auth0 Configuration (Production)
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id-here

# Backend API URL (Production)
VITE_API_URL=https://your-backend-url.com/api
```

## 🎯 **Step 2: Deploy Frontend to Vercel**

### 2.1 **Connect to Vercel**

1. **Go to [Vercel](https://vercel.com)** and sign up with GitHub
2. **Click "New Project"**
3. **Import your GitHub repository**: `uwccr-alumni-network`
4. **Framework Preset**: Vite
5. **Root Directory**: `./` (leave as default)
6. **Build Command**: `npm run build`
7. **Output Directory**: `dist`
8. **Install Command**: `npm install`

### 2.2 **Configure Environment Variables**

In Vercel project settings:

1. **Go to Settings → Environment Variables**
2. **Add these variables**:
   ```
   VITE_AUTH0_DOMAIN=your-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id-here
   VITE_API_URL=https://your-backend-url.com/api
   ```

### 2.3 **Deploy**

1. **Click "Deploy"**
2. **Wait for build to complete** (2-3 minutes)
3. **Your site will be live at**: `https://your-project.vercel.app`

## 🎯 **Step 3: Deploy Backend (Optional)**

### 3.1 **Option A: Railway (Recommended)**

1. **Go to [Railway](https://railway.app)** and sign up
2. **Click "New Project"**
3. **Deploy from GitHub repo**
4. **Select your backend folder**: `backend-supabase`
5. **Add environment variables**:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   JWT_SECRET=your-jwt-secret
   PORT=5001
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

### 3.2 **Option B: Render**

1. **Go to [Render](https://render.com)** and sign up
2. **Click "New Web Service"**
3. **Connect your GitHub repository**
4. **Configure**:
   - **Name**: `uwccr-alumni-backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend-supabase`

## 🎯 **Step 4: Update Auth0 Settings**

### 4.1 **Update Allowed URLs**

In your Auth0 application settings:

1. **Allowed Callback URLs**:
   ```
   https://your-domain.vercel.app/callback
   ```

2. **Allowed Logout URLs**:
   ```
   https://your-domain.vercel.app
   ```

3. **Allowed Web Origins**:
   ```
   https://your-domain.vercel.app
   ```

### 4.2 **Update Frontend Environment**

Update your Vercel environment variables with the correct backend URL.

## 🎯 **Step 5: Custom Domain (Optional)**

### 5.1 **Purchase Domain**

1. **Go to [Namecheap](https://namecheap.com)** or [GoDaddy](https://godaddy.com)
2. **Purchase**: `uwccr-alumni.com` (or your preferred domain)

### 5.2 **Configure DNS**

1. **In Vercel**: Go to Settings → Domains
2. **Add your domain**: `uwccr-alumni.com`
3. **Update DNS records** as instructed by Vercel

### 5.3 **Update Auth0 Settings**

Update Auth0 with your custom domain:
- **Callback URLs**: `https://uwccr-alumni.com/callback`
- **Logout URLs**: `https://uwccr-alumni.com`
- **Web Origins**: `https://uwccr-alumni.com`

## 🎯 **Step 6: Test Your Deployment**

### 6.1 **Test Checklist**

- [ ] **Frontend loads** at your domain
- [ ] **Auth0 login** works
- [ ] **Location detection** works
- [ ] **Map displays** correctly
- [ ] **Backend API** responds
- [ ] **Database connections** work
- [ ] **Mobile responsiveness** works

### 6.2 **Common Issues & Solutions**

**Issue**: Auth0 redirect errors
**Solution**: Check callback URLs in Auth0 settings

**Issue**: API calls failing
**Solution**: Verify backend URL in environment variables

**Issue**: Map not loading
**Solution**: Check browser console for errors

## 🎯 **Step 7: Production Optimization**

### 7.1 **Performance**

1. **Enable Vercel Analytics** (free)
2. **Optimize images** (use WebP format)
3. **Enable compression** (automatic in Vercel)

### 7.2 **Security**

1. **HTTPS** (automatic with Vercel)
2. **Security headers** (configure in Vercel)
3. **Rate limiting** (configure in backend)

### 7.3 **Monitoring**

1. **Vercel Analytics** for frontend
2. **Railway/Render logs** for backend
3. **Supabase dashboard** for database

## 🎯 **Step 8: Share Your Application**

### 8.1 **Announcement**

Share with your UWCCR community:
- **URL**: `https://uwccr-alumni.com`
- **Features**: Location-based alumni networking
- **Privacy**: City-level location sharing only

### 8.2 **Documentation**

Create user guides:
- How to sign up
- How to use location features
- Privacy policy
- FAQ

## 📊 **Cost Breakdown**

### **Free Tier (Recommended)**
- **Vercel**: $0/month (frontend hosting)
- **Railway**: $0/month (backend hosting)
- **Supabase**: $0/month (database)
- **Auth0**: $0/month (authentication)
- **Domain**: ~$10/year

### **Total**: ~$10/year for domain

## 🔧 **Maintenance**

### **Regular Tasks**
1. **Monitor usage** in all dashboards
2. **Update dependencies** monthly
3. **Backup database** regularly
4. **Check for security updates**

### **Scaling**
- **Vercel**: Automatically scales
- **Railway**: Upgrade plan if needed
- **Supabase**: Upgrade plan if needed

## 🆘 **Support**

### **If Something Goes Wrong**
1. **Check Vercel logs** for frontend issues
2. **Check Railway/Render logs** for backend issues
3. **Check Supabase dashboard** for database issues
4. **Check Auth0 logs** for authentication issues

### **Useful Links**
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Supabase Documentation](https://supabase.com/docs)
- [Auth0 Documentation](https://auth0.com/docs)

---

**🎉 Congratulations!** Your UWCCR Alumni Network is now live and accessible to alumni worldwide! 