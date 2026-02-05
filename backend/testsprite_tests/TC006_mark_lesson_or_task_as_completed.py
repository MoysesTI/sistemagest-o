import requests

BASE_URL = "http://localhost:5001"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
CRONOGRAMA_URL = f"{BASE_URL}/api/cronograma"
TAREFAS_EXTRAS_URL = f"{BASE_URL}/api/tarefas-extras"
TIMEOUT = 30

admin_email = "admin@prismatech.com"
admin_password = "admin123"

def test_TC006_mark_lesson_or_task_as_completed():
    # Authenticate and get token
    login_payload = {"email": admin_email, "senha": admin_password}
    login_resp = requests.post(LOGIN_URL, json=login_payload, timeout=TIMEOUT)
    assert login_resp.status_code == 200, f"Login failed with status {login_resp.status_code}"
    token = login_resp.json().get("token")
    assert token, "No token received for admin user"

    headers = {"Authorization": f"Bearer {token}"}

    # Helper function to cleanup extra task
    def delete_extra_task(task_id):
        try:
            delete_resp = requests.delete(f"{TAREFAS_EXTRAS_URL}/{task_id}", headers=headers, timeout=TIMEOUT)
            # It's okay if deletion fails (maybe task already deleted)
        except Exception:
            pass

    # Step 1: Try to mark an existing cronograma lesson/task as completed
    # List cronograma to get an existing lesson/task id
    cronograma_list_resp = requests.get(CRONOGRAMA_URL, headers=headers, timeout=TIMEOUT)
    assert cronograma_list_resp.status_code == 200
    cronograma = cronograma_list_resp.json()
    assert isinstance(cronograma, list)

    lesson_or_task_id = None
    if cronograma:
        lesson_or_task_id = cronograma[0].get("id")
    # If no lessons exist, we cannot create one via exposed API per PRD, so skip to extra task

    # Test marking valid cronograma id as completed
    if lesson_or_task_id is not None:
        mark_url = f"{CRONOGRAMA_URL}/{lesson_or_task_id}/check"
        mark_resp = requests.put(mark_url, headers=headers, timeout=TIMEOUT)
        assert mark_resp.status_code == 200, f"Failed to mark lesson/task as completed, status {mark_resp.status_code}"
        mark_resp_json = mark_resp.json()
        assert (
            mark_resp_json.get("completed") is True
            or mark_resp_json.get("status") == "completed"
            or mark_resp_json.get("checked") is True
        )

    # Step 2: Create a new extra task and mark it as completed
    new_task_payload = {
        "titulo": "Test task TC006 marking complete",
        "descricao": "Temporary task to test marking complete",
        "dataPrevista": "2026-12-31"  # Added required date field
    }
    create_task_resp = requests.post(TAREFAS_EXTRAS_URL, headers=headers, json=new_task_payload, timeout=TIMEOUT)
    assert create_task_resp.status_code == 201, f"Failed to create extra task, status {create_task_resp.status_code}"
    task_data = create_task_resp.json()
    task_id = task_data.get("id")
    assert task_id, "No task ID returned on creation"

    try:
        mark_task_url = f"{TAREFAS_EXTRAS_URL}/{task_id}/concluir"
        mark_task_resp = requests.put(mark_task_url, headers=headers, timeout=TIMEOUT)
        assert mark_task_resp.status_code == 200, f"Failed to mark extra task as completed, status {mark_task_resp.status_code}"
        mark_task_json = mark_task_resp.json()
        # Assuming API marks a field like "concluida"
        assert mark_task_json.get("concluida") is True
    finally:
        delete_extra_task(task_id)

    # Step 3: Test invalid IDs for both endpoints
    invalid_id = "00000000-0000-0000-0000-000000000000"

    if lesson_or_task_id is not None:
        invalid_mark_resp = requests.put(f"{CRONOGRAMA_URL}/{invalid_id}/check", headers=headers, timeout=TIMEOUT)
        assert invalid_mark_resp.status_code in (400, 404), f"Invalid ID for lesson/task did not return expected error, got {invalid_mark_resp.status_code}"
    
    invalid_mark_task_resp = requests.put(f"{TAREFAS_EXTRAS_URL}/{invalid_id}/concluir", headers=headers, timeout=TIMEOUT)
    assert invalid_mark_task_resp.status_code in (400, 404), f"Invalid ID for extra task did not return expected error, got {invalid_mark_task_resp.status_code}"

test_TC006_mark_lesson_or_task_as_completed()
