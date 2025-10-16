#!/bin/bash

# Smart Baggage Tracker - Development Startup Script
# This script starts both backend and frontend servers

echo "🚀 Starting Smart Baggage Tracker Development Environment"
echo "=================================================="

# Check if Python virtual environment exists
if [ ! -d "backend/.venv" ]; then
    echo "❌ Python virtual environment not found!"
    echo "Please run the setup instructions in README.md first."
    exit 1
fi

# Check if Node modules are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Node modules not found!"
    echo "Please run 'cd frontend && npm install' first."
    exit 1
fi

# Function to kill background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM EXIT

# Start backend server
echo "🔧 Starting Django backend server..."
cd backend
source .venv/bin/activate
python manage.py runserver > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "⚡ Starting Next.js frontend server..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both servers are starting up..."
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend API: http://localhost:8000/api"
echo "📍 Django Admin: http://localhost:8000/admin"
echo ""
echo "📋 Default login credentials:"
echo "   Staff: staff1 / staff123"
echo "   Admin: admin / admin123"
echo ""
echo "💡 Press Ctrl+C to stop both servers"
echo ""

# Monitor both processes
while kill -0 $BACKEND_PID 2>/dev/null && kill -0 $FRONTEND_PID 2>/dev/null; do
    sleep 1
done

echo "❌ One of the servers stopped unexpectedly"