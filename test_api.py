#!/usr/bin/env python3
import requests
import json
import time

# Wait for server to start
time.sleep(3)

# Test registration endpoint
url = "http://localhost:8000/api/auth/register/"
data = {
    "username": "testuser1",
    "email": "test1@test.com",
    "password": "testpass123",
    "password_confirm": "testpass123",
    "first_name": "Test",
    "last_name": "User",
    "role": "PASSENGER"
}

headers = {
    "Content-Type": "application/json"
}

print(f"Testing registration at: {url}")
print(f"Data: {json.dumps(data, indent=2)}")

try:
    response = requests.post(url, json=data, headers=headers, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    
    try:
        print(f"Response JSON: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response Text: {response.text}")
        
except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")