import requests
import uuid

BASE_URL = "http://localhost:5001"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
TURMAS_URL = f"{BASE_URL}/api/turmas"
TIMEOUT = 30

def test_manage_class_groups():
    # Authenticate and get JWT token
    auth_payload = {"email": "admin@prismatech.com", "senha": "admin123"}
    auth_response = requests.post(LOGIN_URL, json=auth_payload, timeout=TIMEOUT)
    assert auth_response.status_code == 200, f"Login failed: {auth_response.text}"
    token = auth_response.json().get("token")
    assert token, "Token not found in login response"

    headers = {"Authorization": f"Bearer {token}"}

    # Step 1: Create a new class group (turma)
    unique_name = f"TestClassGroup_{uuid.uuid4()}"
    create_payload = {"nome": unique_name}
    create_response = requests.post(TURMAS_URL, json=create_payload, headers=headers, timeout=TIMEOUT)
    assert create_response.status_code == 201, f"Failed to create turma: {create_response.text}"
    turma = create_response.json()
    turma_id = turma.get("id")
    assert turma_id, "Created turma has no id"

    try:
        # Step 2: List all class groups and verify the created turma is listed
        list_response = requests.get(TURMAS_URL, headers=headers, timeout=TIMEOUT)
        assert list_response.status_code == 200, f"Failed to list turmas: {list_response.text}"
        turmas_list = list_response.json()
        assert any(t.get("id") == turma_id for t in turmas_list), "Created turma not found in list"

        # Step 3: Update the created class group
        updated_name = unique_name + "_Updated"
        update_payload = {"nome": updated_name}
        update_response = requests.put(f"{TURMAS_URL}/{turma_id}", json=update_payload, headers=headers, timeout=TIMEOUT)
        assert update_response.status_code == 200, f"Failed to update turma: {update_response.text}"
        updated_turma = update_response.json()
        assert updated_turma.get("nome") == updated_name, "Turma name not updated correctly"

        # Step 4: Delete the created class group
        delete_response = requests.delete(f"{TURMAS_URL}/{turma_id}", headers=headers, timeout=TIMEOUT)
        assert delete_response.status_code == 204, f"Failed to delete turma: {delete_response.text}"

        # Verify deletion by listing again
        list_after_delete_response = requests.get(TURMAS_URL, headers=headers, timeout=TIMEOUT)
        assert list_after_delete_response.status_code == 200, f"Failed to list turmas after delete: {list_after_delete_response.text}"
        turmas_after_delete = list_after_delete_response.json()
        assert all(t.get("id") != turma_id for t in turmas_after_delete), "Deleted turma still present in list"

    except AssertionError:
        # On assertion error attempt to cleanup resource
        try:
            requests.delete(f"{TURMAS_URL}/{turma_id}", headers=headers, timeout=TIMEOUT)
        except Exception:
            pass
        raise

test_manage_class_groups()
