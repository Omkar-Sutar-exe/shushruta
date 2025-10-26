import requests

def test_user_login_with_correct_credentials():
    base_url = "http://localhost:8000"
    signin_url = f"{base_url}/api/signin"
    payload = {
        "email": "omkardsutar476@gmail.com",
        "password": "12345678"
    }
    headers = {
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(signin_url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
    except requests.RequestException as e:
        assert False, f"Request exception occurred: {e}"

    # Validate HTTP status code
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"

    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Validate presence of JWT token
    token = data.get("token")

    assert token is not None and isinstance(token, str) and len(token) > 0, "JWT token missing or invalid in response"

test_user_login_with_correct_credentials()
