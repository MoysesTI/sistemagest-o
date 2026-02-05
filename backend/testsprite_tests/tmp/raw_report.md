
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** backend
- **Date:** 2026-02-05
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 user login functionality
- **Test Code:** [TC001_user_login_functionality.py](./TC001_user_login_functionality.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9c49b194-e156-4fdf-9508-b5d4b1b9511f/9819b4a0-32cf-4c1d-9902-af5b1f9a8fc5
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 user registration process
- **Test Code:** [TC002_user_registration_process.py](./TC002_user_registration_process.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 64, in <module>
  File "<string>", line 23, in test_user_registration_process
AssertionError: Expected 200 or 201 but got 500

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9c49b194-e156-4fdf-9508-b5d4b1b9511f/0b6efaef-d873-4201-a2aa-27a614577ec6
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 retrieve logged in user data
- **Test Code:** [TC003_retrieve_logged_in_user_data.py](./TC003_retrieve_logged_in_user_data.py)
- **Test Error:** Traceback (most recent call last):
  File "<string>", line 38, in test_retrieve_logged_in_user_data
AssertionError: Expected key 'id' not found in user data

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 51, in <module>
  File "<string>", line 42, in test_retrieve_logged_in_user_data
AssertionError: Fetching authenticated user data failed: Expected key 'id' not found in user data

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9c49b194-e156-4fdf-9508-b5d4b1b9511f/de30f2d3-39bb-4d5c-add8-51efad439f3f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 list schedule entries
- **Test Code:** [TC004_list_schedule_entries.py](./TC004_list_schedule_entries.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9c49b194-e156-4fdf-9508-b5d4b1b9511f/7d7626e8-4129-4720-a5a6-5e91405e3b32
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 import class schedules
- **Test Code:** [TC005_import_class_schedules.py](./TC005_import_class_schedules.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 77, in <module>
  File "<string>", line 74, in test_import_class_schedules
AssertionError: Invalid payload did not produce client error, got status 200 for data [{}]

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9c49b194-e156-4fdf-9508-b5d4b1b9511f/2f0e3a5a-c9ba-43d4-869f-95219110c91e
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 mark lesson or task as completed
- **Test Code:** [TC006_mark_lesson_or_task_as_completed.py](./TC006_mark_lesson_or_task_as_completed.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 86, in <module>
  File "<string>", line 61, in test_TC006_mark_lesson_or_task_as_completed
AssertionError: Failed to create extra task, status 500

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9c49b194-e156-4fdf-9508-b5d4b1b9511f/4a9d58bb-20e8-49e5-8a69-cffa0707a2bc
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 register taught content for lesson
- **Test Code:** [TC007_register_taught_content_for_lesson.py](./TC007_register_taught_content_for_lesson.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 65, in <module>
  File "<string>", line 32, in test_register_taught_content_for_lesson
AssertionError: Schedule list is empty or invalid

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9c49b194-e156-4fdf-9508-b5d4b1b9511f/d2ee4140-8138-4c90-affd-8d23300b5a34
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 manage class groups
- **Test Code:** [TC008_manage_class_groups.py](./TC008_manage_class_groups.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 61, in <module>
  File "<string>", line 23, in test_manage_class_groups
AssertionError: Failed to create turma: {"error":"Erro interno do servidor"}

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9c49b194-e156-4fdf-9508-b5d4b1b9511f/cffc3ecf-8dde-477e-8daa-bfbe175a3453
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 manage courses and modules
- **Test Code:** [TC009_manage_courses_and_modules.py](./TC009_manage_courses_and_modules.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 80, in <module>
  File "<string>", line 48, in test_manage_courses_and_modules
AssertionError: Create course failed with status 500

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9c49b194-e156-4fdf-9508-b5d4b1b9511f/04c896b1-fdc3-4634-af18-5e04e8db7bd0
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 manage extra non academic tasks
- **Test Code:** [TC010_manage_extra_non_academic_tasks.py](./TC010_manage_extra_non_academic_tasks.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 57, in <module>
  File "<string>", line 25, in test_manage_extra_non_academic_tasks
AssertionError: Task creation failed: {"error":"Erro interno do servidor"}

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9c49b194-e156-4fdf-9508-b5d4b1b9511f/e6da0f77-ff8c-4c06-8aed-440eef0a5863
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **20.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---