#!/usr/bin/env python3
"""
Simple QR Code Generator for Smart Baggage Tracker
This script generates basic, perfect square QR codes that are fully scannable.
"""

import os
import sys
import django
import qrcode
import json

# Setup Django environment
sys.path.append(os.path.join(os.path.dirname(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'baggage_tracker.settings')
django.setup()

from tracking.models import Baggage

def generate_simple_qr_code(data):
    """Generate a simple, standard QR code"""
    qr = qrcode.QRCode(
        version=1,  # Start with version 1, auto-resize if needed
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )
    
    qr.add_data(data)
    qr.make(fit=True)
    
    # Create QR code image - this will be a perfect square
    img = qr.make_image(fill_color="black", back_color="white")
    return img

def main():
    """Generate simple QR codes for all baggage items"""
    print("🔲 Simple QR Code Generator")
    print("=" * 40)
    
    baggage_items = Baggage.objects.all().order_by('-created_at')
    total_items = baggage_items.count()
    
    print(f"Found {total_items} baggage items to process...")
    print()
    
    # Create output directory
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'sample_qr_codes')
    os.makedirs(output_dir, exist_ok=True)
    
    for i, baggage in enumerate(baggage_items, 1):
        print(f"Processing {i}/{total_items}: {baggage.qr_code}")
        
        # Generate simple baggage data for QR code
        baggage_data = {
            'baggage_id': str(baggage.id),
            'qr_code': baggage.qr_code,
            'passenger_name': baggage.passenger_name,
            'flight_number': baggage.flight_number,
            'destination': baggage.destination,
            'status': baggage.current_status
        }
        
        # Convert to JSON string
        qr_data = json.dumps(baggage_data)
        
        # Generate QR code
        qr_image = generate_simple_qr_code(qr_data)
        
        # Save image
        filename = f"{baggage.qr_code}.png"
        file_path = os.path.join(output_dir, filename)
        qr_image.save(file_path)
        
        print(f"  ✅ Saved: {filename}")
        print(f"  🔲 Size: {qr_image.width}x{qr_image.height} pixels")
        print(f"  📄 Data: {qr_data}")
        print()
    
    print("=" * 40)
    print(f"✅ Generated {total_items} simple QR codes")
    print(f"📁 Saved to: {output_dir}")
    print("🔲 All QR codes are perfect squares and fully scannable!")

if __name__ == "__main__":
    main()