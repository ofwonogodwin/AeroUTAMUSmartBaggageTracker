import requests
import json

# Login as staff
login_data = {
    "username": "admin",
    "password": "admin123"
}

print("Logging in as staff...")
login_response = requests.post('http://localhost:8000/api/auth/staff-login/', json=login_data)
print(f"Login status: {login_response.status_code}")

if login_response.status_code == 200:
    tokens = login_response.json()
    access_token = tokens.get('access')
    print(f"Got access token: {access_token[:20]}...")
    
    # Get a baggage ID
    headers = {'Authorization': f'Bearer {access_token}'}
    baggage_response = requests.get('http://localhost:8000/api/baggage/?page_size=1', headers=headers)
    
    if baggage_response.status_code == 200:
        baggage_data = baggage_response.json()
        if baggage_data['results']:
            baggage_id = baggage_data['results'][0]['id']
            print(f"Testing with baggage ID: {baggage_id}")
            
            # Try to update status
            update_data = {
                "status": "LOADED",
                "location": "Gate A12",
                "notes": "Test update from script"
            }
            
            update_url = f'http://localhost:8000/api/baggage/{baggage_id}/update/'
            print(f"Updating status at: {update_url}")
            update_response = requests.post(update_url, json=update_data, headers=headers)
            
            print(f"Update status: {update_response.status_code}")
            print(f"Response: {json.dumps(update_response.json(), indent=2)}")
        else:
            print("No baggage found")
    else:
        print(f"Failed to get baggage: {baggage_response.status_code}")
        print(baggage_response.text)
else:
    print(f"Login failed: {login_response.text}")
