import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model
from tracking.models import Baggage

User = get_user_model()


class BaggageUpdateConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time baggage status updates
    """
    
    async def connect(self):
        self.baggage_id = self.scope['url_route']['kwargs']['baggage_id']
        self.room_group_name = f'baggage_{self.baggage_id}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send current baggage status on connection
        baggage_data = await self.get_baggage_data()
        if baggage_data:
            await self.send(text_data=json.dumps({
                'type': 'connection_established',
                'baggage': baggage_data
            }))
        else:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Baggage not found'
            }))
    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        """
        Handle incoming WebSocket messages
        """
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type')
            
            if message_type == 'get_status':
                # Send current baggage status
                baggage_data = await self.get_baggage_data()
                await self.send(text_data=json.dumps({
                    'type': 'status_update',
                    'baggage': baggage_data
                }))
            elif message_type == 'authenticate':
                # Handle authentication if needed
                token = text_data_json.get('token')
                user = await self.authenticate_token(token)
                if user:
                    self.scope['user'] = user
                    await self.send(text_data=json.dumps({
                        'type': 'authenticated',
                        'user': user.username
                    }))
                else:
                    await self.send(text_data=json.dumps({
                        'type': 'authentication_failed',
                        'message': 'Invalid token'
                    }))
            
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))
    
    async def baggage_update(self, event):
        """
        Handle baggage update messages from group
        """
        message = event['message']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'baggage_update',
            'data': message
        }))
    
    @database_sync_to_async
    def get_baggage_data(self):
        """
        Get current baggage data from database
        """
        try:
            baggage = Baggage.objects.get(id=self.baggage_id)
            return {
                'id': str(baggage.id),
                'qr_code': baggage.qr_code,
                'passenger_name': baggage.passenger_name,
                'flight_number': baggage.flight_number,
                'destination': baggage.destination,
                'current_status': baggage.current_status,
                'current_status_display': baggage.get_current_status_display(),
                'created_at': baggage.created_at.isoformat(),
                'updated_at': baggage.updated_at.isoformat(),
            }
        except Baggage.DoesNotExist:
            return None
    
    @database_sync_to_async
    def authenticate_token(self, token):
        """
        Authenticate JWT token
        """
        try:
            UntypedToken(token)
            # If we get here, the token is valid
            # You can decode it to get user info if needed
            return AnonymousUser()  # Simplified for now
        except (InvalidToken, TokenError):
            return None


class GeneralNotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for general notifications and alerts
    """
    
    async def connect(self):
        self.room_group_name = 'general_notifications'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send welcome message
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to notification system'
        }))
    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        """
        Handle incoming WebSocket messages
        """
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type')
            
            if message_type == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'pong',
                    'timestamp': text_data_json.get('timestamp')
                }))
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))
    
    async def general_notification(self, event):
        """
        Handle general notification messages
        """
        message = event['message']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'data': message
        }))