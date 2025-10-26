import requests

BASE_URL = "http://localhost:8000"
SIGNUP_ENDPOINT = "/api/signup"
TIMEOUT = 30

def test_user_registration_with_valid_data():
    url = BASE_URL + SIGNUP_ENDPOINT
    headers = {
        "Content-Type": "application/json"
    }

    # Valid user registration data
    payload = {
        "name": "Test User",
        "email": "testuser+tc001@example.com",
        "password": "StrongPass!123",
        "userType": "patient"
    }

    try:
        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=TIMEOUT
        )
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"

    json_response = None
    try:
        json_response = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Validate JWT token presence (assuming key 'token')
    assert "token" in json_response, "Response JSON does not contain 'token' for authentication"
    token = json_response["token"]
    assert isinstance(token, str) and len(token) > 0, "JWT token is empty or invalid"

test_user_registration_with_valid_data()
