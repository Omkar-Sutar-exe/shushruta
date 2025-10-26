
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** shushruta
- **Date:** 2025-10-26
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001
- **Test Name:** user registration with valid data
- **Test Code:** [TC001_user_registration_with_valid_data.py](./TC001_user_registration_with_valid_data.py)
- **Test Error:** Traceback (most recent call last):
  File "<string>", line 28, in test_user_registration_with_valid_data
  File "/var/task/requests/models.py", line 1024, in raise_for_status
    raise HTTPError(http_error_msg, response=self)
requests.exceptions.HTTPError: 500 Server Error: Internal Server Error for url: http://localhost:8000/api/signup

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 43, in <module>
  File "<string>", line 30, in test_user_registration_with_valid_data
AssertionError: Request failed: 500 Server Error: Internal Server Error for url: http://localhost:8000/api/signup

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/c58365a4-c76c-4da4-8fa2-bb47a1725994/3974ffc2-efca-43e2-b630-2a0526023811
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002
- **Test Name:** user login with correct credentials
- **Test Code:** [TC002_user_login_with_correct_credentials.py](./TC002_user_login_with_correct_credentials.py)
- **Test Error:** Traceback (most recent call last):
  File "<string>", line 15, in test_user_login_with_correct_credentials
  File "/var/task/requests/models.py", line 1024, in raise_for_status
    raise HTTPError(http_error_msg, response=self)
requests.exceptions.HTTPError: 500 Server Error: Internal Server Error for url: http://localhost:8000/api/signin

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 32, in <module>
  File "<string>", line 17, in test_user_login_with_correct_credentials
AssertionError: Request exception occurred: 500 Server Error: Internal Server Error for url: http://localhost:8000/api/signin

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/c58365a4-c76c-4da4-8fa2-bb47a1725994/7ff54bd4-78bf-45f6-a534-fc9c63bd5412
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003
- **Test Name:** admin status check for authenticated user
- **Test Code:** [TC003_admin_status_check_for_authenticated_user.py](./TC003_admin_status_check_for_authenticated_user.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 43, in <module>
  File "<string>", line 19, in test_admin_status_check_authenticated_user
AssertionError: Signin failed with status 500

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/c58365a4-c76c-4da4-8fa2-bb47a1725994/bbe20b23-b8e6-4058-802e-30ea165a844c
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004
- **Test Name:** medical document upload and verification status
- **Test Code:** [TC004_medical_document_upload_and_verification_status.py](./TC004_medical_document_upload_and_verification_status.py)
- **Test Error:** Traceback (most recent call last):
  File "<string>", line 47, in test_medical_document_upload_and_verification_status
AssertionError: Unexpected status code on upload: 500

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 82, in <module>
  File "<string>", line 53, in test_medical_document_upload_and_verification_status
AssertionError: Medical document upload failed: Unexpected status code on upload: 500

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/c58365a4-c76c-4da4-8fa2-bb47a1725994/32474dfe-e18a-4517-9969-a9dca0e2e449
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005
- **Test Name:** ai powered donor recipient matching algorithm
- **Test Code:** [TC005_ai_powered_donor_recipient_matching_algorithm.py](./TC005_ai_powered_donor_recipient_matching_algorithm.py)
- **Test Error:** Traceback (most recent call last):
  File "<string>", line 19, in test_ai_powered_donor_recipient_matching_algorithm
  File "/var/task/requests/models.py", line 1024, in raise_for_status
    raise HTTPError(http_error_msg, response=self)
requests.exceptions.HTTPError: 500 Server Error: Internal Server Error for url: http://localhost:8000/api/signin

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 169, in <module>
  File "<string>", line 24, in test_ai_powered_donor_recipient_matching_algorithm
AssertionError: User signin failed: 500 Server Error: Internal Server Error for url: http://localhost:8000/api/signin

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/c58365a4-c76c-4da4-8fa2-bb47a1725994/1e30c409-c0e7-4a60-aad9-f5495d40219f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006
- **Test Name:** real time notifications delivery
- **Test Code:** [TC006_real_time_notifications_delivery.py](./TC006_real_time_notifications_delivery.py)
- **Test Error:** Traceback (most recent call last):
  File "<string>", line 18, in test_real_time_notifications_delivery
  File "/var/task/requests/models.py", line 1024, in raise_for_status
    raise HTTPError(http_error_msg, response=self)
requests.exceptions.HTTPError: 500 Server Error: Internal Server Error for url: http://localhost:8000/api/signin

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 71, in <module>
  File "<string>", line 20, in test_real_time_notifications_delivery
AssertionError: Signin request failed: 500 Server Error: Internal Server Error for url: http://localhost:8000/api/signin

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/c58365a4-c76c-4da4-8fa2-bb47a1725994/a7e15f5e-3322-4429-935a-8ea51cc3d951
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007
- **Test Name:** hospital admin dashboard real time data accuracy
- **Test Code:** [TC007_hospital_admin_dashboard_real_time_data_accuracy.py](./TC007_hospital_admin_dashboard_real_time_data_accuracy.py)
- **Test Error:** Traceback (most recent call last):
  File "<string>", line 29, in test_hospital_admin_dashboard_real_time_data_accuracy
AssertionError: Signin failed with status code 500

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 101, in <module>
  File "<string>", line 34, in test_hospital_admin_dashboard_real_time_data_accuracy
AssertionError: Authentication failed: Signin failed with status code 500

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/c58365a4-c76c-4da4-8fa2-bb47a1725994/969fa652-d83f-4ff7-8d8f-5b301db74fb5
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008
- **Test Name:** role based access control enforcement
- **Test Code:** [TC008_role_based_access_control_enforcement.py](./TC008_role_based_access_control_enforcement.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 145, in <module>
  File "<string>", line 43, in test_role_based_access_control_enforcement
AssertionError: Failed to obtain JWT token for hospital

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/c58365a4-c76c-4da4-8fa2-bb47a1725994/839e6af0-01b9-47fd-b4dd-349d9973afd8
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009
- **Test Name:** user password change functionality
- **Test Code:** [TC009_user_password_change_functionality.py](./TC009_user_password_change_functionality.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 55, in <module>
  File "<string>", line 26, in test_user_password_change_functionality
AssertionError: Expected 200 OK, got 500

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/c58365a4-c76c-4da4-8fa2-bb47a1725994/2224f6f9-8e42-405a-abb6-219166b9a701
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010
- **Test Name:** forgot password workflow initiation
- **Test Code:** [TC010_forgot_password_workflow_initiation.py](./TC010_forgot_password_workflow_initiation.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 47, in <module>
  File "<string>", line 32, in test_forgot_password_workflow_initiation
AssertionError: Unexpected status code: 500, response: Proxy server error: connect ECONNREFUSED ::1:8000

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/c58365a4-c76c-4da4-8fa2-bb47a1725994/bed22a04-0343-4a4e-9e3f-614cf92b27bb
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **0.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---