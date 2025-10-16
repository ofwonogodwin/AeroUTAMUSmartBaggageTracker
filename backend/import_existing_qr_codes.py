#!/usr/bin/env python3
"""
Import Existing QR Codes into Database
This script reads the qr_codes_complete.json file and creates baggage entries
for all existing QR code images.
"""

import os
import sys
import django
import json
from pathlib import Path

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'baggage_tracker.settings')
django.setup()

from tracking.models import Baggage, StatusUpdate
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta

def import_qr_codes():
    """Import baggage data from qr_codes_complete.json"""
    print("🔄 Importing Existing QR Codes into Database")
    print("=" * 50)
    
    # Load the QR codes data
    json_file = Path(__file__).parent.parent / 'qr_codes_complete.json'
    
    if not json_file.exists():
        print(f"❌ Error: {json_file} not found!")
        return
    
    with open(json_file, 'r') as f:
        qr_data = json.load(f)
    
    print(f"📦 Found {len(qr_data)} QR codes to import...")
    print()
    
    # Get staff users for status updates
    staff_users = list(User.objects.filter(profile__role='STAFF'))
    if not staff_users:
        print("⚠️  No staff users found. Creating default staff user...")
        staff_user = User.objects.create_user(
            username='staff1',
            email='staff@entebbe-airport.com',
            password='staff123'
        )
        from tracking.models import UserProfile
        UserProfile.objects.create(
            user=staff_user,
            role='STAFF',
            employee_id='EMP101',
            department='Baggage Handling'
        )
        staff_users = [staff_user]
    
    # Clear existing data
    print("🗑️  Clearing existing baggage data...")
    StatusUpdate.objects.all().delete()
    Baggage.objects.all().delete()
    print("✅ Cleared old data")
    print()
    
    imported_count = 0
    skipped_count = 0
    
    for item in qr_data:
        qr_code = item['qr_code']
        
        # Check if image file exists
        image_filename = f"{qr_code}.png"
        image_path = Path(__file__).parent.parent / 'qr_codes' / image_filename
        
        if not image_path.exists():
            print(f"⚠️  Skipping {qr_code}: Image file not found")
            skipped_count += 1
            continue
        
        try:
            # Parse the scannable data
            scannable_data = item['scannable_data']
            
            # Create the baggage entry
            baggage = Baggage.objects.create(
                id=scannable_data['baggage_id'],
                qr_code=qr_code,
                passenger_name=scannable_data['passenger_name'],
                passenger_email=scannable_data['passenger_email'],
                flight_number=scannable_data['flight_number'],
                destination=scannable_data['destination'],
                current_status=scannable_data['current_status'],
                created_at=datetime.fromisoformat(scannable_data['created_at'].replace('Z', '+00:00'))
            )
            
            # Create initial status update
            StatusUpdate.objects.create(
                baggage=baggage,
                status='CHECKED_IN',
                timestamp=baggage.created_at,
                updated_by=staff_users[0],
                notes='Imported from existing QR codes',
                location='Check-in Counter'
            )
            
            # Create status update for current status if not CHECKED_IN
            if scannable_data['current_status'] != 'CHECKED_IN':
                status_locations = {
                    'SECURITY_CLEARED': 'Security Checkpoint',
                    'LOADED': 'Aircraft Loading Bay',
                    'IN_FLIGHT': 'In Transit',
                    'ARRIVED': f"{scannable_data['destination']} Airport"
                }
                
                status_notes = {
                    'SECURITY_CLEARED': 'Passed security screening',
                    'LOADED': 'Loaded onto aircraft',
                    'IN_FLIGHT': 'Aircraft departed',
                    'ARRIVED': 'Arrived at destination'
                }
                
                StatusUpdate.objects.create(
                    baggage=baggage,
                    status=scannable_data['current_status'],
                    timestamp=baggage.created_at + timedelta(hours=1),
                    updated_by=staff_users[0],
                    notes=status_notes.get(scannable_data['current_status'], 'Status updated'),
                    location=status_locations.get(scannable_data['current_status'], 'Airport')
                )
            
            print(f"✅ Imported: {qr_code} - {scannable_data['passenger_name']} ({scannable_data['current_status']})")
            imported_count += 1
            
        except Exception as e:
            print(f"❌ Error importing {qr_code}: {str(e)}")
            skipped_count += 1
    
    print()
    print("=" * 50)
    print(f"✅ Successfully imported {imported_count} baggage entries")
    if skipped_count > 0:
        print(f"⚠️  Skipped {skipped_count} entries")
    print()
    print("🎉 Database is now populated with your existing QR codes!")
    print()
    print("📝 Test with any of these codes:")
    # Show first 5 codes
    for item in qr_data[:5]:
        print(f"   - {item['qr_code']} ({item['passenger_name']})")

if __name__ == "__main__":
    import_qr_codes()
