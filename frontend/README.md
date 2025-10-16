# 🎨 Frontend - AERO UTAMU Smart Baggage Tracker

**Next.js 15 Frontend Application with TypeScript & Aviation Theme**

This is the frontend application for the AERO UTAMU Smart Baggage Tracker system, built with Next.js 15, TypeScript, and Tailwind CSS with a professional aviation theme.

## 🚀 Features & Functionality

### 🎫 Passenger Features
- **User Authentication**
  - Registration with email validation
  - Secure login with JWT tokens
  - Password recovery system
  - User profile management

- **QR Code Scanning**
  - Real-time camera scanning using device camera
  - File upload support for QR code images
  - Automatic baggage code extraction from JSON data
  - Compatible with all mobile devices and browsers

- **Baggage Tracking**
  - Real-time baggage status updates
  - Complete timeline view from check-in to arrival
  - Flight information display
  - Location tracking with timestamps
  - Staff notes and comments

### 👨‍✈️ Staff Features
- **Staff Dashboard**
  - Overview of all baggage items (displays all 40+ bags)
  - Real-time statistics and analytics
  - Recent activity feed
  - Status distribution charts

- **Baggage Operations**
  - Update baggage status with location and notes
  - Search by passenger name, QR code, or flight number
  - Filter by status (CHECKED_IN, SECURITY_CLEARED, LOADED, IN_FLIGHT, ARRIVED)
  - Bulk operations and reporting

- **QR Scanner Integration**
  - Staff can scan QR codes for quick baggage lookup
  - Camera management with auto-disable after scanning
  - Mobile-optimized scanning interface

### 🎨 UI/UX Features
- **Aviation Theme Design**
  - Professional aviation color scheme (Deep Blue, Sky Blue, Gold)
  - Responsive design for all screen sizes
  - Mobile-first approach with touch-friendly interfaces
  - Aviation-inspired icons and typography

- **Real-time Updates**
  - WebSocket connections for instant updates
  - Live status changes without page refresh
  - Push notifications for important events
  - Offline support with service worker

## 🛠️ Technical Stack

### Core Technologies
- **Next.js 15.0.4** - React framework with App Router
- **React 19.0.0** - UI library with latest features
- **TypeScript 5.7.3** - Type safety and developer experience
- **Tailwind CSS 3.4.17** - Utility-first CSS framework

### Key Dependencies
```json
{
  "next": "15.0.4",
  "react": "19.0.0",
  "typescript": "5.7.3",
  "tailwindcss": "3.4.17",
  "qr-scanner": "1.4.2",
  "axios": "1.7.9",
  "lucide-react": "0.468.0"
}
```

### Scanner & Camera
- **qr-scanner@1.4.2** - Professional QR code scanning library
- Camera API integration for mobile devices
- File upload support for QR images
- Real-time detection with JSON data parsing

### HTTP & API
- **axios@1.7.9** - HTTP client with interceptors
- JWT token management
- Request/response interceptors
- Error handling and retry logic

### Icons & UI
- **lucide-react@0.468.0** - Beautiful, consistent icons
- Custom aviation-themed components
- Responsive design patterns
- Professional status badges

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout with navigation
│   │   ├── page.tsx           # Home page
│   │   ├── login/             # Passenger login
│   │   ├── register/          # User registration
│   │   ├── staff-login/       # Staff authentication
│   │   ├── staff/             # Staff dashboard
│   │   └── track/             # Baggage tracking
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   │   ├── Button.tsx    # Styled buttons
│   │   │   ├── FormElements.tsx # Input, Select components
│   │   │   ├── LoadingSpinner.tsx # Loading states
│   │   │   └── StatusBadge.tsx # Status indicators
│   │   ├── QRScanner.tsx     # QR scanning component
│   │   └── AccountDropdown.tsx # User menu
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Authentication state
│   ├── lib/                  # Utilities and API
│   │   ├── api.ts           # API client and endpoints
│   │   └── utils.ts         # Utility functions
│   └── types/               # TypeScript definitions
│       └── index.ts         # Shared type definitions
├── public/                   # Static assets
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── next.config.ts          # Next.js configuration
```

## 🔧 Installation & Setup

### Prerequisites
- **Node.js 18+** (recommended: Node.js 20 LTS)
- **npm** or **yarn** package manager
- Backend API running on `http://localhost:8000`

### Installation Steps

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install ALL dependencies (REQUIRED)**
   ```bash
   # This will install all packages from package.json
   npm install
   
   # Alternative with yarn
   yarn install
   ```

3. **Environment Configuration**
   ```bash
   # Create environment file
   cp .env.example .env.local
   
   # Edit .env.local with your settings
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   
   # Or with yarn
   yarn dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Login Page: http://localhost:3000/login
   - Staff Dashboard: http://localhost:3000/staff
   - Track Baggage: http://localhost:3000/track

## 🌐 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Linting with auto-fix
npm run lint:fix
```

## 🎯 Usage Guide

### For Passengers
1. **Registration/Login**
   - Visit http://localhost:3000/login
   - Register with email or use existing account
   - Credentials available in `../backend/passenger_accounts.txt`

2. **Track Baggage**
   - Go to "Track Baggage" page
   - Scan QR code using camera or upload image
   - View real-time status and timeline

### For Staff
1. **Staff Login**
   - Visit http://localhost:3000/staff-login
   - Use staff credentials (staff1/staff123)
   - Access comprehensive dashboard

