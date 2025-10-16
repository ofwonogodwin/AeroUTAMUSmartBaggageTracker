# 🛠️ Backend - AERO UTAMU Smart Baggage Tracker

**Django 5.0 REST API with Real-time WebSocket Support**

This is the backend API server for the AERO UTAMU Smart Baggage Tracker system, built with Django 5.0, Django REST Framework, and Django Channels for real-time communication.

## 🚀 Features & Functionality

### 🔐 Authentication System
- **JWT Authentication** with djangorestframework-simplejwt
- **Role-based Access Control** (Admin, Staff, Passenger)
- **Secure Token Management** with refresh token rotation
- **Staff Login Verification** with department validation
- **User Registration** with email validation
- **Password Security** with Django's built-in hashing

### 🧳 Baggage Management
- **Complete CRUD Operations** for baggage items
- **QR Code Generation** with professional design
- **Status Tracking** with timeline functionality
- **Real-time Updates** via WebSocket connections
- **Search & Filtering** by multiple criteria
- **Location Tracking** with timestamp records
- **Staff Notes** and operational comments

### 📊 Staff Dashboard
- **Real-time Statistics** for baggage operations
- **Status Distribution** analytics
- **Recent Activity** monitoring
- **Performance Metrics** and reporting
- **Filter Operations** by date, status, flight

### 🔄 Real-time Features
- **WebSocket Support** using Django Channels
- **Live Status Updates** pushed to connected clients
- **Instant Notifications** for status changes
- **Multi-client Synchronization** across all connected devices

## 🛠️ Technical Stack

### Core Framework
- **Django 5.0** - Python web framework
- **Django REST Framework 3.14.0** - API development
- **Python 3.12+** - Programming language
- **SQLite** - Database (development)
- **ASGI/Daphne** - Async server support

### Authentication & Security
- **djangorestframework-simplejwt 5.3.0** - JWT tokens
- **django-cors-headers 4.3.1** - CORS handling
- **Django's built-in security** - CSRF, XSS protection
- **Role-based permissions** - Custom permission classes

### Real-time Communication
- **Django Channels 4.0.0** - WebSocket support
- **channels-redis 4.2.0** - Redis channel layer
- **Daphne 4.0.0** - ASGI HTTP/WebSocket server

### QR Code & Image Processing
- **qrcode[pil] 7.4.2** - QR code generation
- **Pillow 10.1.0** - Image processing
- **Professional QR Design** - Custom styling and branding

## 📁 Project Structure

```
backend/
├── manage.py                      # Django management script
├── requirements-prod.txt          # Production dependencies
├── requirements-dev.txt           # Development dependencies (includes prod)
├── update_qr_codes.py            # QR code generation script
├── create_passenger_accounts.py   # User account creation script
├── baggage_tracker/              # Django project settings
│   ├── __init__.py
│   ├── settings.py               # Django configuration
│   ├── urls.py                   # URL routing
│   ├── wsgi.py                   # WSGI application
│   └── asgi.py                   # ASGI application (WebSocket)
└── tracking/                     # Main Django app
    ├── __init__.py
    ├── admin.py                  # Django admin interface
    ├── apps.py                   # App configuration
    ├── models.py                 # Database models
    ├── serializers.py            # DRF serializers
    ├── views.py                  # API view handlers
    ├── urls.py                   # App URL patterns
    ├── auth_views.py             # Authentication views
    ├── consumers.py              # WebSocket consumers
    ├── routing.py                # WebSocket routing
    ├── tests.py                  # Unit tests
    ├── management/               # Custom management commands
    │   └── commands/
    │       └── seed_baggage_data.py  # Database seeding
    └── migrations/               # Database migrations
        ├── __init__.py
        └── 0001_initial.py       # Initial database schema
```

## 🔧 Installation & Setup

### Prerequisites
- **Python 3.12+** (recommended: Python 3.12)
- **pip** package manager
- **Virtual environment** support
- **Redis** (for WebSocket channel layer - optional for development)

### Installation Steps

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   
   # Activate virtual environment
   # Linux/Mac:
   source .venv/bin/activate
   
   # Windows:
   .venv\Scripts\activate
   ```

3. **Install ALL dependencies (REQUIRED)**
   ```bash
   # Install development dependencies (includes all production dependencies)
   pip install -r requirements-dev.txt
   
   # Or install production dependencies only
   pip install -r requirements-prod.txt
   ```

4. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create sample data and user accounts (REQUIRED for demo)**
   ```bash
   # Create 20 baggage items with passenger accounts
   python manage.py seed_baggage_data --baggage-count=20
   
   # Generate scannable QR codes for all baggage
   python update_qr_codes.py
   
   # Create passenger user accounts (25 accounts)
   python create_passenger_accounts.py
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the development server**
   ```bash
   python manage.py runserver
   ```

8. **Verify installation**
   - API Health Check: http://localhost:8000/api/health/
   - Django Admin: http://localhost:8000/admin/
   - API Documentation: http://localhost:8000/api/

