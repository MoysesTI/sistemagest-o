import requests

BASE_URL = "http://localhost:5001"
LOGIN_ENDPOINT = "/api/auth/login"
SCHEDULE_ENDPOINT = "/api/cronograma"
AUTH_EMAIL = "admin@prismatech.com"
AUTH_PASSWORD = "admin123"
TIMEOUT = 30

def test_list_schedule_entries():
    # Login to get the token
    login_payload = {
        "email": AUTH_EMAIL,
        "senha": AUTH_PASSWORD
    }
    try:
        login_response = requests.post(
            BASE_URL + LOGIN_ENDPOINT,
            json=login_payload,
            timeout=TIMEOUT
        )
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"
        login_data = login_response.json()
        assert "token" in login_data, "No token found in login response"
        token = login_data["token"]

        # Use token to get schedule listing
        headers = {
            "Authorization": f"Bearer {token}"
        }
        schedule_response = requests.get(
            BASE_URL + SCHEDULE_ENDPOINT,
            headers=headers,
            timeout=TIMEOUT
        )
        assert schedule_response.status_code == 200, f"Schedule listing failed: {schedule_response.text}"
        schedule_data = schedule_response.json()
        # Validate schedule data structure - expecting a list or dict with schedule info
        assert isinstance(schedule_data, (list, dict)), "Schedule data is not a list or dict"

    except requests.RequestException as e:
        assert False, f"HTTP request failed: {e}"

test_list_schedule_entries()