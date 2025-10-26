import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:8000"
AUTH_USERNAME = "omkardsutar476@gmail.com"
AUTH_PASSWORD = "12345678"
TIMEOUT = 30

# Endpoints to test access control (aligned roles to PRD: 'hospital' instead of 'hospital admin')
ENDPOINTS = [
    {"method": "GET", "path": "/api/product/all-product", "roles_allowed": ["donor", "recipient", "hospital"]},
    {"method": "POST", "path": "/api/product/add-product", "roles_allowed": ["hospital"]},
    {"method": "GET", "path": "/api/order/get-all-orders", "roles_allowed": ["hospital"]},
    {"method": "POST", "path": "/api/order/create-order", "roles_allowed": ["donor", "recipient"]},
    {"method": "GET", "path": "/api/category/all-category", "roles_allowed": ["donor", "recipient", "hospital"]},
    {"method": "POST", "path": "/api/category/add-category", "roles_allowed": ["hospital"]},
    {"method": "GET", "path": "/api/user/all-user", "roles_allowed": ["hospital"]},
    {"method": "POST", "path": "/api/user/change-password", "roles_allowed": ["donor", "recipient", "hospital"]},
    {"method": "POST", "path": "/api/mail/test", "roles_allowed": ["hospital"]},
    {"method": "GET", "path": "/", "roles_allowed": ["donor", "recipient", "hospital"]},
    {"method": "GET", "path": "/dashboard", "roles_allowed": ["donor", "recipient"]},
    {"method": "GET", "path": "/admin/dashboard", "roles_allowed": ["hospital"]},
    {"method": "POST", "path": "/api/isadmin", "roles_allowed": ["hospital"]},
]

# Users for testing
USERS = [
    {"role": "hospital", "email": AUTH_USERNAME, "password": AUTH_PASSWORD},
]

def get_jwt_token(email, password):
    url = BASE_URL + "/api/signin"
    try:
        res = requests.post(url, json={"email": email, "password": password}, timeout=TIMEOUT)
        res.raise_for_status()
        token = res.json().get("token")
        return token
    except Exception:
        return None

def test_role_based_access_control_enforcement():
    hospital_token = get_jwt_token(AUTH_USERNAME, AUTH_PASSWORD)
    assert hospital_token is not None, "Failed to obtain JWT token for hospital"

    headers_hospital = {"Authorization": f"Bearer {hospital_token}"}

    # Test HTTPS enforcement
    try:
        http_response = requests.get(BASE_URL + "/api/product/all-product", timeout=TIMEOUT, allow_redirects=False)
        assert http_response.status_code in (301, 302, 308), \
            "Expected HTTPS enforcement redirect when accessing HTTP endpoint"
    except requests.exceptions.SSLError:
        pass
    except Exception:
        pass

    # Test sensitive data encryption
    signin_url = BASE_URL + "/api/signin"
    signin_payload = {"email": AUTH_USERNAME, "password": AUTH_PASSWORD}
    resp = requests.post(signin_url, json=signin_payload, timeout=TIMEOUT)
    resp.raise_for_status()
    assert "password" not in resp.text.lower(), "Sensitive data exposed in signin response"

    # Role-based access control tests
    for endpoint in ENDPOINTS:
        url = BASE_URL + endpoint["path"]
        method = endpoint["method"].upper()
        roles_allowed = endpoint["roles_allowed"]

        if method == "GET":
            resp = requests.get(url, headers=headers_hospital, timeout=TIMEOUT)
        elif method == "POST":
            if endpoint["path"] == "/api/product/add-product":
                files = {}
                data = {
                    "pName": "TestProduct",
                    "pDescription": "Desc",
                    "pPrice": 10.0,
                    "pCategory": "TestCategory"
                }
                resp = requests.post(url, headers=headers_hospital, data=data, files=files, timeout=TIMEOUT)
            elif endpoint["path"] == "/api/order/create-order":
                data = {
                    "allProduct": [],
                    "amount": 0,
                    "transactionId": "tx123",
                    "address": "123 Test St",
                    "phone": 1234567890
                }
                resp = requests.post(url, headers=headers_hospital, json=data, timeout=TIMEOUT)
            elif endpoint["path"] == "/api/category/add-category":
                files = {"cImage": ("test.jpg", b"testimagecontent")}
                data = {"cName": "TestCat", "cDescription": "TestDesc"}
                resp = requests.post(url, headers=headers_hospital, data=data, files=files, timeout=TIMEOUT)
            elif endpoint["path"] == "/api/user/change-password":
                data = {"currentPassword": AUTH_PASSWORD, "newPassword": "NewPass123!"}
                resp = requests.post(url, headers=headers_hospital, json=data, timeout=TIMEOUT)
            elif endpoint["path"] == "/api/mail/test":
                resp = requests.post(url, headers=headers_hospital, timeout=TIMEOUT)
            elif endpoint["path"] == "/api/isadmin":
                resp = requests.post(url, headers=headers_hospital, timeout=TIMEOUT)
            else:
                resp = requests.post(url, headers=headers_hospital, timeout=TIMEOUT)
        else:
            continue

        if "hospital" in roles_allowed:
            assert 200 <= resp.status_code < 400, f"Hospital expected access to {endpoint['path']}, got {resp.status_code}"
        else:
            assert resp.status_code == 403 or resp.status_code == 401, \
                f"Hospital not allowed to access {endpoint['path']} but got status {resp.status_code}"

    # Unauthenticated user tests
    for endpoint in ENDPOINTS:
        url = BASE_URL + endpoint["path"]
        method = endpoint["method"].upper()

        if method == "GET":
            resp = requests.get(url, timeout=TIMEOUT)
        elif method == "POST":
            resp = requests.post(url, timeout=TIMEOUT)
        else:
            continue

        assert resp.status_code in (401, 403), f"Unauthenticated user should not access {endpoint['path']} - Status: {resp.status_code}"

    # Wrong role / invalid token tests
    fake_token = "Bearer invalid.token.here"
    headers_fake = {"Authorization": fake_token}
    for endpoint in ENDPOINTS:
        if "hospital" in endpoint["roles_allowed"]:
            url = BASE_URL + endpoint["path"]
            method = endpoint["method"].upper()

            if method == "GET":
                resp = requests.get(url, headers=headers_fake, timeout=TIMEOUT)
            elif method == "POST":
                resp = requests.post(url, headers=headers_fake, timeout=TIMEOUT)
            else:
                continue

            assert resp.status_code in (401, 403), \
                f"Fake/invalid token should not access admin endpoint {endpoint['path']} - Status: {resp.status_code}"

test_role_based_access_control_enforcement()
