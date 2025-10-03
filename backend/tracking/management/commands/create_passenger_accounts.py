from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from tracking.models import Baggage, UserProfile
from django.utils import timezone
import json
import os


class Command(BaseCommand):
    help = 'Create passenger accounts for all baggage entries and generate login document'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--output-file',
            type=str,
            default='passenger_accounts.json',
            help='Output file for passenger account details'
        )
        parser.add_argument(
            '--clear-existing',
            action='store_true',
            help='Clear existing passenger accounts before creating new ones'
        )
    
    def handle(self, *args, **options):
        if options['clear_existing']:
            self.stdout.write('Clearing existing passenger accounts...')
            User.objects.filter(profile__role='PASSENGER').delete()
            self.stdout.write(self.style.SUCCESS('Existing passenger accounts cleared'))
        
        # Get all unique passengers from baggage entries
        baggage_entries = Baggage.objects.all().order_by('passenger_name', 'passenger_email')
        
        # Group by passenger to avoid duplicates
        passengers = {}
        for baggage in baggage_entries:
            key = f"{baggage.passenger_name}:{baggage.passenger_email}"
            if key not in passengers:
                passengers[key] = {
                    'name': baggage.passenger_name,
                    'email': baggage.passenger_email,
                    'baggage_items': []
                }
            passengers[key]['baggage_items'].append({
                'qr_code': baggage.qr_code,
                'flight_number': baggage.flight_number,
                'destination': baggage.destination,
                'status': baggage.current_status,
                'created_at': baggage.created_at.isoformat()
            })
        
        self.stdout.write(f'Found {len(passengers)} unique passengers to create accounts for...')
        
        created_accounts = []
        
        for i, (key, passenger_data) in enumerate(passengers.items(), 1):
            name = passenger_data['name']
            email = passenger_data['email']
            
            # Generate username from name
            username = name.lower().replace(' ', '').replace('.', '')
            base_username = username
            counter = 1
            
            # Ensure unique username
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            
            # Generate a simple password based on first name + last 4 digits of a number
            first_name = name.split()[0].lower()
            password = f"{first_name}2024"
            
            # Create user account
            try:
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=name.split()[0],
                    last_name=' '.join(name.split()[1:]) if len(name.split()) > 1 else ''
                )
                
                # Create user profile
                UserProfile.objects.create(
                    user=user,
                    role='PASSENGER'
                )
                
                account_info = {
                    'passenger_name': name,
                    'email': email,
                    'username': username,
                    'password': password,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'user_id': str(user.id),
                    'baggage_count': len(passenger_data['baggage_items']),
                    'baggage_items': passenger_data['baggage_items'],
                    'account_created': timezone.now().isoformat()
                }
                
                created_accounts.append(account_info)
                
                self.stdout.write(f'✅ {i}/{len(passengers)}: Created account for {name} (username: {username})')
                
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'❌ Failed to create account for {name}: {str(e)}')
                )
        
        # Generate comprehensive report
        report = {
            'report_generated': timezone.now().isoformat(),
            'total_passengers': len(created_accounts),
            'total_baggage_items': sum(acc['baggage_count'] for acc in created_accounts),
            'system_info': {
                'login_url_passenger': 'http://localhost:3000/login',
                'login_url_staff': 'http://localhost:3000/staff-login',
                'track_baggage_url': 'http://localhost:3000/track'
            },
            'passenger_accounts': created_accounts,
            'quick_reference': {
                'sample_logins': [
                    {
                        'type': 'Passenger',
                        'username': created_accounts[0]['username'] if created_accounts else 'N/A',
                        'password': created_accounts[0]['password'] if created_accounts else 'N/A',
                        'url': 'http://localhost:3000/login'
                    },
                    {
                        'type': 'Staff',
                        'username': 'staff1',
                        'password': 'staff123',
                        'url': 'http://localhost:3000/staff-login'
                    },
                    {
                        'type': 'Admin',
                        'username': 'admin',
                        'password': 'admin123',
                        'url': 'http://localhost:3000/staff-login'
                    }
                ]
            }
        }
        
        # Write to JSON file
        output_path = os.path.join(os.getcwd(), options['output_file'])
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        # Also create a simplified CSV-like text file for easy reading
        txt_output_path = output_path.replace('.json', '.txt')
        with open(txt_output_path, 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("AERO UTAMU SMART BAGGAGE TRACKER - PASSENGER ACCOUNTS\n")
            f.write("=" * 80 + "\n")
            f.write(f"Report Generated: {report['report_generated']}\n")
            f.write(f"Total Passengers: {report['total_passengers']}\n")
            f.write(f"Total Baggage Items: {report['total_baggage_items']}\n")
            f.write("\n" + "=" * 80 + "\n")
            f.write("SYSTEM URLS\n")
            f.write("=" * 80 + "\n")
            f.write("Passenger Login: http://localhost:3000/login\n")
            f.write("Staff Login: http://localhost:3000/staff-login\n")
            f.write("Track Baggage: http://localhost:3000/track\n")
            f.write("\n" + "=" * 80 + "\n")
            f.write("QUICK REFERENCE LOGINS\n")
            f.write("=" * 80 + "\n")
            f.write("PASSENGER (Sample):\n")
            if created_accounts:
                f.write(f"  Username: {created_accounts[0]['username']}\n")
                f.write(f"  Password: {created_accounts[0]['password']}\n")
            f.write("\nSTAFF:\n")
            f.write("  Username: staff1\n")
            f.write("  Password: staff123\n")
            f.write("\nADMIN:\n")
            f.write("  Username: admin\n")
            f.write("  Password: admin123\n")
            f.write("\n" + "=" * 80 + "\n")
            f.write("ALL PASSENGER ACCOUNTS\n")
            f.write("=" * 80 + "\n")
            f.write(f"{'No.':<4} {'Name':<20} {'Username':<15} {'Password':<12} {'Email':<30} {'Bags':<5}\n")
            f.write("-" * 80 + "\n")
            
            for i, account in enumerate(created_accounts, 1):
                f.write(f"{i:<4} {account['passenger_name'][:19]:<20} {account['username']:<15} "
                       f"{account['password']:<12} {account['email'][:29]:<30} {account['baggage_count']:<5}\n")
            
            f.write("\n" + "=" * 80 + "\n")
            f.write("DETAILED BAGGAGE INFORMATION\n")
            f.write("=" * 80 + "\n")
            
            for i, account in enumerate(created_accounts, 1):
                f.write(f"\n{i}. {account['passenger_name']} ({account['username']})\n")
                f.write(f"   Email: {account['email']}\n")
                f.write(f"   Password: {account['password']}\n")
                f.write(f"   Baggage Items ({account['baggage_count']}):\n")
                for j, bag in enumerate(account['baggage_items'], 1):
                    f.write(f"     {j}. QR: {bag['qr_code']} | Flight: {bag['flight_number']} → {bag['destination']} | Status: {bag['status']}\n")
        
        self.stdout.write("\n" + "=" * 60)
        self.stdout.write(self.style.SUCCESS(f"✅ Successfully created {len(created_accounts)} passenger accounts!"))
        self.stdout.write(f"📄 Detailed report saved to: {output_path}")
        self.stdout.write(f"📝 Human-readable report saved to: {txt_output_path}")
        self.stdout.write("\n" + "QUICK TEST LOGINS:")
        self.stdout.write("=" * 60)
        
        if created_accounts:
            sample = created_accounts[0]
            self.stdout.write(f"🎫 PASSENGER: {sample['username']} / {sample['password']}")
        self.stdout.write("👨‍💼 STAFF: staff1 / staff123")
        self.stdout.write("🔐 ADMIN: admin / admin123")
        self.stdout.write("=" * 60)