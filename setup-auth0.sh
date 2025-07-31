#!/bin/bash

echo "🔐 Auth0 Setup for UWCCR Alumni Network"
echo "========================================"
echo ""

# Check if .env file exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

# Create .env file
echo "📝 Creating .env file..."
cat > .env << 'EOF'
# Auth0 Configuration
# Get these values from your Auth0 application settings
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id-here

# Backend API URL
VITE_API_URL=http://localhost:5001/api
EOF

echo "✅ .env file created!"
echo ""
echo "🔧 Next Steps:"
echo "1. Go to https://manage.auth0.com/"
echo "2. Create a new application (Single Page Application)"
echo "3. Copy your Domain and Client ID"
echo "4. Update the .env file with your actual values"
echo "5. Set these URLs in Auth0:"
echo "   - Callback: http://localhost:5173/callback"
echo "   - Logout: http://localhost:5173"
echo "   - Web Origins: http://localhost:5173"
echo ""
echo "📖 See AUTH0_SETUP.md for detailed instructions"
echo ""
echo "🚀 After setup, run: npm run dev" 