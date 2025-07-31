#!/bin/bash

echo "🚀 Setting up Auth0 for Alumni Network Map"
echo "=========================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🔧 Next steps:"
echo "1. Go to https://auth0.com/signup and create an account"
echo "2. Create a new application (Single Page Application)"
echo "3. Copy your Domain and Client ID from Auth0 settings"
echo "4. Update the .env file with your credentials:"
echo "   VITE_AUTH0_DOMAIN=your-domain.auth0.com"
echo "   VITE_AUTH0_CLIENT_ID=your-client-id"
echo ""
echo "5. In Auth0 settings, add these URLs:"
echo "   - Allowed Callback URLs: http://localhost:5173/callback"
echo "   - Allowed Logout URLs: http://localhost:5173"
echo "   - Allowed Web Origins: http://localhost:5173"
echo ""
echo "6. Restart your development server: npm run dev"
echo ""
echo "📖 For detailed instructions, see setup-auth0.md" 