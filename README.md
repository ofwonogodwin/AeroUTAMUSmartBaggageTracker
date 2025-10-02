# Smart Baggage Tracker – Entebbe Airport Hackathon System

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

## 🎨 Design Theme

**Aviation Colors:**
- Deep Blue (`#003366`) - Primary navigation and headers
- Sky Blue (`#0096FF`) - Action buttons and links
- Gold (`#FFD700`) - Accent colors and highlights
- Light Gray (`#F8FAFC`) - Background and neutral areas

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

5. **Create sample data (optional)**
   ```bash
   python manage.py seed_baggage_data --baggage-count 15
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
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

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/staff-login/` - Staff login with role verification
- `POST /api/auth/register/` - User registration
- `POST /api/auth/refresh/` - Token refresh
- `GET /api/auth/user/` - Get current user info
- `POST /api/auth/logout/` - Logout (blacklist token)

### Baggage Management
- `GET /api/baggage/` - List all baggage (with search & filters)
- `POST /api/baggage/` - Create new baggage entry
- `GET /api/baggage/{id}/` - Get specific baggage details
- `GET /api/baggage/qr/{qr_code}/` - Get baggage by QR code
- `POST /api/baggage/{id}/update/` - Update baggage status (staff only)
- `GET /api/baggage/{id}/timeline/` - Get baggage status timeline

### Staff Dashboard
- `GET /api/staff/dashboard/stats/` - Get dashboard statistics

### Health Check
- `GET /api/health/` - API health check

## 🔌 WebSocket Endpoints

### Real-time Baggage Updates
- `ws://localhost:8000/ws/baggage/{baggage_id}/` - Subscribe to specific baggage updates
- `ws://localhost:8000/ws/notifications/` - General notifications channel

## 👥 Default Users

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

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS settings include frontend URL
   - Check `CORS_ALLOWED_ORIGINS` in Django settings

2. **WebSocket Connection Failed**
   - Verify Django Channels is properly configured
   - Check if ASGI application is running correctly

3. **QR Scanner Not Working**
   - Ensure HTTPS in production (camera requires secure context)
   - Check browser permissions for camera access

4. **Database Issues**
   - Run migrations: `python manage.py migrate`
   - Reset database: Delete `db.sqlite3` and run migrations again

## 📈 Future Enhancements

- **Push Notifications**: Browser push notifications for status updates
- **Email Notifications**: Email alerts for baggage status changes
- **Multi-language Support**: Internationalization for multiple languages
- **Advanced Analytics**: Detailed reporting and analytics dashboard
- **Integration APIs**: Connect with existing airport systems
- **Mobile Apps**: Native iOS and Android applications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is developed for the Entebbe Airport Hackathon 2025.

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at http://localhost:8000/api

---

**Built with ❤️ for Entebbe International Airport Hackathon 2025**