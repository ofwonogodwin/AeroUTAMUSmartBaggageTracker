from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db.models import Q
# from channels.layers import get_channel_layer  # temporarily disabled
# from asgiref.sync import async_to_sync  # temporarily disabled
import json
from .models import Baggage, StatusUpdate, UserProfile
from .serializers import (
    BaggageSerializer, 
    BaggageCreateSerializer,
    StatusUpdateSerializer,
    StatusUpdateCreateSerializer
)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class BaggageListCreateView(generics.ListCreateAPIView):
    """
    List all baggage or create new baggage entry
    """
    queryset = Baggage.objects.all()
    serializer_class = BaggageSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BaggageCreateSerializer
        return BaggageSerializer
    
    def get_queryset(self):
        queryset = Baggage.objects.all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(current_status=status_filter)
        
        # Search by passenger name, QR code, or flight number
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(passenger_name__icontains=search) |
                Q(qr_code__icontains=search) |
                Q(flight_number__icontains=search) |
                Q(passenger_email__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        baggage = serializer.save()
        
        # Return full baggage data
        response_serializer = BaggageSerializer(baggage, context={'request': request})
        
        return Response({
            'message': 'Baggage created successfully',
            'baggage': response_serializer.data
        }, status=status.HTTP_201_CREATED)


class BaggageDetailView(generics.RetrieveAPIView):
    """
    Retrieve specific baggage details
    """
    queryset = Baggage.objects.all()
    serializer_class = BaggageSerializer
    permission_classes = [permissions.AllowAny]  # Allow passengers to check their baggage
    lookup_field = 'id'


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def baggage_status_by_qr(request, qr_code):
    """
    Get baggage status by QR code (for passenger app)
    """
    try:
        baggage = Baggage.objects.get(qr_code=qr_code)
        serializer = BaggageSerializer(baggage, context={'request': request})
        return Response(serializer.data)
    except Baggage.DoesNotExist:
        return Response({
            'error': 'Baggage not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_baggage_status(request, baggage_id):
    """
    Update baggage status (staff only)
    """
    # Check if user is staff
    try:
        profile = request.user.profile
        if not profile.can_update_baggage_status:
            return Response({
                'error': 'Permission denied. Staff privileges required.'
            }, status=status.HTTP_403_FORBIDDEN)
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Get baggage
    baggage = get_object_or_404(Baggage, id=baggage_id)
    
    # Create status update
    serializer = StatusUpdateCreateSerializer(
        data=request.data,
        context={'request': request, 'baggage': baggage}
    )
    
    if serializer.is_valid():
        status_update = serializer.save()
        
        # Send real-time update via WebSocket - temporarily disabled
        # channel_layer = get_channel_layer()
        # async_to_sync(channel_layer.group_send)(
        #     f'baggage_{baggage_id}',
        #     {
        #         'type': 'baggage_update',
        #         'message': {
        #             'baggage_id': str(baggage.id),
        #             'qr_code': baggage.qr_code,
        #             'status': status_update.status,
        #             'status_display': status_update.get_status_display(),
        #             'timestamp': status_update.timestamp.isoformat(),
        #             'updated_by': status_update.updated_by.username,
        #             'notes': status_update.notes,
        #             'location': status_update.location,
        #         }
        #     }
        # )
        
        # Return updated baggage data
        baggage_serializer = BaggageSerializer(baggage, context={'request': request})
        
        return Response({
            'message': 'Status updated successfully',
            'baggage': baggage_serializer.data,
            'status_update': StatusUpdateSerializer(status_update).data
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def baggage_timeline(request, baggage_id):
    """
    Get complete timeline for a specific baggage
    """
    baggage = get_object_or_404(Baggage, id=baggage_id)
    timeline = baggage.get_status_timeline()
    serializer = StatusUpdateSerializer(timeline, many=True)
    
    return Response({
        'baggage_id': str(baggage.id),
        'qr_code': baggage.qr_code,
        'passenger_name': baggage.passenger_name,
        'current_status': baggage.current_status,
        'timeline': serializer.data
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def staff_dashboard_stats(request):
    """
    Get dashboard statistics for staff
    """
    # Check if user is staff
    try:
        profile = request.user.profile
        if not profile.is_staff_member:
            return Response({
                'error': 'Permission denied. Staff privileges required.'
            }, status=status.HTTP_403_FORBIDDEN)
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Get statistics
    total_baggage = Baggage.objects.count()
    status_counts = {}
    
    for status_code, status_display in Baggage.STATUS_CHOICES:
        count = Baggage.objects.filter(current_status=status_code).count()
        status_counts[status_code] = {
            'count': count,
            'display': status_display
        }
    
    recent_updates = StatusUpdate.objects.select_related('baggage', 'updated_by').order_by('-timestamp')[:10]
    recent_updates_data = StatusUpdateSerializer(recent_updates, many=True).data
    
    return Response({
        'total_baggage': total_baggage,
        'status_counts': status_counts,
        'recent_updates': recent_updates_data
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    """
    Simple health check endpoint
    """
    return Response({
        'status': 'healthy',
        'service': 'Smart Baggage Tracker API',
        'version': '1.0.0'
    })
