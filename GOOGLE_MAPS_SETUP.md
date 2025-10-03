# 🗺️ Google Maps API Setup Guide

## 🚀 Quick Setup Links

### **📍 Get Your API Key**

🔗 **Direct Link:** https://console.cloud.google.com/apis/credentials

### **🔧 Enable Required APIs**

🔗 **Direct Link:** https://console.cloud.google.com/apis/library

---

## 📋 Step-by-Step Setup

### Step 1: Create/Select a Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Create a new project or select an existing one
3. **⚠️ Important:** Make sure billing is enabled (required for Maps API)

### Step 2: Enable Maps JavaScript API

1. Go to https://console.cloud.google.com/apis/library
2. Search for **"Maps JavaScript API"**
3. Click on "Maps JavaScript API"
4. Click **"ENABLE"**

### Step 3: Create API Key

1. Go to https://console.cloud.google.com/apis/credentials
2. Click **"CREATE CREDENTIALS"** → **"API key"**
3. **Copy the generated API key** (you'll need this!)

### Step 4: Secure Your API Key (Recommended)

1. Click on your API key in the credentials list
2. Under **"Application restrictions"**:
   - Choose **"HTTP referrers (web sites)"**
   - Add these referrers:
     - `http://localhost:3000/*` (for development)
     - `http://localhost:3001/*` (for development)
     - `https://yourdomain.com/*` (for production)
3. Under **"API restrictions"**:
   - Choose **"Restrict key"**
   - Select **"Maps JavaScript API"**
4. **Save changes**

### Step 5: Add API Key to Your Project

1. Open `/frontend/.env.local`
2. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC4VyB8QfH2_your_actual_key_here
   ```
3. **Restart your development server** (`npm run dev`)

---

## 💰 Pricing Information

- **🆓 Free tier:** 28,000 map loads per month
- **💳 Paid usage:** $7 per 1,000 map loads after free tier
- **👍 Most development projects:** Stay within free tier

---

## 🛠️ Troubleshooting

### Common Errors:

#### "InvalidKeyMapError" ❌

- ✅ API key is incorrect or not set
- ✅ Maps JavaScript API is not enabled
- ✅ Billing is not enabled on your project

#### "RefererNotAllowedMapError" ❌

- ✅ Your domain/localhost is not in the API key restrictions
- ✅ Add `http://localhost:3001/*` to allowed referrers

#### "You have included the Google Maps JavaScript API multiple times" ❌

- ✅ **FIXED!** The app now loads the API only once (EntebbeAirportMapFixed.tsx)

---

## 🧪 Test Your Setup

1. **Get your API key** from Google Cloud Console
2. **Add it to** `.env.local`
3. **Restart** the development server: `npm run dev`
4. **Visit:** http://localhost:3001/map
5. **You should see** a satellite view of Entebbe International Airport! 🛩️

---

## ✨ Features

Once set up, the airport map includes:

- **🛩️ Satellite & Street View** of Entebbe International Airport
- **📍 Interactive Markers** for terminals, gates, baggage claim, restaurants
- **🔍 Filter Locations** by type (terminals, gates, services, etc.)
- **🖼️ Full-screen Mode** for better navigation
- **ℹ️ Info Windows** with location details when you click markers
- **📱 Responsive Design** works on all devices

---

## 🆘 Need Help?

- **Google Cloud Support:** https://cloud.google.com/support
- **Maps API Documentation:** https://developers.google.com/maps/documentation/javascript
- **Pricing Calculator:** https://cloud.google.com/maps-platform/pricing

---

## ⚡ **Quick Start Summary:**

1. **Get API key:** https://console.cloud.google.com/apis/credentials
2. **Add to** `.env.local`
3. **Restart server**
4. **Visit** `/map`
5. **Enjoy** the interactive airport map! 🗺️
