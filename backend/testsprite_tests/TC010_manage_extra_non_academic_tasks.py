import requests

BASE_URL = "http://localhost:5001"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
TASKS_URL = f"{BASE_URL}/api/tarefas-extras"
TIMEOUT = 30

ADMIN_EMAIL = "admin@prismatech.com"
ADMIN_PASSWORD = "admin123"


def test_manage_extra_non_academic_tasks():
    # Login to get JWT token
    login_payload = {"email": ADMIN_EMAIL, "senha": ADMIN_PASSWORD}
    login_resp = requests.post(LOGIN_URL, json=login_payload, timeout=TIMEOUT)
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    token = login_resp.json().get("token")
    assert token, "No token returned on login"

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # Create a unique extra task
    task_payload = {"titulo": "Test Extra Task", "descricao": "Task created during test_manage_extra_non_academic_tasks"}
    create_resp = requests.post(TASKS_URL, json=task_payload, headers=headers, timeout=TIMEOUT)
    assert create_resp.status_code == 201, f"Task creation failed: {create_resp.text}"
    task = create_resp.json()
    task_id = task.get("id")
    assert task_id, "Created task has no ID"

    try:
        # List tasks and verify created task is returned
        list_resp = requests.get(TASKS_URL, headers=headers, timeout=TIMEOUT)
        assert list_resp.status_code == 200, f"Failed to list tasks: {list_resp.text}"
        tasks = list_resp.json()
        assert any(t.get("id") == task_id for t in tasks), "Created task not found in list"

        # Mark the created task as completed
        complete_url = f"{TASKS_URL}/{task_id}/concluir"
        complete_resp = requests.put(complete_url, headers=headers, timeout=TIMEOUT)
        assert complete_resp.status_code == 200, f"Failed to complete task: {complete_resp.text}"

        # Verify the task is marked completed (by re-listing and checking status)
        verify_resp = requests.get(TASKS_URL, headers=headers, timeout=TIMEOUT)
        assert verify_resp.status_code == 200, f"Failed to list tasks after completion: {verify_resp.text}"
        tasks_after = verify_resp.json()
        task_after = next((t for t in tasks_after if t.get("id") == task_id), None)
        assert task_after is not None, "Task disappeared after marking completed"
        assert task_after.get("concluida") is True or task_after.get("status") == "concluida", "Task not marked as completed properly"

    finally:
        # Cleanup: Delete the created task to keep db clean
        # No direct delete endpoint described, but if exists, attempt delete
        delete_url = f"{TASKS_URL}/{task_id}"
        requests.delete(delete_url, headers=headers, timeout=TIMEOUT)


test_manage_extra_non_academic_tasks()