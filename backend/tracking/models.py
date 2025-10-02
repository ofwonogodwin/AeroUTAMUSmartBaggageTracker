from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image
import uuid


class Baggage(models.Model):
    """
    Baggage model to track individual bags through the airport system
    """
    STATUS_CHOICES = [
        ('CHECKED_IN', 'Checked In'),
        ('SECURITY_CLEARED', 'Security Cleared'),
        ('LOADED', 'Loaded'),
        ('IN_FLIGHT', 'In-Flight'),
        ('ARRIVED', 'Arrived'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    passenger_name = models.CharField(max_length=200)
    passenger_email = models.EmailField(blank=True, null=True)
    flight_number = models.CharField(max_length=20, blank=True, null=True)
    destination = models.CharField(max_length=100, blank=True, null=True)
    qr_code = models.CharField(max_length=100, unique=True, blank=True)
    qr_code_image = models.ImageField(upload_to='qr_codes/', blank=True, null=True)
    current_status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='CHECKED_IN'
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Baggage'
        verbose_name_plural = 'Baggage'
    
    def __str__(self):
        return f"{self.passenger_name} - {self.qr_code} ({self.current_status})"
    
    def save(self, *args, **kwargs):
        # Generate QR code if not exists
        if not self.qr_code:
            self.qr_code = f"BAG-{str(self.id)[:8].upper()}"
        
        super().save(*args, **kwargs)
        
        # Generate QR code image
        if not self.qr_code_image:
            self.generate_qr_code()
    
    def generate_qr_code(self):
        """Generate QR code image for the baggage"""
        qr_data = {
            'baggage_id': str(self.id),
            'qr_code': self.qr_code,
            'passenger_name': self.passenger_name
        }
        
        # Create QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(str(qr_data))
        qr.make(fit=True)
        
        # Create QR code image
        qr_image = qr.make_image(fill_color="black", back_color="white")
        
        # Save to BytesIO
        buffer = BytesIO()
        qr_image.save(buffer, format='PNG')
        buffer.seek(0)
        
        # Save to model
        filename = f'qr_{self.qr_code}.png'
        self.qr_code_image.save(
            filename,
            File(buffer),
            save=False
        )
        self.save(update_fields=['qr_code_image'])
    
    def get_status_timeline(self):
        """Get complete status timeline for this baggage"""
        return self.status_updates.all().order_by('timestamp')
    
    def get_current_status_display_with_time(self):
        """Get current status with latest update time"""
        latest_update = self.status_updates.filter(status=self.current_status).first()
        if latest_update:
            return {
                'status': self.get_current_status_display(),
                'timestamp': latest_update.timestamp,
                'updated_by': latest_update.updated_by.username if latest_update.updated_by else 'System'
            }
        return {
            'status': self.get_current_status_display(),
            'timestamp': self.created_at,
            'updated_by': 'System'
        }


class StatusUpdate(models.Model):
    """
    Track status changes for baggage with timestamps and user info
    """
    baggage = models.ForeignKey(
        Baggage, 
        on_delete=models.CASCADE, 
        related_name='status_updates'
    )
    status = models.CharField(
        max_length=20, 
        choices=Baggage.STATUS_CHOICES
    )
    timestamp = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    notes = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Status Update'
        verbose_name_plural = 'Status Updates'
    
    def __str__(self):
        return f"{self.baggage.qr_code} - {self.get_status_display()} at {self.timestamp}"
    
    def save(self, *args, **kwargs):
        # Update baggage current status
        if self.pk is None:  # Only on creation
            self.baggage.current_status = self.status
            self.baggage.save(update_fields=['current_status', 'updated_at'])
        
        super().save(*args, **kwargs)


class UserProfile(models.Model):
    """
    Extended user profile to track user roles and permissions
    """
    ROLE_CHOICES = [
        ('STAFF', 'Staff'),
        ('PASSENGER', 'Passenger'),
        ('ADMIN', 'Admin'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='PASSENGER')
    employee_id = models.CharField(max_length=50, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"
    
    @property
    def is_staff_member(self):
        return self.role in ['STAFF', 'ADMIN']
    
    @property
    def can_update_baggage_status(self):
        return self.role in ['STAFF', 'ADMIN']
