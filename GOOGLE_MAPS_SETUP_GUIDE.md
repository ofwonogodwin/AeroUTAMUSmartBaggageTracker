# Google Maps Setup Guide for Entebbe Airport Map

## 🗺️ **Setting up Google Maps API**

### **Step 1: Get Google Maps API Key**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select an existing one
3. **Enable the following APIs**:

   - Maps JavaScript API
   - Places API (optional, for enhanced search)

4. **Create API Key**:
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy the generated API key

### **Step 2: Configure Environment**

1. **Update `.env.local` file**:

   ```bash
   cd frontend
   # Replace YOUR_GOOGLE_MAPS_API_KEY_HERE with your actual API key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
   ```

2. **Restart the development server**:
   ```bash
   npm run dev
   ```

### **Step 3: Test the Map**

1. **Visit the map page**: http://localhost:3001/map
2. **You should see**:
   - ✅ Interactive Google Maps with satellite view
   - ✅ Airport location markers with info windows
   - ✅ Filter buttons for different location types
   - ✅ Map type toggle (Satellite/Map view)
   - ✅ Fullscreen functionality

## 🎯 **Features Available**

### **Interactive Elements**

- **📍 Location Markers**: All major airport areas marked
- **🔍 Filter System**: Filter by terminals, baggage, dining, services, parking
- **🛰️ Map Types**: Satellite and standard map views
- **📱 Responsive**: Works on mobile and desktop
- **🖼️ Fullscreen**: Expand map to full screen

### **Airport Locations Covered**

- ✈️ **Main Terminal**: Check-in counters and departure gates
- 🧳 **Baggage Areas**: Claim areas and screening points
- 🚪 **Gates**: Departure gates 1-8
- 🔒 **Security**: Security checkpoints
- 🛂 **Immigration**: Customs and immigration control
- 🍽️ **Dining**: Restaurants and cafes
- 🅿️ **Parking**: Main parking facilities
- 🚗 **Transportation**: Car rental and taxi services

## ⚠️ **Fallback Mode**

If no API key is provided, the map will show:

- Airport coordinates and basic information
- List of all locations with descriptions
- Instructions for setting up Google Maps API

## 🔧 **Troubleshooting**

### **Map not loading?**

1. Check if API key is correctly set in `.env.local`
2. Ensure Maps JavaScript API is enabled in Google Cloud Console
3. Check browser console for any error messages
4. Restart the development server after adding the API key

### **Markers not showing?**

1. Verify the API key has proper permissions
2. Check if there are any quota limits exceeded
3. Ensure the coordinates are correct

## 🎨 **Customization**

The map component supports:

- **Custom height**: `<EntebbeAirportMap height="400px" />`
- **Custom styling**: Pass className for additional styling
- **Location filtering**: Built-in filter system
- **Responsive design**: Automatically adapts to screen size

## 📱 **Usage in Components**

```tsx
import EntebbeAirportMap from '@/components/EntebbeAirportMapV2'

// Basic usage
<EntebbeAirportMap />

// With custom height
<EntebbeAirportMap height="500px" />

// With custom styling
<EntebbeAirportMap className="rounded-xl shadow-2xl" height="600px" />
```

## 🚀 **Ready to Use!**

Once configured, the airport map provides a professional, Google Maps-powered navigation experience for Entebbe International Airport with all major locations clearly marked and easily accessible.
