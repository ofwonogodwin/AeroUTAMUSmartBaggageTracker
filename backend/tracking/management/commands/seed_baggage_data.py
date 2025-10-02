from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from tracking.models import Baggage, StatusUpdate, UserProfile
from django.utils import timezone
import random
from datetime import timedelta


class Command(BaseCommand):
    help = 'Seed the database with sample baggage tracking data'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--baggage-count',
            type=int,
            default=20,
            help='Number of baggage entries to create (default: 20)'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding'
        )
    
    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            StatusUpdate.objects.all().delete()
            Baggage.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()
            self.stdout.write(self.style.SUCCESS('Data cleared successfully'))
        
        # Create sample users
        self.stdout.write('Creating sample users...')
        self.create_sample_users()
        
        # Create sample baggage
        self.stdout.write(f'Creating {options["baggage_count"]} sample baggage entries...')
        self.create_sample_baggage(options['baggage_count'])
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully seeded database with {options["baggage_count"]} baggage entries'
            )
        )
    
    def create_sample_users(self):
        """Create sample staff and passenger users"""
        
        # Create admin user
        if not User.objects.filter(username='admin').exists():
            admin_user = User.objects.create_user(
                username='admin',
                email='admin@entebbe-airport.com',
                password='admin123',
                first_name='System',
                last_name='Administrator',
                is_staff=True,
                is_superuser=True
            )
            UserProfile.objects.create(
                user=admin_user,
                role='ADMIN',
                employee_id='EMP001',
                department='IT'
            )
            self.stdout.write(f'Created admin user: admin/admin123')
        
        # Create staff users
        staff_data = [
            {
                'username': 'staff1',
                'email': 'baggage.handler1@entebbe-airport.com',
                'first_name': 'John',
                'last_name': 'Baggage',
                'employee_id': 'EMP101',
                'department': 'Baggage Handling'
            },
            {
                'username': 'staff2',
                'email': 'security.officer@entebbe-airport.com',
                'first_name': 'Jane',
                'last_name': 'Security',
                'employee_id': 'EMP201',
                'department': 'Security'
            },
            {
                'username': 'staff3',
                'email': 'loading.supervisor@entebbe-airport.com',
                'first_name': 'Bob',
                'last_name': 'Loading',
                'employee_id': 'EMP301',
                'department': 'Ground Operations'
            }
        ]
        
        for staff_info in staff_data:
            if not User.objects.filter(username=staff_info['username']).exists():
                staff_user = User.objects.create_user(
                    username=staff_info['username'],
                    email=staff_info['email'],
                    password='staff123',
                    first_name=staff_info['first_name'],
                    last_name=staff_info['last_name']
                )
                UserProfile.objects.create(
                    user=staff_user,
                    role='STAFF',
                    employee_id=staff_info['employee_id'],
                    department=staff_info['department']
                )
                self.stdout.write(f'Created staff user: {staff_info["username"]}/staff123')
        
        # Create sample passenger users
        passenger_data = [
            {
                'username': 'passenger1',
                'email': 'john.traveler@gmail.com',
                'first_name': 'John',
                'last_name': 'Traveler'
            },
            {
                'username': 'passenger2',
                'email': 'mary.explorer@yahoo.com',
                'first_name': 'Mary',
                'last_name': 'Explorer'
            }
        ]
        
        for passenger_info in passenger_data:
            if not User.objects.filter(username=passenger_info['username']).exists():
                passenger_user = User.objects.create_user(
                    username=passenger_info['username'],
                    email=passenger_info['email'],
                    password='passenger123',
                    first_name=passenger_info['first_name'],
                    last_name=passenger_info['last_name']
                )
                UserProfile.objects.create(
                    user=passenger_user,
                    role='PASSENGER'
                )
                self.stdout.write(f'Created passenger user: {passenger_info["username"]}/passenger123')
    
    def create_sample_baggage(self, count):
        """Create sample baggage entries with realistic data"""
        
        # Sample data
        passenger_names = [
            'Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown',
            'Emma Davis', 'Frank Miller', 'Grace Wilson', 'Henry Moore',
            'Ivy Taylor', 'Jack Anderson', 'Kate Thomas', 'Liam Jackson',
            'Maya White', 'Noah Harris', 'Olivia Martin', 'Paul Thompson',
            'Quinn Garcia', 'Ruby Martinez', 'Sam Robinson', 'Tina Clark',
            'Uma Rodriguez', 'Victor Lewis', 'Wendy Lee', 'Xavier Walker',
            'Yara Hall', 'Zoe Allen', 'Adam Young', 'Beth King', 'Carl Wright',
            'Diana Lopez', 'Eric Hill', 'Fiona Scott', 'George Green', 'Helen Adams'
        ]
        
        flight_numbers = [
            'KL566', 'QR434', 'ET302', 'KE924', 'SN401',
            'TK742', 'EK729', 'RW501', 'SA234', 'MS843',
            'AF814', 'LH567', 'BA728', 'VS201', 'DL439'
        ]
        
        destinations = [
            'Amsterdam', 'Doha', 'Addis Ababa', 'Seoul', 'Brussels',
            'Istanbul', 'Dubai', 'Kigali', 'Johannesburg', 'Cairo',
            'Paris', 'Frankfurt', 'London', 'London', 'Atlanta'
        ]
        
        statuses = ['CHECKED_IN', 'SECURITY_CLEARED', 'LOADED', 'IN_FLIGHT', 'ARRIVED']
        staff_users = list(User.objects.filter(profile__role='STAFF'))
        
        for i in range(count):
            # Random passenger data
            passenger_name = random.choice(passenger_names)
            flight_number = random.choice(flight_numbers)
            destination = random.choice(destinations)
            passenger_email = f"{passenger_name.lower().replace(' ', '.')}@email.com"
            
            # Create baggage with random creation time (last 3 days)
            creation_time = timezone.now() - timedelta(
                hours=random.randint(0, 72),
                minutes=random.randint(0, 59)
            )
            
            baggage = Baggage.objects.create(
                passenger_name=passenger_name,
                passenger_email=passenger_email,
                flight_number=flight_number,
                destination=destination,
                created_at=creation_time
            )
            
            # Create status updates
            current_time = creation_time
            current_status = 'CHECKED_IN'
            
            # Always create initial check-in
            StatusUpdate.objects.create(
                baggage=baggage,
                status='CHECKED_IN',
                timestamp=current_time,
                updated_by=random.choice(staff_users) if staff_users else None,
                notes='Initial check-in',
                location='Check-in Counter'
            )
            
            # Randomly progress through other statuses
            remaining_statuses = ['SECURITY_CLEARED', 'LOADED', 'IN_FLIGHT', 'ARRIVED']
            
            for status in remaining_statuses:
                # 70% chance to progress to next status
                if random.random() < 0.7:
                    current_time += timedelta(
                        minutes=random.randint(15, 120)
                    )
                    
                    status_notes = {
                        'SECURITY_CLEARED': 'Passed security screening',
                        'LOADED': 'Loaded onto aircraft',
                        'IN_FLIGHT': 'Aircraft departed',
                        'ARRIVED': 'Arrived at destination'
                    }
                    
                    status_locations = {
                        'SECURITY_CLEARED': 'Security Checkpoint',
                        'LOADED': 'Aircraft Loading Bay',
                        'IN_FLIGHT': 'In Transit',
                        'ARRIVED': f'{destination} Airport'
                    }
                    
                    StatusUpdate.objects.create(
                        baggage=baggage,
                        status=status,
                        timestamp=current_time,
                        updated_by=random.choice(staff_users) if staff_users else None,
                        notes=status_notes[status],
                        location=status_locations[status]
                    )
                    current_status = status
                else:
                    # Stop progressing for this baggage
                    break
            
            # Update baggage current status
            baggage.current_status = current_status
            baggage.save()
            
            if (i + 1) % 5 == 0:
                self.stdout.write(f'Created {i + 1} baggage entries...')