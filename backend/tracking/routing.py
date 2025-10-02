from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/baggage/(?P<baggage_id>[0-9a-f-]+)/$', consumers.BaggageUpdateConsumer.as_asgi()),
    re_path(r'ws/notifications/$', consumers.GeneralNotificationConsumer.as_asgi()),
]