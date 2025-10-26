import requests
from requests.auth import HTTPBasicAuth

def test_forgot_password_workflow_initiation():
    base_url = "http://localhost:8000"
    endpoint = "/api/user/forgot-password"
    url = base_url + endpoint

    # Basic token authentication credentials
    username = "omkardsutar476@gmail.com"
    password = "12345678"

    headers = {
        "Content-Type": "application/json"
    }

    payload = {
        "email": username
    }

    try:
        response = requests.post(
            url,
            json=payload,
            headers=headers,
            auth=HTTPBasicAuth(username, password),
            timeout=30
        )
    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code in (200, 202), f"Unexpected status code: {response.status_code}, response: {response.text}"

    # Assuming API returns a JSON with a message about email sent or similar
    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not a valid JSON"

    msg_keys = ["message", "msg", "detail", "status"]
    assert any(k in data for k in msg_keys), f"Response JSON missing expected message keys: {data}"

    # Check that message indicates email was sent or reset initiated
    message = next((data[k] for k in msg_keys if k in data), "").lower()
    assert "email" in message or "reset" in message, f"Unexpected message content: {message}"

test_forgot_password_workflow_initiation()