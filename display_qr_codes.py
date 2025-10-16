#!/usr/bin/env python3
"""
Display Complete QR Code Information
This scri    print("🔧 TECHNICAL DETAILS:")
    print("   • QR Code Version: Auto-sized (optimized for data)")
    print("   • Error Correction: Medium level")
    print("   • Format: Perfect square PNG images (113x113 or 117x117 pixels)")
    print("   • Border: Complete 20px white padding for full visibility")
    print("   • Data Format: JSON with complete baggage information")
    print("   • Each QR code contains: ID, passenger info, flight details, status, tracking URL")
    print("   • All corners and edges are fully visible and scannable")ws all baggage QR codes with their scannable data in a user-friendly format.
"""

import json
import sys
import os

def display_qr_codes():
    """Display all QR codes with their scannable data"""
    json_file = '/home/top-g/Desktop/aviathon/qr_codes_complete.json'
    
    if not os.path.exists(json_file):
        print("❌ QR codes data file not found!")
        return
    
    with open(json_file, 'r') as f:
        qr_data = json.load(f)
    
    print("🏷️  SMART BAGGAGE TRACKER - COMPLETE QR CODES DATABASE")
    print("=" * 80)
    print(f"📊 Total Baggage Items: {len(qr_data)}")
    print("=" * 80)
    print()
    
    # Group by status for better organization
    status_groups = {}
    for item in qr_data:
        status = item['current_status']
        if status not in status_groups:
            status_groups[status] = []
        status_groups[status].append(item)
    
    # Status emojis
    status_emojis = {
        'CHECKED_IN': '✅',
        'SECURITY_CLEARED': '🔒',
        'LOADED': '📦',
        'IN_FLIGHT': '✈️',
        'ARRIVED': '🎯'
    }
    
    for status, items in status_groups.items():
        emoji = status_emojis.get(status, '📋')
        print(f"{emoji} {status.replace('_', ' ').title()} ({len(items)} items)")
        print("-" * 50)
        
        for i, item in enumerate(items, 1):
            print(f"\n{i}. QR Code: {item['qr_code']}")
            print(f"   👤 Passenger: {item['passenger_name']}")
            print(f"   📧 Email: {item['passenger_email']}")
            print(f"   ✈️  Flight: {item['flight_number']} → {item['destination']}")
            print(f"   🆔 Baggage ID: {item['baggage_id']}")
            print(f"   🖼️  Image: {os.path.basename(item['image_path'])}")
            print(f"   📱 Tracking URL: {item['scannable_data']['tracking_url']}")
            print(f"   📄 Scannable JSON Data:")
            # Pretty print the JSON for easy reading
            scannable_json = json.dumps(item['scannable_data'], indent=6)
            print(f"      {scannable_json}")
            
            # Show how to scan this QR code
            print(f"   📲 To scan: Use any QR scanner app to read the JSON data above")
            print(f"   🔍 Quick lookup: Enter '{item['qr_code']}' in the tracking system")
        
        print("\n" + "=" * 50)
    
    print("\n📁 FILES GENERATED:")
    print(f"   • QR Code Images: /home/top-g/Desktop/aviathon/qr_codes/")
    print(f"   • Complete JSON Data: {json_file}")
    print(f"   • Total Image Files: {len(qr_data)} enhanced QR code images")
    
    print("\n🔧 TECHNICAL DETAILS:")
    print("   • QR Code Version: 3 (supports more data)")
    print("   • Error Correction: Medium level")
    print("   • Format: PNG images with labels")
    print("   • Data Format: JSON with complete baggage information")
    print("   • Each QR code contains: ID, passenger info, flight details, status, tracking URL")
    
    print("\n✨ USAGE INSTRUCTIONS:")
    print("   1. Use any QR code scanner app on the generated images")
    print("   2. The scanned data will be in JSON format")
    print("   3. Extract the 'qr_code' field to lookup baggage in the system")
    print("   4. Use the 'tracking_url' for direct web tracking")
    print("   5. All baggage information is embedded in each QR code")

if __name__ == "__main__":
    display_qr_codes()