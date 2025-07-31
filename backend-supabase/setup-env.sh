#!/bin/bash

echo "🔧 Setting up Supabase environment variables..."
echo "=============================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run 'cp env.example .env' first."
    exit 1
fi

echo ""
echo "📋 Current configuration:"
echo "SUPABASE_URL: https://cgqlpqvwognibtjohb.supabase.co"
echo "JWT_SECRET: Generated (secure)"
echo ""
echo "⚠️  IMPORTANT: You need to add your SERVICE ROLE KEY manually!"
echo ""
echo "🔑 To get your service role key:"
echo "1. Go to https://supabase.com/dashboard"
echo "2. Open your uwccr-alumni project"
echo "3. Go to Settings → API"
echo "4. Copy the 'service_role' key (not anon key)"
echo "5. Edit .env file and replace 'your-service-role-key-here'"
echo ""
echo "📝 Your .env file should look like this:"
echo "SUPABASE_URL=https://cgqlpqvwognibtjohb.supabase.co"
echo "SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
echo "JWT_SECRET=260577c12c9cc94015c5e58426739e3e09f10c648b21f8e84fbcb6a7fdabfd179fccd74d39a2aacdff8ceb0142ae93ce656de41b395e6e2d811261d2fd1840d4"
echo ""
echo "🎯 Next steps:"
echo "1. Add your service role key to .env"
echo "2. Run: npm run dev"
echo "3. Test connection: curl http://localhost:5000/api/health"
echo "" 