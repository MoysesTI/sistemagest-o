import requests
import uuid

BASE_URL = "http://localhost:5001"
REGISTER_URL = f"{BASE_URL}/api/auth/register"
LOGIN_URL = f"{BASE_URL}/api/auth/login"

def test_user_registration_process():
    headers = {"Content-Type": "application/json"}
    timeout = 30

    # Generate a unique email to avoid duplicates in seeded DB
    unique_email = f"testuser+{uuid.uuid4()}@prismatech.com"
    password = "TestPassword123!"
    user_data = {
        "email": unique_email,
        "senha": password
    }

    # 1. Successful Registration
    try:
        resp = requests.post(REGISTER_URL, json=user_data, headers=headers, timeout=timeout)
        assert resp.status_code == 201 or resp.status_code == 200, f"Expected 200 or 201 but got {resp.status_code}"
        resp_json = resp.json()
        # Must have some user registration confirmation, e.g., user id or success message
        assert "email" in resp_json or "id" in resp_json or "message" in resp_json

        # 2. Try to register the same user again (duplicate)
        resp_duplicate = requests.post(REGISTER_URL, json=user_data, headers=headers, timeout=timeout)
        # Expect error status code for duplicate, likely 400 or 409
        assert resp_duplicate.status_code in (400,409)

        # 3. Register with invalid data - missing email
        invalid_data_1 = {"senha": "somepassword"}
        resp_invalid_1 = requests.post(REGISTER_URL, json=invalid_data_1, headers=headers, timeout=timeout)
        assert resp_invalid_1.status_code == 400

        # 4. Register with invalid data - missing senha (password)
        invalid_data_2 = {"email": f"invalid+{uuid.uuid4()}@prismatech.com"}
        resp_invalid_2 = requests.post(REGISTER_URL, json=invalid_data_2, headers=headers, timeout=timeout)
        assert resp_invalid_2.status_code == 400

        # 5. Register with invalid data - invalid email format
        invalid_data_3 = {"email": "not-an-email", "senha": "password123"}
        resp_invalid_3 = requests.post(REGISTER_URL, json=invalid_data_3, headers=headers, timeout=timeout)
        # Assuming system validates email format and returns 400
        assert resp_invalid_3.status_code == 400

        # 6. Validate newly registered user can login with correct credentials
        login_data = {"email": unique_email, "senha": password}
        resp_login = requests.post(LOGIN_URL, json=login_data, headers=headers, timeout=timeout)
        assert resp_login.status_code == 200
        login_json = resp_login.json()
        assert "token" in login_json and isinstance(login_json["token"], str) and len(login_json["token"]) > 0

        # 7. Validate login fails for wrong password
        login_wrong_pass = {"email": unique_email, "senha": "WrongPassword"}
        resp_login_fail = requests.post(LOGIN_URL, json=login_wrong_pass, headers=headers, timeout=timeout)
        assert resp_login_fail.status_code == 401 or resp_login_fail.status_code == 400

    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"

test_user_registration_process()