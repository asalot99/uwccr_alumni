#!/bin/bash

echo "🚀 UWCCR Alumni Network - Deployment Script"
echo "=========================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - UWCCR Alumni Network"
    git branch -M main
    echo "✅ Git repository initialized"
    echo ""
    echo "🔗 Next steps:"
    echo "1. Create a GitHub repository at: https://github.com/new"
    echo "2. Name it: uwccr-alumni-network"
    echo "3. Make it public"
    echo "4. Run: git remote add origin https://github.com/YOUR_USERNAME/uwccr-alumni-network.git"
    echo "5. Run: git push -u origin main"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "🔧 Production Build Check"
echo "========================"

# Check if build works
echo "📦 Building for production..."
if npm run build; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi

echo ""
echo "🌐 Deployment Options"
echo "==================="
echo ""
echo "1. 🚀 Vercel (Recommended - Frontend)"
echo "   - Go to: https://vercel.com"
echo "   - Sign up with GitHub"
echo "   - Import your repository"
echo "   - Framework: Vite"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo ""
echo "2. 🚂 Railway (Backend)"
echo "   - Go to: https://railway.app"
echo "   - Sign up with GitHub"
echo "   - Deploy from repository"
echo "   - Select folder: backend-supabase"
echo ""
echo "3. 🌍 Custom Domain"
echo "   - Purchase: uwccr-alumni.com"
echo "   - Configure DNS in Vercel"
echo "   - Update Auth0 settings"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "🎯 Quick Start:"
echo "1. Push code to GitHub"
echo "2. Deploy to Vercel"
echo "3. Update Auth0 URLs"
echo "4. Test your live site!"
echo ""
echo "💰 Total Cost: ~$10/year (domain only)"
echo "🎉 Everything else is FREE!" 