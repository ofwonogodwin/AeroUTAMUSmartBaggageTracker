#  AERO UTAMU Smart Baggage Tracker

**Professional Aviation Baggage Management System for Entebbe International Airport**

A comprehensive full-stack baggage tracking solution featuring real-time updates, professional QR code scanning, staff operations dashboard, and seamless passenger experience built with modern web technologies.

---

##  System Overview

###  For Passengers
- **QR Code Scanning**: Real-time camera scanning with file upload support
- **Baggage Tracking**: Complete timeline from check-in to arrival
- **Real-time Updates**: Live status notifications via WebSocket
- **Mobile Optimized**: PWA-enabled responsive design
- **User Authentication**: Secure registration and login system

###  For Staff
- **Operations Dashboard**: Complete overview of all 40+ baggage items
- **Status Management**: Update baggage status with location and notes
- **Search & Filter**: Find baggage by name, QR code, or flight number
- **Real-time Analytics**: Live statistics and activity monitoring
- **QR Scanner Integration**: Quick baggage lookup via mobile scanning

###  Technical Architecture
- **Backend**: Django 5.0 + DRF + WebSocket (Channels)
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Authentication**: JWT with role-based access control
- **Real-time**: WebSocket connections for live updates
- **Database**: SQLite (dev) / PostgreSQL (production ready)
- **QR System**: Professional scannable codes with JSON data

---

##  Design & Features

