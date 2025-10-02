"""
URL configuration for baggage_tracker project.
Smart Baggage Tracker - Entebbe Airport Hackathon System
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    """API root endpoint with available endpoints"""
    return JsonResponse({
        'message': 'Smart Baggage Tracker API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health/',
            'auth': {
                'login': '/api/auth/login/',
                'register': '/api/auth/register/',
                'staff_login': '/api/auth/staff-login/',
                'refresh': '/api/auth/refresh/',
                'user_info': '/api/auth/user/',
                'logout': '/api/auth/logout/',
            },
            'baggage': {
                'list_create': '/api/baggage/',
                'detail': '/api/baggage/{id}/',
                'by_qr': '/api/baggage/qr/{qr_code}/',
                'update_status': '/api/baggage/{id}/update/',
                'timeline': '/api/baggage/{id}/timeline/',
            },
            'staff': {
                'dashboard_stats': '/api/staff/dashboard/stats/',
            },
            'websocket': {
                'baggage_updates': '/ws/baggage/{baggage_id}/',
                'notifications': '/ws/notifications/',
            }
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api_root'),
    path('api/', include('tracking.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
