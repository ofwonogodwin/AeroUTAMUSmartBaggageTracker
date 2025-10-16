#!/bin/bash

echo "=== Testing Staff Update Flow ==="

# 1. Login as staff
echo "1. Logging in as staff1..."
LOGIN=$(curl -s -X POST http://localhost:8000/api/auth/staff-login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "staff1", "password": "staff123"}')

TOKEN=$(echo $LOGIN | grep -o '"access":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Login failed"
    exit 1
fi

echo "✅ Login successful"

# 2. Get baggage by QR code
echo ""
echo "2. Getting baggage BAG-F781DD59 (Emma Davis)..."
BAGGAGE=$(curl -s -X GET "http://localhost:8000/api/baggage/qr/BAG-F781DD59/" \
  -H "Authorization: Bearer $TOKEN")

BAGGAGE_ID=$(echo $BAGGAGE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
CURRENT_STATUS=$(echo $BAGGAGE | grep -o '"current_status":"[^"]*' | cut -d'"' -f4)

if [ -z "$BAGGAGE_ID" ]; then
    echo "❌ Failed to get baggage"
    exit 1
fi

echo "✅ Baggage found: $BAGGAGE_ID"
echo "   Current status: $CURRENT_STATUS"

# 3. Try to update status
echo ""
echo "3. Updating status to LOADED..."
UPDATE=$(curl -s -X POST "http://localhost:8000/api/baggage/$BAGGAGE_ID/update/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "LOADED", "location": "Gate A12", "notes": "Test update for demo"}')

echo "$UPDATE" | python3 -m json.tool 2>/dev/null || echo "Raw response: $UPDATE"

# Check if update was successful
if echo "$UPDATE" | grep -q "Status updated successfully"; then
    echo ""
    echo "✅ UPDATE SUCCESSFUL!"
    echo ""
    echo "4. Verifying the update..."
    VERIFY=$(curl -s -X GET "http://localhost:8000/api/baggage/qr/BAG-F781DD59/" \
      -H "Authorization: Bearer $TOKEN")
    NEW_STATUS=$(echo $VERIFY | grep -o '"current_status":"[^"]*' | cut -d'"' -f4)
    echo "   New status: $NEW_STATUS"
else
    echo ""
    echo "❌ UPDATE FAILED"
    echo "Response: $UPDATE"
fi
