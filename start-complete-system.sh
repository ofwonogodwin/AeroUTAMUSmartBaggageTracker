#!/bin/bash
# Smart Baggage Tracker - Complete Startup Script

echo "🚀 Starting Smart Baggage Tracker System"
echo "========================================"

# Kill any existing servers
echo "🔄 Stopping any existing servers..."
pkill -f "manage.py runserver" || true
pkill -f "next dev" || true

# Wait for ports to be free
sleep 2

# Start Backend Server
echo "🔧 Starting Django Backend Server..."
cd /home/anonymous-user/Desktop/AeroUTAMUSmartBaggageTracker/backend
PYTHONPATH=.venv/lib/python3.12/site-packages python3 manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start Frontend Server
echo "⚡ Starting Next.js Frontend Server..."
cd /home/anonymous-user/Desktop/AeroUTAMUSmartBaggageTracker/frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ System Starting Up..."
echo "📍 Backend API: http://localhost:8000/api/"
echo "📍 Frontend App: http://localhost:3000"
echo "📍 Admin Panel: http://localhost:8000/admin/"
echo ""
echo "🔑 Login Credentials:"
echo "   Admin: admin / admin123"
echo "   Staff: staff1 / staff123"
echo "   Passenger: passenger1 / passenger123"
echo ""
echo "💡 Both servers are running in background"
echo "💡 Check logs if needed: tail -f backend.log frontend.log"

# Save PIDs for later cleanup
echo $BACKEND_PID > /tmp/baggage_tracker_backend.pid
echo $FRONTEND_PID > /tmp/baggage_tracker_frontend.pid

echo "🎉 Smart Baggage Tracker is now running!"