#!/usr/bin/env python3
import requests
import json

# Test login endpoint
url = "http://localhost:8000/api/auth/login/"
data = {
    "username": "testuser1",
    "password": "testpass123"
}

headers = {
    "Content-Type": "application/json"
}

print(f"Testing login at: {url}")
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