## 📦 Dependencies Overview

### Production Dependencies (requirements-prod.txt)
```txt
Django==5.0                          # Web framework
djangorestframework==3.14.0          # REST API framework
djangorestframework-simplejwt==5.3.0 # JWT authentication
channels==4.0.0                      # WebSocket support
channels-redis==4.2.0                # Redis channel layer
daphne==4.0.0                        # ASGI server
django-cors-headers==4.3.1           # CORS handling
Pillow==10.1.0                       # Image processing
qrcode[pil]==7.4.2                   # QR code generation
```

### Development Dependencies (requirements-dev.txt)
```txt
# Includes all production dependencies plus:
django-debug-toolbar==4.2.0          # Development debugging
django-extensions==3.2.3             # Additional Django commands
```

## 🌐 API Endpoints

### Authentication Endpoints
```
POST /api/auth/login/                 # User login (passengers)
POST /api/auth/staff-login/           # Staff login with role verification
POST /api/auth/register/              # User registration
POST /api/auth/refresh/               # JWT token refresh
GET  /api/auth/user/                  # Get current user information
POST /api/auth/logout/                # Logout and blacklist tokens
GET  /api/auth/profile/               # User profile management
```

### Baggage Management Endpoints
```
GET  /api/baggage/                    # List all baggage (with search & filters)
POST /api/baggage/                    # Create new baggage entry
GET  /api/baggage/<uuid:id>/          # Get specific baggage details
GET  /api/baggage/qr/<str:qr_code>/   # Get baggage by QR code
POST /api/baggage/<uuid:id>/update/   # Update baggage status (staff only)
GET  /api/baggage/<uuid:id>/timeline/ # Get baggage status timeline
```

### Staff Dashboard Endpoints
```
GET  /api/staff/dashboard/stats/      # Dashboard statistics and analytics
```

### System Endpoints
```
GET  /api/health/                     # API health check and status
```

### Query Parameters for Baggage List
```
GET /api/baggage/?search=passenger_name    # Search by passenger name
GET /api/baggage/?qr_code=BAG-12345       # Filter by QR code
GET /api/baggage/?status=CHECKED_IN        # Filter by status
GET /api/baggage/?flight=KL566             # Filter by flight number
GET /api/baggage/?page=2                   # Pagination
GET /api/baggage/?page_size=20             # Items per page
```

## 🔌 WebSocket Endpoints

### Real-time Communication
```
ws://localhost:8000/ws/baggage/<baggage_id>/  # Subscribe to specific baggage updates
ws://localhost:8000/ws/notifications/         # General system notifications
ws://localhost:8000/ws/staff/dashboard/       # Staff dashboard real-time updates
```

### WebSocket Message Types
```json
// Baggage status update
{
  "type": "baggage_update",
  "baggage_id": "uuid",
  "status": "LOADED",
  "location": "Gate A12",
  "timestamp": "2025-10-03T15:30:00Z"
}

// System notification
{
  "type": "notification",
  "message": "New baggage checked in",
  "level": "info"
}
```

## 🗄️ Database Models

### User Model (Extended)
```python
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    employee_id = models.CharField(max_length=50, blank=True)
    department = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

### Baggage Model
```python
class Baggage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    qr_code = models.CharField(max_length=20, unique=True)
    passenger_name = models.CharField(max_length=255)
    passenger_email = models.EmailField()
    flight_number = models.CharField(max_length=10)
    destination = models.CharField(max_length=100)
    current_status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### Status Update Model
```python
class StatusUpdate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    baggage = models.ForeignKey(Baggage, on_delete=models.CASCADE, related_name='status_timeline')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    location = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
```

## 👥 User Management

### Default User Accounts

#### System Administrator
```
Username: admin
Password: admin123
Role: ADMIN
Permissions: Full system access
```

#### Staff Accounts
```
Username: staff1     | Password: staff123 | Department: Baggage Handling
Username: staff2     | Password: staff123 | Department: Security  
Username: staff3     | Password: staff123 | Department: Ground Operations
```

#### Passenger Accounts (25 accounts)
```
Username: adamyoung      | Password: adam2024    | Email: adam.young@email.com
Username: alicejohnson   | Password: alice2024   | Email: alice.johnson@email.com
Username: henrymoore     | Password: henry2024   | Email: henry.moore@email.com
Username: frankmiller    | Password: frank2024   | Email: frank.miller@email.com
... (21 more accounts - see passenger_accounts.txt)
```

### User Roles & Permissions

#### ADMIN Role
- Full system access
- User management
- System configuration
- All baggage operations

#### STAFF Role
- View all baggage items
- Update baggage status
- Add location and notes
- Access staff dashboard
- Real-time monitoring

#### PASSENGER Role
- Track own baggage by QR code
- View baggage timeline
- Receive real-time updates
- Access tracking interface

## 🔒 Security Features

