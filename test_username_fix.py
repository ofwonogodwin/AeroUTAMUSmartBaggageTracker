#!/usr/bin/env python3
import requests
import json
import time

# Wait for server to start
time.sleep(2)

# Test registration endpoint with space in username
url = "http://localhost:8000/api/auth/register/"
data = {
    "username": "Raheem K",
    "email": "kamwangaraheem2050@gmail.com",
    "first_name": "Kamwanga",
    "last_name": "Raheem",
    "password": "Raheem#404",
    "password_confirm": "Raheem#404",
    "role": "PASSENGER",
    "employee_id": "",
    "department": ""
}

headers = {
    "Content-Type": "application/json"
}

print(f"Testing registration with space in username at: {url}")
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