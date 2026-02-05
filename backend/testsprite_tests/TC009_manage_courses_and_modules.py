import requests
import uuid

BASE_URL = "http://localhost:5001"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
COURSES_URL = f"{BASE_URL}/api/cursos"

ADMIN_EMAIL = "admin@prismatech.com"
ADMIN_PASSWORD = "admin123"
TIMEOUT = 30


def test_manage_courses_and_modules():
    # Authenticate and get token
    login_payload = {
        "email": ADMIN_EMAIL,
        "senha": ADMIN_PASSWORD
    }
    try:
        login_response = requests.post(LOGIN_URL, json=login_payload, timeout=TIMEOUT)
        assert login_response.status_code == 200, f"Login failed with status code {login_response.status_code}"
        token = login_response.json().get("token")
        assert token, "No token returned in login response"
    except requests.RequestException as e:
        assert False, f"Login request failed: {e}"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # List existing courses
    try:
        list_response = requests.get(COURSES_URL, headers=headers, timeout=TIMEOUT)
        assert list_response.status_code == 200, f"Listing courses failed with status {list_response.status_code}"
        courses = list_response.json()
        assert isinstance(courses, list), "Courses listing is not a list"
    except requests.RequestException as e:
        assert False, f"List courses request failed: {e}"

    # Create a unique course
    unique_course_name = f"Test Course {uuid.uuid4()}"
    create_payload = {"nome": unique_course_name}
    created_course_id = None

    try:
        create_response = requests.post(COURSES_URL, json=create_payload, headers=headers, timeout=TIMEOUT)
        assert create_response.status_code == 201, f"Create course failed with status {create_response.status_code}"
        created_course = create_response.json()
        created_course_id = created_course.get("id")
        assert created_course_id, "Created course ID not returned"
        assert created_course.get("nome") == unique_course_name, "Created course name mismatch"

        # Add a module to the created course
        modules_url = f"{COURSES_URL}/{created_course_id}/modulos"
        module_payload = {"nome": "Introduction Module"}
        add_module_response = requests.post(modules_url, json=module_payload, headers=headers, timeout=TIMEOUT)
        assert add_module_response.status_code == 201, f"Add module failed with status {add_module_response.status_code}"
        added_module = add_module_response.json()
        assert added_module.get("nome") == module_payload["nome"], "Module name mismatch"

        # Verify the module appears when fetching course modules (assuming endpoint to get modules exists)
        # If no direct modules GET endpoint provided in PRD, skip this part (no specific read endpoint mentioned)
        # Could re-fetch course details if available, but PRD does not mention it.
    except requests.RequestException as e:
        assert False, f"Create course or add module request failed: {e}"
    finally:
        # Cleanup: delete the created course
        if created_course_id:
            try:
                delete_url = f"{COURSES_URL}/{created_course_id}"
                delete_response = requests.delete(delete_url, headers=headers, timeout=TIMEOUT)
                # It might respond with 200 or 204 for successful delete
                assert delete_response.status_code in (200, 204), f"Failed to delete course, status {delete_response.status_code}"
            except requests.RequestException as e:
                # Log error but do not fail test because test logic succeeded
                print(f"Cleanup delete course failed: {e}")


test_manage_courses_and_modules()