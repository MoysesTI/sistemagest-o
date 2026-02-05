import requests

BASE_URL = "http://localhost:5001"
LOGIN_ENDPOINT = "/api/auth/login"
ME_ENDPOINT = "/api/auth/me"
TIMEOUT = 30

def test_retrieve_logged_in_user_data():
    login_url = BASE_URL + LOGIN_ENDPOINT
    me_url = BASE_URL + ME_ENDPOINT
    
    credentials = {
        "email": "admin@prismatech.com",
        "senha": "admin123"
    }
    
    # Authenticate and get token
    try:
        login_resp = requests.post(login_url, json=credentials, timeout=TIMEOUT)
        assert login_resp.status_code == 200, f"Login failed with status {login_resp.status_code}"
        login_data = login_resp.json()
        token = login_data.get("token")
        assert token, "Token not found in login response"
    except Exception as e:
        raise AssertionError(f"Login request failed: {e}")
    
    headers_auth = {"Authorization": f"Bearer {token}"}
    
    # Retrieve user data with authentication
    try:
        me_resp = requests.get(me_url, headers=headers_auth, timeout=TIMEOUT)
        assert me_resp.status_code == 200, f"Authenticated user data request failed with status {me_resp.status_code}"
        user_data = me_resp.json()
        assert isinstance(user_data, dict), "User data response is not a JSON object"
        # Confirm expected fields present in user data
        expected_keys = ["id", "nome"]
        for key in expected_keys:
            assert key in user_data, f"Expected key '{key}' not found in user data"
        if "email" in user_data:
            assert user_data["email"].lower() == credentials["email"].lower(), "Returned user email does not match logged in email"
    except Exception as e:
        raise AssertionError(f"Fetching authenticated user data failed: {e}")
    
    # Attempt to access user data without authentication
    try:
        me_resp_no_auth = requests.get(me_url, timeout=TIMEOUT)
        assert me_resp_no_auth.status_code in (401, 403), f"Unauthorized access did not return 401 or 403 but {me_resp_no_auth.status_code}"
    except Exception as e:
        raise AssertionError(f"Request without authentication failed unexpectedly: {e}")

test_retrieve_logged_in_user_data()
