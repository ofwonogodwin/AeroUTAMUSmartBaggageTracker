#!/bin/bash

# Login as staff
echo "Logging in as staff..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/staff-login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}')

echo "Login response: $LOGIN_RESPONSE"

# Extract access token
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    echo "Failed to get access token"
    exit 1
fi

echo "Got access token: ${ACCESS_TOKEN:0:20}..."

# Get first baggage
echo "Getting baggage..."
BAGGAGE_RESPONSE=$(curl -s -X GET "http://localhost:8000/api/baggage/?page_size=1" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

BAGGAGE_ID=$(echo $BAGGAGE_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$BAGGAGE_ID" ]; then
    echo "Failed to get baggage ID"
    exit 1
fi

echo "Testing with baggage ID: $BAGGAGE_ID"

# Try to update status
echo "Updating baggage status..."
UPDATE_RESPONSE=$(curl -s -X POST "http://localhost:8000/api/baggage/$BAGGAGE_ID/update/" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "LOADED", "location": "Gate A12", "notes": "Test update"}')

echo "Update response:"
echo $UPDATE_RESPONSE | python3 -m json.tool
