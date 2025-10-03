# Smart Baggage Tracker – Entebbe Airport System

A comprehensive full-stack baggage tracking system built for Entebbe International Airport hackathon, featuring real-time updates, QR code scanning, and staff management capabilities.

## 🚀 Features

### For Passengers
- **QR Code Scanning**: Scan baggage QR codes to track status in real-time
- **Real-time Updates**: Get instant notifications when baggage status changes
- **Timeline View**: See complete journey of baggage from check-in to arrival
- **Mobile-First Design**: PWA-enabled responsive design for mobile devices
- **Multi-language Support**: Aviation-themed UI with clear status indicators

### For Staff
- **Staff Dashboard**: Comprehensive overview of all baggage operations
- **Status Management**: Update baggage status with location and notes
- **Search & Filter**: Find baggage by passenger name, QR code, or flight number
- **Real-time Analytics**: Dashboard statistics and recent activity monitoring
- **Role-based Access**: Secure authentication with staff/passenger roles

### Technical Features
- **Real-time Communication**: WebSocket connections for instant updates
- **QR Code Generation**: Automatic QR code creation for each baggage item
- **JWT Authentication**: Secure token-based authentication system
- **RESTful API**: Comprehensive API endpoints for all operations
- **Database Seeding**: Sample data generation for testing and demonstration

## 🏗️ Architecture

### Backend (Django + DRF)
- **Django 5.0** with Django REST Framework
- **Django Channels** for WebSocket real-time communication
- **JWT Authentication** with role-based permissions
- **SQLite Database** for demo purposes
- **QR Code Generation** using Python qrcode library
- **Comprehensive API** with pagination and filtering

### Frontend (Next.js 15)
- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS** with aviation theme colors
- **React Context** for state management
- **QR Scanner** integration for mobile devices
- **WebSocket Client** for real-time updates
- **PWA Capabilities** for mobile app experience

## 📦 Installation & Setup

### Prerequisites
- Python 3.12+
- Node.js 18+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AeroUTAMU2/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install Django==5.0 djangorestframework==3.14.0 channels==4.0.0 channels-redis==4.2.0 djangorestframework-simplejwt==5.3.0 django-cors-headers==4.3.1 qrcode[pil]==7.4.2 Pillow==10.1.0 daphne==4.0.0
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

7. **Start the development server**
   ```bash
   python manage.py runserver
   ```

The Django backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The Next.js frontend will be available at `http://localhost:3000`

After running the seeding command, these users will be available:

### Admin
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Admin (full access)

### Staff Users
- **Username**: `staff1` | **Password**: `staff123` | **Department**: Baggage Handling
- **Username**: `staff2` | **Password**: `staff123` | **Department**: Security
- **Username**: `staff3` | **Password**: `staff123` | **Department**: Ground Operations

### Passenger Users
- **Username**: `passenger1` | **Password**: `passenger123`
- **Username**: `passenger2` | **Password**: `passenger123`

## 🏃‍♂️ Running the System

### Development Mode

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   python manage.py runserver
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Django Admin: http://localhost:8000/admin

### Production Deployment

#### Backend (Django)
```bash
# Install production dependencies
pip install gunicorn

# Collect static files
python manage.py collectstatic

# Run with Gunicorn
gunicorn baggage_tracker.wsgi:application --bind 0.0.0.0:8000
```

#### Frontend (Next.js)
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📱 Mobile PWA

The frontend is configured as a Progressive Web App (PWA) with:
- **Installable**: Add to home screen capability
- **Offline Support**: Service worker for offline functionality
- **Mobile Optimized**: Touch-friendly interface with responsive design
- **QR Scanner**: Camera access for scanning QR codes

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Permissions**: Staff/Passenger/Admin role segregation
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Input Validation**: Comprehensive data validation on both frontend and backend
- **Token Refresh**: Automatic token refresh mechanism

## 🎯 Demo Scenarios

### Passenger Journey
1. Visit http://localhost:3000
2. Register as a new user or login
3. Go to "Track Baggage" and scan/enter QR code
4. View real-time baggage status and timeline

### Staff Operations
1. Login with staff credentials
2. Access staff dashboard at http://localhost:3000/staff
3. View all baggage and statistics
4. Search for specific baggage
5. Update baggage status with location and notes
6. Real-time updates are sent to passengers

## 🛠️ Technology Stack

### Backend
- **Django 5.0** - Web framework
- **Django REST Framework** - API development
- **Django Channels** - WebSocket support
- **SQLite** - Database
- **JWT** - Authentication
- **Pillow** - Image processing
- **qrcode** - QR code generation

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Socket.io Client** - WebSocket client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
