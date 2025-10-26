import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:8000"
USERNAME = "omkardsutar476@gmail.com"
CURRENT_PASSWORD = "12345678"
NEW_PASSWORD = "NewPass1234!"

def test_user_password_change_functionality():
    session = requests.Session()
    session.auth = HTTPBasicAuth(USERNAME, CURRENT_PASSWORD)
    session.headers.update({
        "Content-Type": "application/json"
    })

    change_password_url = f"{BASE_URL}/api/user/change-password"
    signin_url = f"{BASE_URL}/api/signin"

    try:
        # Step 1: Change password with current password and new password
        change_payload = {
            "currentPassword": CURRENT_PASSWORD,
            "newPassword": NEW_PASSWORD
        }
        change_resp = session.post(change_password_url, json=change_payload, timeout=30)
        assert change_resp.status_code == 200, f"Expected 200 OK, got {change_resp.status_code}"
        change_json = change_resp.json()
        assert change_json.get("success", True) or ("message" in change_json), "Response should indicate success or message"

        # Step 2: Verify that with old password, login fails
        signin_resp_old = requests.post(signin_url, json={"email": USERNAME, "password": CURRENT_PASSWORD}, timeout=30)
        # Expect unauthorized or failure
        assert signin_resp_old.status_code in (400,401,403), "Login with old password should fail"

        # Step 3: Verify that with new password, login succeeds (returns JWT token)
        signin_resp_new = requests.post(signin_url, json={"email": USERNAME, "password": NEW_PASSWORD}, timeout=30)
        assert signin_resp_new.status_code == 200, f"Login with new password failed: {signin_resp_new.status_code}"
        signin_json = signin_resp_new.json()
        token = signin_json.get("token") or signin_json.get("jwt") or signin_json.get("accessToken")
        assert token and isinstance(token, str) and len(token) > 0, "Login response missing JWT token"

    finally:
        # Step 4: Reset password back to original to maintain test idempotency
        # Authenticate using new password
        session.auth = HTTPBasicAuth(USERNAME, NEW_PASSWORD)
        reset_payload = {
            "currentPassword": NEW_PASSWORD,
            "newPassword": CURRENT_PASSWORD
        }
        reset_resp = session.post(change_password_url, json=reset_payload, timeout=30)
        # Ideally ensure reset succeeded, but do not fail test if reset fails
        if reset_resp.status_code != 200:
            print(f"Warning: failed to reset password after test, status code {reset_resp.status_code}")

test_user_password_change_functionality()
