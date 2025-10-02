from django.contrib import admin
from django.utils.html import format_html
from .models import Baggage, StatusUpdate, UserProfile


@admin.register(Baggage)
class BaggageAdmin(admin.ModelAdmin):
    list_display = [
        'qr_code', 'passenger_name', 'flight_number', 
        'destination', 'current_status', 'created_at'
    ]
    list_filter = ['current_status', 'created_at', 'destination']
    search_fields = ['qr_code', 'passenger_name', 'flight_number', 'passenger_email']
    readonly_fields = ['id', 'qr_code', 'qr_code_image_preview', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Passenger Information', {
            'fields': ('passenger_name', 'passenger_email', 'flight_number', 'destination')
        }),
        ('Baggage Details', {
            'fields': ('id', 'qr_code', 'qr_code_image_preview', 'current_status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def qr_code_image_preview(self, obj):
        if obj.qr_code_image:
            return format_html(
                '<img src="{}" width="100" height="100" />',
                obj.qr_code_image.url
            )
        return "No QR Code Image"
    qr_code_image_preview.short_description = "QR Code Preview"


@admin.register(StatusUpdate)
class StatusUpdateAdmin(admin.ModelAdmin):
    list_display = [
        'baggage', 'status', 'timestamp', 'updated_by', 'location'
    ]
    list_filter = ['status', 'timestamp', 'updated_by']
    search_fields = ['baggage__qr_code', 'baggage__passenger_name', 'notes', 'location']
    readonly_fields = ['timestamp']
    
    fieldsets = (
        ('Status Information', {
            'fields': ('baggage', 'status', 'location')
        }),
        ('Update Details', {
            'fields': ('updated_by', 'notes', 'timestamp')
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'employee_id', 'department', 'created_at']
    list_filter = ['role', 'department', 'created_at']
    search_fields = ['user__username', 'user__email', 'employee_id', 'department']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'role')
        }),
        ('Staff Details', {
            'fields': ('employee_id', 'department'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
