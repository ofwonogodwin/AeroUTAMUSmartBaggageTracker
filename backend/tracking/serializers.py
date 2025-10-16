from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Baggage, StatusUpdate, UserProfile


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer to include user role and profile info
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['role'] = getattr(user.profile, 'role', 'PASSENGER') if hasattr(user, 'profile') else 'PASSENGER'
        token['username'] = user.username
        token['email'] = user.email
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add user profile information to response
        user_profile = getattr(self.user, 'profile', None)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'role': user_profile.role if user_profile else 'PASSENGER',
            'employee_id': user_profile.employee_id if user_profile else None,
            'department': user_profile.department if user_profile else None,
            'is_staff_member': user_profile.is_staff_member if user_profile else False,
            'can_update_baggage_status': user_profile.can_update_baggage_status if user_profile else False,
        }
        
        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    User registration serializer with role assignment
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=UserProfile.ROLE_CHOICES, default='PASSENGER')
    employee_id = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm', 'role', 'employee_id', 'department']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        # Remove role and profile fields from user data
        role = validated_data.pop('role', 'PASSENGER')
        employee_id = validated_data.pop('employee_id', '')
        department = validated_data.pop('department', '')
        validated_data.pop('password_confirm')
        
        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Create user profile
        UserProfile.objects.create(
            user=user,
            role=role,
            employee_id=employee_id,
            department=department
        )
        
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile information
    """
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'full_name', 'role', 'employee_id', 'department', 'created_at']
        read_only_fields = ['created_at']
    
    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username


class BaggageSerializer(serializers.ModelSerializer):
    """
    Serializer for baggage information
    """
    qr_code_image_url = serializers.SerializerMethodField()
    current_status_display = serializers.CharField(source='get_current_status_display', read_only=True)
    status_timeline = serializers.SerializerMethodField()
    
    class Meta:
        model = Baggage
        fields = [
            'id', 'passenger_name', 'passenger_email', 'flight_number', 
            'destination', 'qr_code', 'qr_code_image_url', 'current_status', 
            'current_status_display', 'created_at', 'updated_at', 'status_timeline'
        ]
        read_only_fields = ['id', 'qr_code', 'qr_code_image_url', 'created_at', 'updated_at']
    
    def get_qr_code_image_url(self, obj):
        if obj.qr_code_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.qr_code_image.url)
        return None
    
    def get_status_timeline(self, obj):
        timeline = obj.get_status_timeline()
        return StatusUpdateSerializer(timeline, many=True, context=self.context).data


class BaggageCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new baggage entries
    """
    class Meta:
        model = Baggage
        fields = ['passenger_name', 'passenger_email', 'flight_number', 'destination']


class StatusUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for status updates
    """
    updated_by_name = serializers.CharField(source='updated_by.username', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = StatusUpdate
        fields = [
            'id', 'status', 'status_display', 'timestamp', 
            'updated_by', 'updated_by_name', 'notes', 'location'
        ]
        read_only_fields = ['id', 'timestamp']


class StatusUpdateCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating status updates
    """
    class Meta:
        model = StatusUpdate
        fields = ['status', 'notes', 'location']
    
    def create(self, validated_data):
        # Get baggage and user from context
        baggage = self.context['baggage']
        user = self.context['request'].user
        
        return StatusUpdate.objects.create(
            baggage=baggage,
            updated_by=user,
            **validated_data
        )