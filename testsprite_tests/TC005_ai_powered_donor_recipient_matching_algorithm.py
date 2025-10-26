import requests
from requests.auth import HTTPBasicAuth
import time

BASE_URL = "http://localhost:8000"
AUTH_USERNAME = "omkardsutar476@gmail.com"
AUTH_PASSWORD = "12345678"
TIMEOUT = 30

def test_ai_powered_donor_recipient_matching_algorithm():
    # Authenticate user to get JWT token
    signin_url = f"{BASE_URL}/api/signin"
    signin_payload = {
        "email": AUTH_USERNAME,
        "password": AUTH_PASSWORD
    }
    try:
        signin_resp = requests.post(signin_url, json=signin_payload, timeout=TIMEOUT)
        signin_resp.raise_for_status()
        signin_data = signin_resp.json()
        assert "token" in signin_data, "JWT token not found in signin response"
        token = signin_data["token"]
    except Exception as e:
        assert False, f"User signin failed: {e}"

    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
    }

    # Step 1: Create donor user with specific organ and blood type and location
    donors_url = f"{BASE_URL}/api/user"
    donor_payload = {
        "name": "Test Donor",
        "email": "testdonor@example.com",
        "password": "DonorPass123!",
        "userType": "patient",
        "role": "donor",
        "organ": "kidney",
        "bloodType": "O+",
        "location": {
            "latitude": 28.6139,
            "longitude": 77.2090
        }
    }
    donor_id = None

    # Step 2: Create recipient user with compatible organ and blood type and different location with urgency
    recipient_payload = {
        "name": "Test Recipient",
        "email": "testrecipient@example.com",
        "password": "RecipientPass123!",
        "userType": "patient",
        "role": "recipient",
        "organ": "kidney",
        "bloodType": "O+",
        "urgency": 9,  # High urgency scale 1-10
        "location": {
            "latitude": 28.7041,
            "longitude": 77.1025
        }
    }
    recipient_id = None

    # Note: The exact user creation endpoint and schema for donor/recipient is not explicitly given in PRD.
    # We use /api/user/add-user as a plausible endpoint for user creation with role and medical info.
    # If not present, fall back to /api/signup for simple registration.

    try:
        # Create donor
        donor_resp = requests.post(f"{BASE_URL}/api/signup", json={
            "name": donor_payload["name"],
            "email": donor_payload["email"],
            "password": donor_payload["password"],
            "userType": donor_payload["userType"]
        }, timeout=TIMEOUT)
        donor_resp.raise_for_status()
        donor_json = donor_resp.json()
        assert donor_json.get("success") or "token" in donor_json, "Donor signup unsuccessful"
        # Assume userId returned or can be retrieved from separate users endpoint
        # For matching test, we only need to invoke matching endpoint, so let's assume test donor user exists.

        # Create recipient
        recipient_resp = requests.post(f"{BASE_URL}/api/signup", json={
            "name": recipient_payload["name"],
            "email": recipient_payload["email"],
            "password": recipient_payload["password"],
            "userType": recipient_payload["userType"]
        }, timeout=TIMEOUT)
        recipient_resp.raise_for_status()
        recipient_json = recipient_resp.json()
        assert recipient_json.get("success") or "token" in recipient_json, "Recipient signup unsuccessful"

        # Authenticate donor to get full profile update authorization (simulate profile completion)
        donor_signin_resp = requests.post(signin_url, json={"email": donor_payload["email"], "password": donor_payload["password"]}, timeout=TIMEOUT)
        donor_signin_resp.raise_for_status()
        donor_token = donor_signin_resp.json().get("token")
        donor_headers = {"Authorization": f"Bearer {donor_token}", "Accept": "application/json"}

        # Authenticate recipient similarly
        recipient_signin_resp = requests.post(signin_url, json={"email": recipient_payload["email"], "password": recipient_payload["password"]}, timeout=TIMEOUT)
        recipient_signin_resp.raise_for_status()
        recipient_token = recipient_signin_resp.json().get("token")
        recipient_headers = {"Authorization": f"Bearer {recipient_token}", "Accept": "application/json"}

        # Update donor profile with organ, blood type, location
        update_donor_resp = requests.put(f"{BASE_URL}/api/user/profile", headers=donor_headers, json={
            "organ": donor_payload["organ"],
            "bloodType": donor_payload["bloodType"],
            "location": donor_payload["location"]
        }, timeout=TIMEOUT)
        update_donor_resp.raise_for_status()

        # Update recipient profile with organ, blood type, urgency, location
        update_recipient_resp = requests.put(f"{BASE_URL}/api/user/profile", headers=recipient_headers, json={
            "organ": recipient_payload["organ"],
            "bloodType": recipient_payload["bloodType"],
            "urgency": recipient_payload["urgency"],
            "location": recipient_payload["location"]
        }, timeout=TIMEOUT)
        update_recipient_resp.raise_for_status()

        # Allow some time or trigger matching algorithm (may be async)
        time.sleep(3)

        # Step 3: Call AI-powered matching algorithm endpoint for the recipient user
        # Assuming endpoint /api/matching/get-matches that requires recipient auth and returns prioritized matches
        matches_resp = requests.get(f"{BASE_URL}/api/matching/get-matches", headers=recipient_headers, timeout=TIMEOUT)
        matches_resp.raise_for_status()
        matches_data = matches_resp.json()
        assert "matches" in matches_data and isinstance(matches_data["matches"], list), "Matches data missing or invalid"

        matches = matches_data["matches"]
        assert len(matches) > 0, "No matches found by AI-powered matching algorithm"

        # Validate prioritization by urgency, compatibility, distance
        # We'll check the first match is compatible with organ and blood type and within reasonable geographic distance
        first_match = matches[0]
        assert first_match.get("organ") == recipient_payload["organ"], "First match organ type incompatible"
        assert first_match.get("bloodType") == recipient_payload["bloodType"], "First match blood type incompatible"
        assert "distance" in first_match, "Distance information missing in match"
        assert "urgency" in first_match, "Urgency information missing in match"

        # Check that matches are ordered by urgency descending (higher urgency first)
        urgencies = [m.get("urgency", 0) for m in matches]
        assert urgencies == sorted(urgencies, reverse=True), "Matches not prioritized correctly by urgency"

    finally:
        # Cleanup - delete test users if possible
        # Assuming authenticated admin with original token can delete users

        def delete_user_by_email(email):
            # fetch user list to find userId by email
            users_resp = requests.get(f"{BASE_URL}/api/user/all-user", headers=headers, timeout=TIMEOUT)
            if users_resp.status_code == 200:
                users = users_resp.json().get("users", [])
                for u in users:
                    if u.get("email") == email:
                        try:
                            del_resp = requests.delete(f"{BASE_URL}/api/user/delete/{u.get('_id')}", headers=headers, timeout=TIMEOUT)
                            del_resp.raise_for_status()
                        except:
                            pass

        delete_user_by_email(donor_payload["email"])
        delete_user_by_email(recipient_payload["email"])


test_ai_powered_donor_recipient_matching_algorithm()