from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile
from .serializers import (
    CustomTokenObtainPairSerializer, 
    UserRegistrationSerializer,
    UserProfileSerializer
)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom login view with user profile information
    """
    serializer_class = CustomTokenObtainPairSerializer


class UserRegistrationView(generics.CreateAPIView):
    """
    User registration endpoint
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens for the new user
        refresh = RefreshToken.for_user(user)
        
        # Get user profile
        user_profile = user.profile
        
        return Response({
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user_profile.role,
                'employee_id': user_profile.employee_id,
                'department': user_profile.department,
                'is_staff_member': user_profile.is_staff_member,
                'can_update_baggage_status': user_profile.can_update_baggage_status,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    View for getting and updating user profile
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(
            user=self.request.user,
            defaults={'role': 'PASSENGER'}
        )
        return profile


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def staff_login(request):
    """
    Special login endpoint for staff members with role verification
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'error': 'Username and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if not user:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    # Check if user has staff role
    try:
        profile = user.profile
        if not profile.is_staff_member:
            return Response({
                'error': 'Access denied. Staff privileges required.'
            }, status=status.HTTP_403_FORBIDDEN)
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Generate tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'message': 'Staff login successful',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': profile.role,
            'employee_id': profile.employee_id,
            'department': profile.department,
            'is_staff_member': profile.is_staff_member,
            'can_update_baggage_status': profile.can_update_baggage_status,
        },
        'tokens': {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    """
    Logout endpoint to blacklist refresh token
    """
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'message': 'Successfully logged out'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': 'Error during logout'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_info(request):
    """
    Get current user information
    """
    user = request.user
    try:
        profile = user.profile
    except UserProfile.DoesNotExist:
        profile = UserProfile.objects.create(user=user, role='PASSENGER')
    
    return Response({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': profile.role,
            'employee_id': profile.employee_id,
            'department': profile.department,
            'is_staff_member': profile.is_staff_member,
            'can_update_baggage_status': profile.can_update_baggage_status,
        }
    })