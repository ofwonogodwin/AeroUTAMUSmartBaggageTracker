#!/bin/bash
# 🎯 AERO UTAMU Smart Baggage Tracker - Quick Setup Script
# =======================================================
# This script helps new users set up the project quickly

set -e  # Exit on any error

echo "� AERO UTAMU Smart Baggage Tracker - Setup Script"
echo "=================================================="
echo ""

# Check if we're in the right directory  
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Expected structure: README.md, backend/, frontend/"
    exit 1
fi

echo "🔍 Checking prerequisites..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.12 or higher."
    exit 1
fi

# Check if Node.js is installed  
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup Backend
echo ""
echo "🔧 Setting up Django Backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source .venv/bin/activate

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating backend .env file..."
    cp .env.example .env
    echo "   ✅ Created .env from .env.example"
    echo "   📝 You can edit .env for custom configuration"
fi

# Install Python dependencies
echo "📥 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements-dev.txt

# Run migrations
echo "🗄️ Running database migrations..."
python manage.py migrate

# Create superuser (optional)
echo ""
read -p "🔑 Do you want to create a superuser? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python manage.py createsuperuser
fi

# Create sample data
echo "🎭 Creating sample data and user accounts..."
python manage.py seed_baggage_data --baggage-count=20

# Generate QR codes
echo "📱 Generating QR codes..."
python update_qr_codes.py

# Create passenger accounts
echo "👥 Creating passenger accounts..."
python create_passenger_accounts.py

cd ..

# Setup Frontend
echo ""
echo "⚡ Setting up Next.js Frontend..."
cd frontend

# Install Node.js dependencies
echo "📥 Installing Node.js dependencies..."
npm install

# Create .env.local file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creating frontend .env.local file..."
    cp .env.example .env.local
    echo "   ✅ Created .env.local from .env.example"
    echo "   📝 You can edit .env.local for custom configuration"
fi

cd ..

echo "✅ Frontend setup complete!"
echo ""

# Back to root directory
cd ..

echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "🚀 To start the application:"
echo ""  
echo "1️⃣  Start Backend (Terminal 1):"
echo "   cd backend"
echo "   source .venv/bin/activate"
echo "   python manage.py runserver"
echo ""
echo "2️⃣  Start Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3️⃣  Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000/api"
echo "   Admin Panel: http://localhost:8000/admin"
echo ""
echo "� Login Credentials:"
echo "   Staff: staff1 / staff123"
echo "   Passenger: adamyoung / adam2024"
echo "   Admin: admin / admin123"
echo ""
echo "🧳 Test QR Codes:"
echo "   BAG-1F0C5581 (Henry Moore)"
echo "   BAG-65B24C93 (Ruby Martinez)"
echo "   BAG-2106F8F3 (Alice Johnson)"
echo ""
echo "📋 See passenger_accounts.txt for all 25 passenger accounts"
echo "📚 Check README.md for detailed documentation"
echo ""
echo "✈️ Ready for takeoff! Your baggage tracking system is operational."