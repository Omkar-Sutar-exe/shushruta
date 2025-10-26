import requests

BASE_URL = "http://localhost:8000"
TIMEOUT = 30

def test_admin_status_check_authenticated_user():
    signin_url = f"{BASE_URL}/api/signin"
    isadmin_url = f"{BASE_URL}/api/isadmin"

    signin_payload = {
        "email": "omkardsutar476@gmail.com",
        "password": "12345678"
    }
    headers = {"Content-Type": "application/json"}

    try:
        # Authenticate user and get JWT token
        signin_response = requests.post(signin_url, json=signin_payload, headers=headers, timeout=TIMEOUT)
        assert signin_response.status_code == 200, f"Signin failed with status {signin_response.status_code}"
        signin_json = signin_response.json()
        assert "token" in signin_json, "JWT token not found in signin response"
        token = signin_json["token"]

        # Check admin status with valid JWT token
        auth_headers = {
            "Authorization": f"Bearer {token}"
        }
        isadmin_response = requests.post(isadmin_url, headers=auth_headers, timeout=TIMEOUT)
        assert isadmin_response.status_code == 200, f"isadmin endpoint failed with status {isadmin_response.status_code}"
        isadmin_json = isadmin_response.json()

        # The response should indicate admin status; expecting a boolean or relevant key
        assert isinstance(isadmin_json, dict), "isadmin response is not a JSON object"
        assert "isAdmin" in isadmin_json or "admin" in isadmin_json, "Admin status field missing in response"

        # Determine which key is present and check that it is boolean
        admin_key = "isAdmin" if "isAdmin" in isadmin_json else "admin"
        assert isinstance(isadmin_json[admin_key], bool), f"Admin status field '{admin_key}' is not a boolean"

    except requests.RequestException as e:
        assert False, f"Request failed: {str(e)}"

test_admin_status_check_authenticated_user()
