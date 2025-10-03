# 🧳 AeroUTAMU Smart Baggage Tracker - User Test Guide

## 🖥️ **System Status**

- ✅ **Backend**: Running on http://localhost:8000
- ✅ **Frontend**: Running on http://localhost:3001
- ✅ **Database**: 20 baggage items with real-time tracking

---

## 👤 **Test User Accounts**

### **Passenger Login** (http://localhost:3001/login)

| **Passenger**     | **Username**   | **Password** | **QR Code(s)**                   | **Flight**                              | **Status**                    |
| ----------------- | -------------- | ------------ | -------------------------------- | --------------------------------------- | ----------------------------- |
| **Alice Johnson** | `alicejohnson` | `alice2024`  | `BAG-1FFBBA51`                   | BA728 to Doha                           | ✈️ In-Flight                  |
| **Bob Smith**     | `bobsmith`     | `bob2024`    | `BAG-7FAEBA2E`<br>`BAG-6F3453C7` | VS201 to Johannesburg<br>EK729 to Dubai | 🎯 Arrived<br>❓ Check Status |
| **David Brown**   | `davidbrown`   | `david2024`  | `BAG-B4DD6572`                   | DL439 to Frankfurt                      | ✅ Checked In                 |
| **Emma Davis**    | `emmadavis`    | `emma2024`   | `BAG-4E776A8D`                   | VS201 to Atlanta                        | ❓ Check Status               |
| **Fiona Scott**   | `fionascott`   | `fiona2024`  | `BAG-9B8507C4`                   | KL566 to Cairo                          | ✈️ In-Flight                  |

### **Staff Login** (http://localhost:3001/staff-login)

| **Staff** | **Username** | **Password** | **Role**             |
| --------- | ------------ | ------------ | -------------------- |
| **Admin** | `admin`      | `admin123`   | System Administrator |

---

## 🔍 **How to Test Baggage Tracking**

### **Method 1: Login as Passenger**

1. Go to http://localhost:3001/login
2. Use any passenger credentials above
3. View your baggage status and timeline

### **Method 2: Track by QR Code (No Login Required)**

1. Go to http://localhost:3001/track
2. Enter any QR code from the list above
3. View real-time baggage status

### **Method 3: Staff Dashboard**

1. Go to http://localhost:3001/staff-login
2. Login with admin credentials
3. View all baggage statistics and updates

---

## 📱 **Quick Test QR Codes**

Use these QR codes to test tracking without login:

```
BAG-1FFBBA51  ✈️ In-Flight (Alice Johnson → Doha)
BAG-7FAEBA2E  🎯 Arrived (Bob Smith → Johannesburg)
BAG-9B8507C4  ✈️ In-Flight (Fiona Scott → Cairo)
BAG-B4DD6572  ✅ Checked In (David Brown → Frankfurt)
BAG-4E776A8D  ❓ Unknown Status (Emma Davis → Atlanta)
```

---

## 🎯 **Testing Scenarios**

### **Scenario 1: Passenger Experience**

1. Login as **Alice Johnson** (`alicejohnson` / `alice2024`)
2. Check status of baggage `BAG-1FFBBA51`
3. View complete tracking timeline

### **Scenario 2: Multi-Baggage Passenger**

1. Login as **Bob Smith** (`bobsmith` / `bob2024`)
2. View multiple baggage items
3. Compare different statuses

### **Scenario 3: Guest Tracking**

1. Go to http://localhost:3001/track
2. Enter `BAG-9B8507C4` (Fiona's bag)
3. View tracking without account

### **Scenario 4: Staff Dashboard**

1. Login as **Admin** (`admin` / `admin123`)
2. View system statistics
3. Monitor all baggage activity

---

## 🌐 **Access URLs**

- **🏠 Homepage**: http://localhost:3001
- **🔐 Passenger Login**: http://localhost:3001/login
- **👨‍💼 Staff Login**: http://localhost:3001/staff-login
- **📍 Track Baggage**: http://localhost:3001/track
- **🔧 API Health**: http://localhost:8000/api/health/

---

## ✨ **Features to Test**

- ✅ **Clean Light Design** - Professional Google-inspired interface
- ✅ **Real-time Tracking** - Live baggage status updates
- ✅ **Timeline View** - Complete journey from check-in to arrival
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Secure Authentication** - JWT-based login system
- ✅ **QR Code Integration** - Instant baggage lookup
- ✅ **Staff Dashboard** - Administrative overview and controls

🎉 **The system is fully operational and ready for testing!** 🎉
