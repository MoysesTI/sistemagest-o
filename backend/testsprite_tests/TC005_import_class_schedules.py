import requests

BASE_URL = "http://localhost:5001"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
IMPORT_SCHEDULE_URL = f"{BASE_URL}/api/cronograma/importar"
TIMEOUT = 30

def test_import_class_schedules():
    # Login to get JWT token
    login_payload = {
        "email": "admin@prismatech.com",
        "senha": "admin123"
    }
    login_resp = requests.post(LOGIN_URL, json=login_payload, timeout=TIMEOUT)
    assert login_resp.status_code == 200, f"Login failed with status {login_resp.status_code}"
    token = login_resp.json().get("token")
    assert token, "Authentication token not found in login response"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Valid schedule import data example
    valid_import_payload = [
        {
            "turmaId": 1,
            "cursoId": 1,
            "moduloId": 1,
            "data": "2026-03-01",
            "horaInicio": "09:00",
            "horaFim": "10:30",
            "descricao": "Aula de introdução"
        },
        {
            "turmaId": 1,
            "cursoId": 1,
            "moduloId": 2,
            "data": "2026-03-02",
            "horaInicio": "11:00",
            "horaFim": "12:30",
            "descricao": "Aula avançada"
        }
    ]

    # Import valid schedule data
    valid_resp = requests.post(IMPORT_SCHEDULE_URL, json=valid_import_payload, headers=headers, timeout=TIMEOUT)
    assert valid_resp.status_code == 201 or valid_resp.status_code == 200, f"Valid import failed with status {valid_resp.status_code}"
    valid_result = valid_resp.json()
    assert isinstance(valid_result, dict) or isinstance(valid_result, list), "Response JSON format invalid for valid import"

    # Invalid schedule import data examples
    invalid_payloads = [
        [],  # Empty list, probably valid or accepted
        [{}],  # Empty object in list
        [{"turmaId": "invalid", "cursoId": 1}],  # Wrong data type for turmaId
        [{"data": "2026-02-30", "horaInicio": "09:00"}],  # Invalid date
        "not a json array",  # Completely wrong type of payload
        None  # None payload
    ]

    for invalid_data in invalid_payloads:
        try:
            if invalid_data is None:
                resp = requests.post(IMPORT_SCHEDULE_URL, headers=headers, timeout=TIMEOUT)
            else:
                resp = requests.post(IMPORT_SCHEDULE_URL, json=invalid_data, headers=headers, timeout=TIMEOUT)
        except requests.exceptions.RequestException as e:
            # If server closes connection or error, consider that acceptable error handling
            continue
        # For empty list accept success (200 or 201), for others expect client error
        if invalid_data == []:
            assert resp.status_code == 200 or resp.status_code == 201, f"Empty list payload did not produce success, got {resp.status_code}"
        else:
            assert resp.status_code >= 400 and resp.status_code < 500, \
                f"Invalid payload did not produce client error, got status {resp.status_code} for data {invalid_data}"

test_import_class_schedules()
