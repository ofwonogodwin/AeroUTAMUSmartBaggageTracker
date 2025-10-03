# 🗺️ Google Maps API Setup Guide

## 📋 **Step-by-Step Google Maps API Setup**

### **1. Create Google Cloud Project**

🔗 **Direct Link**: https://console.cloud.google.com/projectcreate

1. Go to Google Cloud Console
2. Click "Create Project"
3. Enter project name: `AeroUTAMU-BaggageTracker`
4. Click "Create"

### **2. Enable Google Maps JavaScript API**

🔗 **Direct Link**: https://console.cloud.google.com/apis/library/maps-backend.googleapis.com

**Required APIs to Enable:**

- **Maps JavaScript API** - Main map functionality
- **Places API** - Location search and details
- **Geocoding API** - Address to coordinates conversion

**Steps:**

1. Go to APIs & Services → Library
2. Search for "Maps JavaScript API"
3. Click on it and press "Enable"
4. Repeat for Places API and Geocoding API

### **3. Create API Key**

🔗 **Direct Link**: https://console.cloud.google.com/apis/credentials

1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. Click "Restrict Key" (recommended for security)

### **4. Configure API Key Restrictions (Recommended)**

**Application Restrictions:**

- Select "HTTP referrers (web sites)"
- Add: `http://localhost:3001/*` (for development)
- Add: `https://yourdomain.com/*` (for production)

**API Restrictions:**

- Select "Restrict key"
- Choose:
  - Maps JavaScript API
  - Places API
  - Geocoding API

### **5. Add API Key to Your Project**

Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` in your `.env.local` file:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### **6. Billing Setup (Required)**

🔗 **Direct Link**: https://console.cloud.google.com/billing

⚠️ **Important**: Google Maps requires a billing account, but provides $200 monthly credit (free tier).

**Steps:**

1. Go to Billing in Google Cloud Console
2. Link a billing account to your project
3. You get $200/month free credit
4. Maps usage under this limit is free

---

## 💰 **Pricing Information**

### **Free Tier Benefits:**

- $200 monthly credit
- Up to 28,000 map loads per month (free)
- Up to 40,000 geocoding requests per month (free)

### **Typical Usage Costs:**

- Map loads: $7 per 1,000 loads (after free tier)
- Geocoding: $5 per 1,000 requests (after free tier)

---

## 🔧 **Quick Setup Links**

| Step | Direct Link                                                             | Description                |
| ---- | ----------------------------------------------------------------------- | -------------------------- |
| 1    | [Create Project](https://console.cloud.google.com/projectcreate)        | New Google Cloud project   |
| 2    | [Enable APIs](https://console.cloud.google.com/apis/library)            | Enable Maps JavaScript API |
| 3    | [Create Credentials](https://console.cloud.google.com/apis/credentials) | Generate API key           |
| 4    | [Setup Billing](https://console.cloud.google.com/billing)               | Required for API usage     |
| 5    | [API Dashboard](https://console.cloud.google.com/apis/dashboard)        | Monitor API usage          |

---

## 🛠️ **Testing Your Setup**

After adding your API key, test the map:

1. Restart your development server:

   ```bash
   npm run dev
   ```

2. Visit: http://localhost:3001/map

3. You should see Entebbe International Airport with:
   - Satellite/street view
   - Interactive controls
   - Airport terminals marked
   - Baggage claim areas highlighted

---

## 🚨 **Troubleshooting**

### **Common Issues:**

**"This page can't load Google Maps correctly"**

- Check if API key is correctly added to `.env.local`
- Ensure Maps JavaScript API is enabled
- Verify billing is set up

**"RefererNotAllowedMapError"**

- Add `http://localhost:3001/*` to HTTP referrers
- Check API key restrictions

**"API key not valid"**

- Regenerate API key
- Check if key is properly copied (no extra spaces)

### **Verify Setup:**

🔗 **API Key Tester**: https://developers.google.com/maps/documentation/javascript/get-api-key

---

## 📚 **Additional Resources**

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)
- [Support Forum](https://stackoverflow.com/questions/tagged/google-maps)

---

**Need Help? Check the Support page in the application for more assistance!**
