import requests

BASE_URL = "http://localhost:5001"
LOGIN_ENDPOINT = "/api/auth/login"
TIMEOUT = 30

def test_user_login_functionality():
    headers = {"Content-Type": "application/json"}

    # Valid credentials test
    valid_payload = {
        "email": "admin@prismatech.com",
        "senha": "admin123"
    }
    try:
        response = requests.post(
            BASE_URL + LOGIN_ENDPOINT,
            json=valid_payload,
            headers=headers,
            timeout=TIMEOUT
        )
        assert response.status_code == 200, f"Expected 200 OK, got {response.status_code}"
        data = response.json()
        assert "token" in data and isinstance(data["token"], str) and data["token"], "Token missing or empty in response"
    except requests.RequestException as e:
        assert False, f"Request failed for valid credentials: {e}"

    # Invalid credentials test
    invalid_payload = {
        "email": "admin@prismatech.com",
        "senha": "wrongpassword"
    }
    try:
        response = requests.post(
            BASE_URL + LOGIN_ENDPOINT,
            json=invalid_payload,
            headers=headers,
            timeout=TIMEOUT
        )
        # Expect unauthorized or appropriate error status code
        assert response.status_code in (400, 401), f"Expected 400 or 401, got {response.status_code}"
        data = response.json()
        # Assuming error message or indication in response
        assert ("error" in data or "message" in data), "Error message missing in invalid login response"
    except requests.RequestException as e:
        assert False, f"Request failed for invalid credentials: {e}"

test_user_login_functionality()