#!/bin/bash

# Smart Baggage Tracker - Setup Script
# ====================================
# This script sets up the entire development environment

set -e  # Exit on any error

echo "🚀 Smart Baggage Tracker - Development Setup"
echo "============================================="

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

# Install Python dependencies
echo "📥 Installing Python dependencies..."
pip install --upgrade pip
pip install -r ../requirements.txt

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

# Seed sample data
echo ""
read -p "📊 Do you want to seed sample data? (Y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
    python manage.py seed_baggage_data --baggage-count 15
fi

cd ..

# Setup Frontend
echo ""
echo "⚡ Setting up Next.js Frontend..."
cd frontend

# Install Node.js dependencies
echo "📥 Installing Node.js dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating environment file..."
    cat > .env.local << EOF
# Environment variables for development
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
EOF
fi

cd ..

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🚀 To start the development servers:"
echo "   ./start-dev.sh"
echo ""
echo "🌐 Or start them manually:"
echo "   Backend:  cd backend && source .venv/bin/activate && python manage.py runserver"
echo "   Frontend: cd frontend && npm run dev"
echo ""
echo "📍 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000/api"
echo "   Admin:    http://localhost:8000/admin"
echo ""
echo "👤 Default credentials:"
echo "   Admin:    admin / admin123"
echo "   Staff:    staff1 / staff123"
echo "   Passenger: passenger1 / passenger123"