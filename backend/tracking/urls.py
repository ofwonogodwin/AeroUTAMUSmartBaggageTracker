from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .auth_views import (
    CustomTokenObtainPairView,
    UserRegistrationView,
    UserProfileView,
    staff_login,
    logout,
    user_info
)
from .views import (
    BaggageListCreateView,
    BaggageDetailView,
    baggage_status_by_qr,
    update_baggage_status,
    baggage_timeline,
    staff_dashboard_stats,
    health_check
)

urlpatterns = [
    # Health check
    path('health/', health_check, name='health_check'),
    
    # Authentication endpoints
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', UserRegistrationView.as_view(), name='user_register'),
    path('auth/staff-login/', staff_login, name='staff_login'),
    path('auth/logout/', logout, name='logout'),
    path('auth/user/', user_info, name='user_info'),
    path('auth/profile/', UserProfileView.as_view(), name='user_profile'),
    
    # Baggage endpoints
    path('baggage/', BaggageListCreateView.as_view(), name='baggage_list_create'),
    path('baggage/<uuid:id>/', BaggageDetailView.as_view(), name='baggage_detail'),
    path('baggage/qr/<str:qr_code>/', baggage_status_by_qr, name='baggage_by_qr'),
    path('baggage/<uuid:baggage_id>/update/', update_baggage_status, name='update_baggage_status'),
    path('baggage/<uuid:baggage_id>/timeline/', baggage_timeline, name='baggage_timeline'),
    
    # Staff dashboard
    path('staff/dashboard/stats/', staff_dashboard_stats, name='staff_dashboard_stats'),
]