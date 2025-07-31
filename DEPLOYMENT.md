# Deployment Guide for uwccr-alumni.com

## 🚀 Quick Deploy to Vercel (Recommended)

### Step 1: Prepare Your Code
```bash
# Build the project
npm run build

# Test the build locally
npm run preview
```

### Step 2: Deploy to Vercel
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Set project name: `uwccr-alumni`
   - Confirm deployment

### Step 3: Connect Domain
1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Settings" → "Domains"
   - Add `uwccr-alumni.com`

2. **At Domain Registrar:**
   - Add DNS records as instructed by Vercel
   - Usually: `CNAME` record pointing to `cname.vercel-dns.com`

## 🌐 Alternative: Netlify Deployment

### Step 1: Deploy to Netlify
1. **Drag & Drop:**
   - Run `npm run build`
   - Drag `dist` folder to [netlify.com](https://netlify.com)

2. **Or Git Integration:**
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

### Step 2: Connect Domain
1. **In Netlify Dashboard:**
   - Go to "Domain settings"
   - Add custom domain: `uwccr-alumni.com`

2. **Update DNS:**
   - Follow Netlify's DNS instructions

## 🔧 Environment Variables

### For Production (Vercel/Netlify):
Set these environment variables in your hosting platform:

```env
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
```

### Update Auth0 Settings:
1. **Allowed Callback URLs:** `https://uwccr-alumni.com/callback`
2. **Allowed Logout URLs:** `https://uwccr-alumni.com`
3. **Allowed Web Origins:** `https://uwccr-alumni.com`

## 📱 Customization for Production

### Update App Title:
Edit `index.html`:
```html
<title>UWCCR Alumni Network</title>
<meta name="description" content="Connect with UWCCR alumni around the world">
```

### Update App Name:
Edit `src/App.tsx`:
```tsx
<h1>UWCCR Alumni Network</h1>
```

## 🔒 Security Considerations

### HTTPS:
- Vercel/Netlify provide automatic SSL
- Ensure all external links use HTTPS

### Environment Variables:
- Never commit `.env` files to Git
- Use hosting platform's environment variable system

## 📊 Analytics (Optional)

### Google Analytics:
Add to `index.html`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚀 Post-Deployment Checklist

- [ ] Domain is accessible at `uwccr-alumni.com`
- [ ] HTTPS is working
- [ ] Auth0 login works
- [ ] Map loads correctly
- [ ] Location search works
- [ ] Markers display properly
- [ ] Mobile responsive
- [ ] Analytics tracking (if added)

## 🆘 Troubleshooting

### Common Issues:
1. **Build fails:** Check for TypeScript errors
2. **Map not loading:** Verify Leaflet CSS is included
3. **Auth0 not working:** Check environment variables and callback URLs
4. **Domain not working:** Verify DNS settings

### Support:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [netlify.com/support](https://netlify.com/support)
- Auth0: [auth0.com/support](https://auth0.com/support) 