### Authentication Security
- **JWT Tokens** with secure signing
- **Token Expiration** (15 min access, 7 days refresh)
- **Token Blacklisting** on logout
- **Password Hashing** with Django's PBKDF2
- **Role-based Access Control** on all endpoints

### API Security
- **CORS Configuration** for frontend origin
- **Request Rate Limiting** (planned)
- **Input Validation** with DRF serializers
- **SQL Injection Protection** with Django ORM
- **XSS Protection** with Django middleware

### Data Security
- **UUID Primary Keys** to prevent enumeration
- **Sensitive Data Filtering** in API responses
- **Audit Trail** with timestamp tracking
- **User Attribution** for all status updates

## 🧪 Testing & Development

### Management Commands

#### Database Seeding
```bash
# Create sample baggage data
python manage.py seed_baggage_data --baggage-count=20

# Clear existing data and reseed
python manage.py seed_baggage_data --baggage-count=20 --clear
```

#### QR Code Generation
```bash
# Generate QR codes for all baggage
python update_qr_codes.py

# Output: Professional QR codes in qr_codes/ directory
# Format: JSON data with baggage information
```

#### User Account Creation
```bash
# Create 25 passenger accounts with baggage associations
python create_passenger_accounts.py

# Output: passenger_accounts.txt with all credentials
```

### Testing Endpoints
```bash
# Health check
curl http://localhost:8000/api/health/

# User login test
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "adamyoung", "password": "adam2024"}'

# Get baggage by QR code
curl http://localhost:8000/api/baggage/qr/BAG-1F0C5581/
```

## 🚀 Production Deployment

### Production Settings
```python
# settings.py (production overrides)
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        # PostgreSQL configuration
    }
}
```

### Production Server
```bash
# Install production server
pip install gunicorn

# Collect static files
python manage.py collectstatic

# Run with Gunicorn
gunicorn baggage_tracker.wsgi:application --bind 0.0.0.0:8000

# For WebSocket support
daphne -b 0.0.0.0 -p 8000 baggage_tracker.asgi:application
```

### Environment Variables
```bash
export DJANGO_SECRET_KEY="your-secret-key"
export DJANGO_DEBUG="False"  
export DATABASE_URL="postgresql://user:pass@localhost/dbname"
export REDIS_URL="redis://localhost:6379/0"
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Migration Errors**
   ```bash
   # Reset database
   rm db.sqlite3
   python manage.py migrate
   python manage.py seed_baggage_data --baggage-count=20
   ```

2. **Import Errors for Packages**
   ```bash
   # Ensure virtual environment is activated
   source .venv/bin/activate
   
   # Reinstall dependencies
   pip install -r requirements-dev.txt
   ```

3. **WebSocket Connection Issues**
   ```bash
   # Check if Daphne/Channels is properly configured
   python manage.py runserver
   # Should show: "Starting ASGI/Daphne version"
   ```

4. **QR Code Generation Issues**
   ```bash
   # Ensure Pillow is installed for image processing
   pip install Pillow==10.1.0
   
   # Run QR generation manually
   python update_qr_codes.py
   ```

5. **Permission Denied Errors**
   ```bash
   # Check user authentication
   python manage.py shell -c "from django.contrib.auth.models import User; print(User.objects.all())"
   ```

## 📊 Performance & Monitoring

### Database Optimization
- **Database Indexing** on frequently queried fields
- **Query Optimization** with select_related/prefetch_related
- **Pagination** for large datasets
- **Connection Pooling** for production

### Caching Strategy
- **Django Cache Framework** integration ready
- **Redis Caching** for frequent API calls
- **Query Result Caching** for dashboard statistics
- **Static File Caching** with proper headers

### Monitoring Points
- **API Response Times** for all endpoints
- **Database Query Performance** monitoring
- **WebSocket Connection** health checks
- **Memory Usage** for QR generation processes

## 🔄 Development Workflow

### Code Quality
```bash
# Django checks
python manage.py check

# Run tests
python manage.py test

# Database migrations
python manage.py makemigrations
python manage.py migrate
```

### API Development
1. **Model Changes** → Update models.py
2. **Create Migrations** → `makemigrations`
3. **Run Migrations** → `migrate`
4. **Update Serializers** → Add/modify serializers.py
5. **Update Views** → Modify views.py
6. **Test Endpoints** → Use curl/Postman
7. **Update Documentation** → Update README.md

## 📈 Future Enhancements

### Planned Features
- **PostgreSQL Migration** for production scalability
- **Redis Integration** for improved WebSocket performance
- **API Rate Limiting** with django-ratelimit
- **Email Notifications** for status updates
- **Bulk Operations** for staff efficiency
- **Advanced Analytics** with more detailed reporting

### Integration Possibilities
- **Airport Systems Integration** via REST APIs
- **Flight Information Systems** real-time data
- **Notification Services** (SMS, Email, Push)
- **Barcode Scanner Integration** beyond QR codes
- **Mobile App APIs** for native applications

---

**Backend API built with Django for enterprise-grade aviation operations** ✈️