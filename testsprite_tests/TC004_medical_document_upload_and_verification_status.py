import requests
from requests.auth import HTTPBasicAuth
import os
import io

BASE_URL = "http://localhost:8000"
TIMEOUT = 30
USERNAME = "omkardsutar476@gmail.com"
PASSWORD = "12345678"

def test_medical_document_upload_and_verification_status():
    # Step 1: Authenticate user to get JWT token via /api/signin
    signin_url = f"{BASE_URL}/api/signin"
    signin_payload = {
        "email": USERNAME,
        "password": PASSWORD
    }
    try:
        signin_resp = requests.post(signin_url, json=signin_payload, timeout=TIMEOUT)
        signin_resp.raise_for_status()
        signin_data = signin_resp.json()
        token = signin_data.get("token") or signin_data.get("jwt")  # token key might vary
        assert token is not None, "Authentication token not found in response."
    except Exception as e:
        raise AssertionError(f"User authentication failed: {e}")

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Step 2: Upload a medical document (PDF or image) using appropriate endpoint
    # The PRD does not specify exact upload endpoint for medical documents, typical RESTful would be /api/medical-document/upload or similar.
    # Since endpoints are not explicitly given in PRD, we'll try a likely endpoint /api/medical-document/upload with form-data
    
    upload_url = f"{BASE_URL}/api/medical-document/upload"
    
    # Create a simple dummy PDF file in-memory
    pdf_content = b"%PDF-1.4\n%Dummy PDF file for testing\n"
    
    files = {
        "document": ("test_medical_report.pdf", io.BytesIO(pdf_content), "application/pdf")
    }

    try:
        upload_resp = requests.post(upload_url, headers=headers, files=files, timeout=TIMEOUT)
        # Expect 200 or 201 status code
        assert upload_resp.status_code in (200, 201), f"Unexpected status code on upload: {upload_resp.status_code}"
        upload_json = upload_resp.json()
        # Expect some returned id or document metadata
        document_id = upload_json.get("documentId") or upload_json.get("_id") or upload_json.get("id")
        assert document_id is not None, "Document ID not returned after upload."
    except Exception as e:
        raise AssertionError(f"Medical document upload failed: {e}")
    
    try:
        # Step 3: Verify the uploaded document's verification status for hospital admin review
        # The PRD mentions admin dashboard and document verification status tracking
        # Let's assume an endpoint to get document status: /api/medical-document/status/{document_id}
        status_url = f"{BASE_URL}/api/medical-document/status/{document_id}"
        status_resp = requests.get(status_url, headers=headers, timeout=TIMEOUT)
        status_resp.raise_for_status()
        status_json = status_resp.json()
        
        # Check verification status exists and is among expected states
        verification_status = status_json.get("verificationStatus") or status_json.get("status")
        assert verification_status is not None, "Verification status not found in status response."
        # Possible statuses could be: pending, verified, rejected - check for one of these string values
        assert verification_status.lower() in ("pending", "verified", "rejected"), f"Unexpected verification status value: {verification_status}"
        
    finally:
        # Step 4: Cleanup - delete the uploaded document
        # Assume DELETE endpoint /api/medical-document/{document_id}
        delete_url = f"{BASE_URL}/api/medical-document/{document_id}"
        try:
            del_resp = requests.delete(delete_url, headers=headers, timeout=TIMEOUT)
            # Allow 200 OK or 204 No Content as success
            assert del_resp.status_code in (200, 204), f"Unexpected status code on delete: {del_resp.status_code}"
        except Exception as e:
            # If deletion fails, log but do not fail test since test upload and verification passed
            print(f"Warning: failed to delete medical document {document_id}: {e}")

test_medical_document_upload_and_verification_status()