### Aviation-Themed Interface
- **Deep Blue** (#003366) - Primary navigation and headers
- **Sky Blue** (#0096FF) - Action buttons and interactive elements
- **Gold** (#FFD700) - Accent colors and status highlights
- **Professional Layout** - Clean, modern aviation industry design

### Advanced Functionality
- **25 Pre-registered Passenger Accounts** with realistic data
- **40 Baggage Items** across various flight routes and statuses
- **Professional QR Codes** (810x810px) with scannable JSON data
- **Real-time WebSocket** updates across all connected clients
- **Mobile PWA** capabilities with offline support
- **Camera Integration** for QR scanning on mobile devices

---

##  Quick Start Installation

### Prerequisites
- **Python 3.12+** and **Node.js 18+**
- **Git** for version control
- **Terminal/Command Prompt** access

###  Backend Setup (Django API)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# OR: .venv\Scripts\activate  # Windows

# 3. Install ALL backend dependencies (REQUIRED)
pip install -r requirements-dev.txt

# 4. Run database migrations
python manage.py migrate

# 5. Create sample data and user accounts (REQUIRED for demo)
python manage.py seed_baggage_data --baggage-count=20
python update_qr_codes.py
python create_passenger_accounts.py

# 6. Start Django server
python manage.py runserver
```

**Backend runs at**: `http://localhost:8000`

###  Frontend Setup (Next.js UI)

```bash
# 1. Navigate to frontend directory (new terminal)
cd frontend

# 2. Install ALL frontend dependencies (REQUIRED)
npm install

# 3. Create environment configuration
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
echo "NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws" >> .env.local

# 4. Start Next.js development server
npm run dev
```

**Frontend runs at**: `http://localhost:3000`

---

##  Demo Access & Testing

###  Ready-to-Use Accounts

#### Staff Access (Full System Control)
```
Username: staff1
Password: staff123
URL: http://localhost:3000/staff-login
Features: View all baggage, update status, real-time dashboard
```

#### Sample Passenger Accounts
```
Username: adamyoung       | Password: adam2024    | Bags: 2
Username: alicejohnson    | Password: alice2024   | Bags: 2  
Username: henrymoore      | Password: henry2024   | Bags: 1
Username: frankmiller     | Password: frank2024   | Bags: 3
```

*See `backend/passenger_accounts.txt` for complete list of 25 accounts*

#### System Administrator
```
Username: admin
Password: admin123
URL: http://localhost:8000/admin
Features: Django admin interface, full system control
```

###  Sample QR Codes for Testing
```
BAG-1F0C5581  (Henry Moore - Flight TK742 → London)
BAG-65B24C93  (Ruby Martinez - Flight DL439 → Paris) 
BAG-2106F8F3  (Alice Johnson - Flight QR434 → Paris)
BAG-F781DD59  (Emma Davis - Flight DL439 → Atlanta)
```

*All QR codes available in `backend/qr_codes/` directory*

---

##  Complete API Reference

### Authentication Endpoints
```http
POST /api/auth/login/                 # Passenger login
POST /api/auth/staff-login/           # Staff login with role verification
POST /api/auth/register/              # User registration
POST /api/auth/refresh/               # JWT token refresh
GET  /api/auth/user/                  # Current user information
POST /api/auth/logout/                # Secure logout
```

### Baggage Management
```http
GET  /api/baggage/                    # List all baggage (with pagination)
GET  /api/baggage/qr/{qr_code}/       # Get baggage by QR code
POST /api/baggage/{id}/update/        # Update status (staff only)
GET  /api/baggage/{id}/timeline/      # Status timeline
GET  /api/staff/dashboard/stats/      # Dashboard analytics
```

### Real-time WebSocket
```websocket
ws://localhost:8000/ws/baggage/{id}/      # Baggage-specific updates
ws://localhost:8000/ws/notifications/     # System notifications
ws://localhost:8000/ws/staff/dashboard/   # Staff dashboard updates
```

### System Health
```http
GET  /api/health/                     # API health check
```

---

##  Development & Testing Workflow

### Backend Development
```bash
# Activate environment
source .venv/bin/activate

# Run tests
python manage.py test

# Check system
python manage.py check

# Create migrations
python manage.py makemigrations

# Apply migrations  
python manage.py migrate

# Start server with debug
python manage.py runserver --verbosity=2
```

### Frontend Development
```bash
# Development with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Production build test
npm run build && npm start
```

### Testing Scenarios

#### Passenger Journey Test
1. Visit `http://localhost:3000/login`
2. Login with `adamyoung` / `adam2024`
3. Go to "Track Baggage" 
4. Scan/enter QR: `BAG-85D37765` or `BAG-CD0BE473`
5. View real-time status and timeline

#### Staff Operations Test  
1. Visit `http://localhost:3000/staff-login`
2. Login with `staff1` / `staff123`
3. View dashboard with all 40+ baggage items
4. Search for specific passenger or flight
5. Update baggage status and add notes
6. Verify real-time updates to passengers

---

##  System Statistics

### Data Volume
- **User Accounts**: 25 passengers + 3 staff + 1 admin = 29 total
- **Baggage Items**: 40 bags with complete tracking data
- **QR Codes**: Professional 810x810px codes with JSON data
- **Status Updates**: Comprehensive timeline for each bag
- **Flights**: 15 different flight numbers to major destinations

### Technical Specifications
- **Backend**: Django 5.0, Python 3.12+, SQLite database
- **Frontend**: Next.js 15, React 19, TypeScript 5.7
- **Real-time**: WebSocket support via Django Channels
- **Authentication**: JWT tokens with role-based permissions
- **API**: RESTful design with comprehensive documentation

---

##  Production Deployment

### Backend (Django) Production
```bash
# Install production dependencies
pip install -r requirements-prod.txt

# Configure environment variables
export DJANGO_SECRET_KEY="your-secret-key"
export DJANGO_DEBUG="False"
export DATABASE_URL="postgresql://..."

# Collect static files
python manage.py collectstatic

# Run with production server
gunicorn baggage_tracker.wsgi:application --bind 0.0.0.0:8000

# For WebSocket support
daphne -b 0.0.0.0 -p 8000 baggage_tracker.asgi:application
```

### Frontend (Next.js) Production
```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
npx vercel --prod
```

---

##  Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure access and refresh token system
- **Role-based Access**: Admin, Staff, Passenger role separation
- **Token Blacklisting**: Secure logout with token invalidation
- **Password Security**: Django PBKDF2 hashing

### API Security
- **CORS Configuration**: Proper cross-origin setup
- **Input Validation**: DRF serializer validation
- **SQL Injection Protection**: Django ORM security
- **XSS Protection**: Built-in Django middleware

### Data Protection
- **UUID Primary Keys**: Prevent ID enumeration attacks
- **Audit Trail**: Complete tracking of all status updates
- **Sensitive Data Filtering**: Protected information handling

---

##  Troubleshooting Guide

### Common Backend Issues
```bash
# Database issues
rm db.sqlite3
python manage.py migrate
python manage.py seed_baggage_data --baggage-count=20

# Package issues
pip install -r requirements-dev.txt

# QR code generation issues
python update_qr_codes.py
```

### Common Frontend Issues
```bash
# Dependency issues
rm -rf node_modules package-lock.json
npm install

# Build issues
npm run type-check
npm run lint

# Environment issues
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
```

### Connection Issues
1. **Backend not accessible**: Ensure Django server is running on port 8000
2. **Frontend not loading**: Check Next.js server on port 3000
3. **API calls failing**: Verify CORS settings and environment variables
4. **WebSocket connection failed**: Ensure Django Channels is properly configured

---

##  Future Enhancements

### Planned Features
- **Push Notifications**: Browser notifications for status updates
- **Email Integration**: Automated email alerts for passengers
- **Multi-language Support**: Internationalization for global use
- **Advanced Analytics**: Detailed reporting and performance metrics
- **Mobile Apps**: Native iOS and Android applications
- **Integration APIs**: Connect with existing airport systems

### Scalability Improvements
- **PostgreSQL Migration**: Enterprise database support
- **Redis Integration**: Enhanced WebSocket performance
- **Load Balancing**: Multi-server deployment support
- **CDN Integration**: Global content delivery
- **Microservices Architecture**: Scalable service separation

---

##  Support & Documentation

### Resources
- **API Documentation**: `http://localhost:8000/api/`
- **Django Admin**: `http://localhost:8000/admin/`
- **Frontend Documentation**: See `frontend/README.md`
- **Backend Documentation**: See `backend/README.md`

### Getting Help
1. **Check troubleshooting section** above
2. **Review terminal output** for error messages
3. **Verify all dependencies** are installed correctly
4. **Test with provided sample accounts** and QR codes
5. **Check network connectivity** between frontend and backend

---

##  Demo Success Checklist

###  Backend Verification
- [ ] Django server running on `http://localhost:8000`
- [ ] Health check returns success: `http://localhost:8000/api/health/`
- [ ] 40 baggage items created with QR codes
- [ ] 25 passenger accounts created
- [ ] Staff login working: `staff1` / `staff123`

###  Frontend Verification  
- [ ] Next.js server running on `http://localhost:3000`
- [ ] Passenger login working with sample accounts
- [ ] QR scanner functional with camera and file upload
- [ ] Staff dashboard showing all baggage items
- [ ] Real-time updates working between staff and passenger views

###  Integration Testing
- [ ] Scan QR code `BAG-1F0C5581` successfully
- [ ] Update baggage status from staff dashboard
- [ ] Verify passenger sees real-time status update
- [ ] Test search and filtering functionality
- [ ] Confirm mobile responsiveness

---

** Ready for takeoff! Your professional aviation baggage tracking system is now fully operational.**

**Built  for Entebbe International Airport Hackathon 2025**
