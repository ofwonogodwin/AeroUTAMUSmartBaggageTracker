# 🎯 AERO UTAMU Sample QR Codes

This folder contains 5 sample QR codes for testing the baggage tracking system. These are professional-grade QR codes (810x810px) with embedded JSON data.

## 📱 How to Use These QR Codes

### For Testing the System:
1. **Camera Scanning**: Use your mobile device to scan these codes via the app
2. **File Upload**: Upload these image files through the "Upload QR Image" feature
3. **Manual Entry**: Enter the QR code (e.g., BAG-1F0C5581) in the tracking field

### Sample QR Codes Included:

#### BAG-1F0C5581
- **Passenger**: Henry Moore
- **Email**: henry.moore@email.com
- **Flight**: TK742 → London
- **Status**: LOADED
- **Login**: henrymoore / henry2024

#### BAG-65B24C93
- **Passenger**: Ruby Martinez  
- **Email**: ruby.martinez@email.com
- **Flight**: DL439 → Paris
- **Status**: SECURITY_CLEARED
- **Login**: rubymartinez / ruby2024

#### BAG-2106F8F3
- **Passenger**: Alice Johnson
- **Email**: alice.johnson@email.com
- **Flight**: QR434 → Paris
- **Status**: CHECKED_IN
- **Login**: alicejohnson / alice2024

#### BAG-F781DD59
- **Passenger**: Emma Davis
- **Email**: emma.davis@email.com
- **Flight**: DL439 → Atlanta
- **Status**: SECURITY_CLEARED
- **Login**: emmadavis / emma2024

#### BAG-25CF3AA0
- **Passenger**: Victor Lewis
- **Email**: victor.lewis@email.com
- **Flight**: TK742 → Istanbul
- **Status**: SECURITY_CLEARED
- **Login**: victorlewis / victor2024

## 🧪 Testing Workflow

1. **Login as Passenger**: Use the credentials above to login
2. **Track Baggage**: Navigate to /track page
3. **Scan QR Code**: Use camera or upload the corresponding image
4. **View Timeline**: See complete baggage journey

## 📊 QR Code Data Format

Each QR code contains JSON data like:
```json
{
  "baggage_id": "uuid-here",
  "qr_code": "BAG-1F0C5581", 
  "passenger_name": "Henry Moore",
  "passenger_email": "henry.moore@email.com",
  "flight_number": "TK742",
  "destination": "London",
  "current_status": "LOADED",
  "created_at": "2025-10-03T...",
  "tracking_url": "https://baggage-tracker.app/track?code=BAG-1F0C5581"
}
```

## 🔧 Regenerating QR Codes

To generate fresh QR codes for all baggage:
```bash
cd backend
python update_qr_codes.py
```

This will create QR codes for all baggage items in the database.

---

**Note**: These are sample QR codes for demonstration purposes. In production, QR codes would be generated dynamically and printed on baggage tags.