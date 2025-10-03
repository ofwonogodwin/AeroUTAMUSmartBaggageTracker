#!/usr/bin/env python3
"""
QR Code Generator and Updater for Smart Baggage Tracker
This script generates proper scannable QR codes for all baggage items in the database.
"""

import os
import sys
import django
import qrcode
import json
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import base64

# Setup Django environment
sys.path.append('/home/top-g/Desktop/aviathon/AeroUTAMUSmartBaggageTracker/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'baggage_tracker.settings')
django.setup()

from tracking.models import Baggage, StatusUpdate

def generate_qr_code_data(baggage):
    """Generate structured data for QR code"""
    return {
        'baggage_id': str(baggage.id),
        'qr_code': baggage.qr_code,
        'passenger_name': baggage.passenger_name,
        'passenger_email': baggage.passenger_email,
        'flight_number': baggage.flight_number,
        'destination': baggage.destination,
        'current_status': baggage.current_status,
        'created_at': baggage.created_at.isoformat(),
        'tracking_url': f'https://baggage-tracker.app/track?code={baggage.qr_code}'
    }

def create_professional_qr_code(baggage_data, qr_code):
    """Create a professional QR code matching the reference format"""
    # Create QR code with settings that match the reference image
    qr = qrcode.QRCode(
        version=2,    # Version 2 for good data capacity and clean look
        error_correction=qrcode.constants.ERROR_CORRECT_M,  # Medium error correction
        box_size=10,  # Larger box size for crisp, clear scanning
        border=4,     # Standard 4-module quiet zone border
    )
    
    # Add JSON data to QR code
    qr_data_json = json.dumps(baggage_data)
    qr.add_data(qr_data_json)
    qr.make(fit=True)  # Auto-adjust version if needed
    
    # Create QR code image with pure black and white
    qr_img = qr.make_image(fill_color="black", back_color="white")
    
    # Ensure perfect square dimensions (no extra padding needed)
    # The qrcode library already creates perfect squares with proper borders
    return qr_img

def save_qr_code_image(image, filename):
    """Save QR code image to file"""
    qr_codes_dir = '/home/top-g/Desktop/aviathon/qr_codes'
    os.makedirs(qr_codes_dir, exist_ok=True)
    
    file_path = os.path.join(qr_codes_dir, filename)
    image.save(file_path, 'PNG', quality=95)
    return file_path

def image_to_base64(image):
    """Convert PIL image to base64 string"""
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return img_str

def main():
    """Main function to update all QR codes"""
    print("🚀 Smart Baggage Tracker - QR Code Generator")
    print("=" * 50)
    
    baggage_items = Baggage.objects.all().order_by('-created_at')
    total_items = baggage_items.count()
    
    print(f"Found {total_items} baggage items to process...")
    print()
    
    qr_codes_data = []
    
    for i, baggage in enumerate(baggage_items, 1):
        print(f"Processing {i}/{total_items}: {baggage.qr_code}")
        
        # Generate QR code data
        baggage_data = generate_qr_code_data(baggage)
        
        # Create professional QR code image matching reference format
        qr_image = create_professional_qr_code(baggage_data, baggage.qr_code)
        
        # Save QR code image
        filename = f"{baggage.qr_code}.png"
        file_path = save_qr_code_image(qr_image, filename)
        
        # Convert to base64 for display
        base64_image = image_to_base64(qr_image)
        
        # Store data for output
        qr_data = {
            'baggage_id': str(baggage.id),
            'qr_code': baggage.qr_code,
            'passenger_name': baggage.passenger_name,
            'passenger_email': baggage.passenger_email,
            'flight_number': baggage.flight_number,
            'destination': baggage.destination,
            'current_status': baggage.current_status,
            'qr_data_json': json.dumps(baggage_data),
            'scannable_data': baggage_data,
            'image_path': file_path,
            'base64_image': f"data:image/png;base64,{base64_image}"
        }
        
        qr_codes_data.append(qr_data)
        
        print(f"  ✅ Generated professional QR code: {filename}")
        print(f"  🔲 Size: {qr_image.width}x{qr_image.height} pixels (reference format match)")
        print(f"  📍 Status: {baggage.current_status}")
        print(f"  ✈️  Flight: {baggage.flight_number} → {baggage.destination}")
        print()
    
    # Save complete data to JSON file
    output_file = '/home/top-g/Desktop/aviathon/qr_codes_complete.json'
    with open(output_file, 'w') as f:
        json.dump(qr_codes_data, f, indent=2, default=str)
    
    print("=" * 50)
    print(f"✅ Complete! Generated {total_items} QR codes")
    print(f"📁 Images saved to: /home/top-g/Desktop/aviathon/qr_codes/")
    print(f"📋 Complete data saved to: {output_file}")
    print()
    
    # Print summary for first 5 items
    print("📋 SAMPLE QR CODES AND SCANNABLE DATA:")
    print("=" * 50)
    
    for i, item in enumerate(qr_codes_data[:5], 1):
        print(f"\n{i}. QR Code: {item['qr_code']}")
        print(f"   Passenger: {item['passenger_name']}")
        print(f"   Flight: {item['flight_number']} → {item['destination']}")
        print(f"   Status: {item['current_status']}")
        print(f"   Scannable JSON Data:")
        print(f"   {item['qr_data_json']}")
        print(f"   Image: {item['image_path']}")
    
    if total_items > 5:
        print(f"\n... and {total_items - 5} more items")
        print(f"See complete data in: {output_file}")

if __name__ == "__main__":
    main()