2. **Manage Baggage**
   - View all baggage items in dashboard
   - Search and filter baggage
   - Update status with location and notes
   - Use QR scanner for quick lookup

## 🔐 Authentication System

### JWT Token Management
- **Access Token**: Short-lived (15 minutes)
- **Refresh Token**: Long-lived (7 days)
- **Automatic Refresh**: Handles token refresh automatically
- **Secure Storage**: Tokens stored in httpOnly cookies (production)

### User Roles
- **PASSENGER**: Can track own baggage
- **STAFF**: Can manage all baggage operations
- **ADMIN**: Full system access

### Protected Routes
- `/staff/*` - Staff only
- `/track` - Authenticated users only
- Public routes: `/`, `/login`, `/register`, `/staff-login`

## 📱 Mobile Features

### PWA Capabilities
- **Installable**: Add to home screen
- **Offline Support**: Service worker for offline functionality
- **Mobile Optimized**: Touch-friendly interface

### Camera Integration
- **Real-time Scanning**: Uses device camera for QR scanning
- **Permission Handling**: Requests camera permissions properly
- **Fallback Support**: File upload if camera unavailable
- **Auto-disable**: Camera stops after successful scan

## 🎨 Design System

### Aviation Color Palette
```css
/* Primary Colors */
--deep-blue: #003366;      /* Navigation, headers */
--sky-blue: #0096FF;       /* Buttons, links */
--gold: #FFD700;           /* Accents, highlights */
--light-gray: #F8FAFC;     /* Backgrounds */

/* Status Colors */
--success: #10B981;        /* Arrived, Success states */
--warning: #F59E0B;        /* In transit, Loading */
--info: #3B82F6;          /* Checked in, Info */
--error: #EF4444;         /* Errors, Critical states */
```

### Component Library
- **Buttons**: Primary, secondary, outline variants
- **Forms**: Input, select, textarea with validation
- **Status Badges**: Color-coded status indicators
- **Loading States**: Spinners and skeleton loaders
- **Navigation**: Responsive navbar with user menu

## 🔌 API Integration

### Main API Endpoints
```typescript
// Authentication
POST /api/auth/login/           // User login
POST /api/auth/staff-login/     // Staff login
POST /api/auth/register/        // User registration
GET  /api/auth/user/           // Current user info

// Baggage Management
GET  /api/baggage/             // List all baggage
GET  /api/baggage/qr/{code}/   // Get by QR code
POST /api/baggage/{id}/update/ // Update status (staff)

// Dashboard
GET  /api/staff/dashboard/stats/ // Dashboard statistics
```

### Request/Response Handling
- **Automatic Token Refresh**: Handles expired tokens
- **Error Handling**: User-friendly error messages
- **Loading States**: Proper loading indicators
- **Retry Logic**: Automatic retry on network errors

## 🧪 Testing Credentials

Use these accounts for testing (from `passenger_accounts.txt`):

### Sample Passengers
```
Username: adamyoung      | Password: adam2024    | Email: adam.young@email.com
Username: alicejohnson   | Password: alice2024   | Email: alice.johnson@email.com
Username: henrymoore     | Password: henry2024   | Email: henry.moore@email.com
Username: frankmiller    | Password: frank2024   | Email: frank.miller@email.com
```

### Staff Account
```
Username: staff1         | Password: staff123    | Department: Baggage Handling
```

### Sample QR Codes to Test
```
BAG-1F0C5581 (Henry Moore - Flight TK742 → London)
BAG-65B24C93 (Ruby Martinez - Flight DL439 → Paris)
BAG-2106F8F3 (Alice Johnson - Flight QR434 → Paris)
```

## 🚀 Deployment

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables
```bash
# Production environment
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_WS_URL=wss://your-api-domain.com/ws
NODE_ENV=production
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

## 🐛 Troubleshooting

### Common Issues

1. **QR Scanner Not Working**
   - Ensure HTTPS in production (camera requires secure context)
   - Check browser permissions for camera access
   - Try file upload fallback

2. **API Connection Issues**
   - Verify backend is running on http://localhost:8000
   - Check CORS settings in Django
   - Ensure .env.local is properly configured

3. **Authentication Problems**
   - Clear browser storage and cookies
   - Check if backend has proper user accounts
   - Verify JWT token expiration settings

4. **Build Errors**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again
   - Check TypeScript errors with `npm run type-check`

## 📊 Performance Features

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Caching**: Proper HTTP caching headers
- **Lazy Loading**: Components loaded on demand

## 🔄 Development Workflow

1. **Feature Development**
   ```bash
   git checkout -b feature/new-feature
   npm run dev          # Start development server
   npm run type-check   # Check TypeScript
   npm run lint         # Check code style
   ```

2. **Testing Changes**
   - Test with both passenger and staff accounts
   - Verify QR scanning on mobile device
   - Check responsive design on different screen sizes
   - Test all authentication flows

3. **Production Ready**
   ```bash
   npm run build        # Production build
   npm run start        # Test production build
   git commit -m "feat: add new feature"
   ```

## 📈 Future Enhancements

- **Push Notifications**: Browser notifications for status updates
- **Offline Mode**: Enhanced offline functionality
- **Multi-language**: Internationalization support
- **Dark Mode**: Dark theme option
- **Advanced Analytics**: User behavior tracking
- **Native Apps**: React Native mobile applications

---

**Frontend built with modern web technologies for professional aviation operations** ✈️
