import requests

BASE_URL = "http://localhost:5001"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
SCHEDULE_URL = f"{BASE_URL}/api/cronograma"

ADMIN_EMAIL = "admin@prismatech.com"
ADMIN_PASSWORD = "admin123"
TIMEOUT = 30

def test_register_taught_content_for_lesson():
    # Authenticate as admin to get JWT token
    login_payload = {"email": ADMIN_EMAIL, "senha": ADMIN_PASSWORD}
    try:
        login_resp = requests.post(LOGIN_URL, json=login_payload, timeout=TIMEOUT)
        login_resp.raise_for_status()
    except requests.RequestException as e:
        assert False, f"Login request failed: {e}"
    login_data = login_resp.json()
    assert "token" in login_data and isinstance(login_data["token"], str), "Login response missing token"
    token = login_data["token"]
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # Get existing schedule lessons to find a valid ID
    try:
        schedule_resp = requests.get(SCHEDULE_URL, headers=headers, timeout=TIMEOUT)
        schedule_resp.raise_for_status()
    except requests.RequestException as e:
        assert False, f"Failed to list schedule: {e}"

    schedule_list = schedule_resp.json()
    assert isinstance(schedule_list, list) and len(schedule_list) > 0, "Schedule list is empty or invalid"

    lesson = schedule_list[0]
    lesson_id = lesson.get("id")
    assert lesson_id is not None, "Lesson ID not found in schedule data"

    content_registration_url = f"{SCHEDULE_URL}/{lesson_id}/conteudo"

    # Prepare valid content payload for registering taught content
    valid_content = {
        "conteudo": "Introduced unit testing and API integration concepts."
    }

    # Test successful registration of taught content
    try:
        put_resp = requests.put(content_registration_url, json=valid_content, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"PUT request to register content failed: {e}"
    assert put_resp.status_code == 200, f"Expected 200 OK, got {put_resp.status_code}"
    put_data = put_resp.json()
    assert "message" in put_data and ("success" in put_data["message"].lower() or "registered" in put_data["message"].lower()), "Success message not found in response"

    # Test error case: missing 'conteudo' field
    invalid_content = {}

    try:
        error_resp = requests.put(content_registration_url, json=invalid_content, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"PUT request with invalid payload failed: {e}"
    assert error_resp.status_code >= 400, f"Expected error status for invalid payload, got {error_resp.status_code}"
    error_data = error_resp.json()
    assert "error" in error_data or "message" in error_data, "Error message not found for invalid payload"

test_register_taught_content_for_lesson()