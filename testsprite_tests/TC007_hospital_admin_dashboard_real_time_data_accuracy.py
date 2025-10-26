import requests
from requests.auth import HTTPBasicAuth

BASE_URL = "http://localhost:8000"
USERNAME = "omkardsutar476@gmail.com"
PASSWORD = "12345678"
TIMEOUT = 30

def test_hospital_admin_dashboard_real_time_data_accuracy():
    """
    Test the hospital admin dashboard to verify that it displays accurate real-time data for
    active donors, recipients, document verification statuses, and donation queues, reflecting
    the current system state.
    """

    session = requests.Session()
    session.auth = HTTPBasicAuth(USERNAME, PASSWORD)

    # Step 1: Sign in to obtain JWT token for authorization (since PRD uses JWT and basic auth is given, 
    # but typically combo, try to get token from signin endpoint)
    signin_url = f"{BASE_URL}/api/signin"
    signin_payload = {
        "email": USERNAME,
        "password": PASSWORD
    }

    try:
        signin_resp = session.post(signin_url, json=signin_payload, timeout=TIMEOUT)
        assert signin_resp.status_code == 200, "Signin failed with status code {}".format(signin_resp.status_code)
        signin_data = signin_resp.json()
        assert "token" in signin_data, "JWT token not found in signin response"
        token = signin_data["token"]
    except Exception as e:
        raise AssertionError(f"Authentication failed: {str(e)}")

    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    }

    # Step 2: Access the hospital admin dashboard endpoint
    dashboard_url = f"{BASE_URL}/admin/dashboard"
    try:
        dashboard_resp = session.get(dashboard_url, headers=headers, timeout=TIMEOUT)
        assert dashboard_resp.status_code == 200, "Admin dashboard request failed with status code {}".format(dashboard_resp.status_code)
        dashboard_data = dashboard_resp.json()
    except Exception as e:
        raise AssertionError(f"Failed to fetch admin dashboard data: {str(e)}")

    # Step 3: Validate the dashboard real-time data keys and value types
    # Verify keys for active donors, active recipients, document verification statuses, donation queues
    expected_keys = [
        "activeDonors",
        "activeRecipients",
        "documentVerificationStatus",
        "donationQueues"
    ]

    for key in expected_keys:
        assert key in dashboard_data, f"Dashboard response missing expected key: {key}"

    # Validate that active donors and recipients counts are integers >= 0
    active_donors = dashboard_data.get("activeDonors")
    active_recipients = dashboard_data.get("activeRecipients")
    doc_ver_status = dashboard_data.get("documentVerificationStatus")
    donation_queues = dashboard_data.get("donationQueues")

    assert isinstance(active_donors, int) and active_donors >= 0, "Invalid activeDonors count"
    assert isinstance(active_recipients, int) and active_recipients >= 0, "Invalid activeRecipients count"

    # documentVerificationStatus expected to be a dict with verification states counts
    assert isinstance(doc_ver_status, dict), "documentVerificationStatus should be a dictionary"
    # Check some expected states presence
    expected_doc_states = ["pending", "verified", "rejected"]
    for state in expected_doc_states:
        assert state in doc_ver_status, f"Document verification status missing state: {state}"
        count = doc_ver_status[state]
        assert isinstance(count, int) and count >= 0, f"Invalid count for document verification state {state}"

    # donationQueues expected to be a list or dict with queue info
    assert isinstance(donation_queues, (list, dict)), "donationQueues should be a list or dict"
    # If dict, check keys for queue categories; if list, check elements are dicts
    if isinstance(donation_queues, dict):
        for queue_name, queue_info in donation_queues.items():
            assert isinstance(queue_name, str), "Queue name should be a string"
            assert isinstance(queue_info, (list, dict)), "Queue info should be a list or dict"
    else:  # list
        for item in donation_queues:
            assert isinstance(item, dict), "Each queue item should be a dictionary"

    # Additional simple consistency check: active donors and donors in queue should correlate if possible
    if isinstance(donation_queues, dict) and "donorQueue" in donation_queues:
        donor_queue = donation_queues["donorQueue"]
        if isinstance(donor_queue, list):
            # donorQueue length should not exceed activeDonors
            assert len(donor_queue) <= active_donors, "Donor queue longer than active donors count"

    # If all assertions pass, test is successful
    print("Test TC007: hospital admin dashboard real time data accuracy - PASSED")

test_hospital_admin_dashboard_real_time_data_accuracy()