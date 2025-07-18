import pytest
from fastapi.testclient import TestClient
from datetime import datetime
from app.models import CourseLevel, UserNotifications
from app.schemas import CourseCreate, UserPreferencesUpdate, SavedFilters
from datetime import date


class TestCourseEndpoints:

    def test_read_courses_default(self, client: TestClient, test_course):
        response = client.get("/api/courses/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert data[0]["title"] == test_course.title

    def test_read_courses_with_filters(self, client: TestClient, test_course, test_category):
        response = client.get(f"/api/courses/?category_id={test_category.id}")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert data[0]["category"]["id"] == test_category.id

    def test_read_course_by_id(self, client: TestClient, test_course):
        response = client.get(f"/api/courses/{test_course.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == test_course.title
        assert data["id"] == test_course.id

    def test_create_course_as_admin(self, client: TestClient, admin_headers, test_category, test_grade):
        now = datetime.utcnow().isoformat()
        course_data = {
            "title": "Новый курс администратора",
            "description": "Описание нового курса",
            "url": "https://newcourse.com",
            "provider": "Новый провайдер",
            "category_id": test_category.id,
            "level": CourseLevel.INTERMEDIATE,
            "grade_ids": [test_grade.id],
            "start_date": "2025-10-01",
            "end_date": "2025-12-31",
            "created_at": now,
            "updated_at": now
        }
        response = client.post("/api/courses/", json=course_data, headers=admin_headers)
        if response.status_code != 200:
            print("FastAPI Validation Error Response:", response.json())
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == course_data["title"]

    def test_create_course_as_non_admin(self, client: TestClient, auth_headers, test_category, test_grade):
        course_data = {
            "title": "Курс от обычного пользователя",
            "description": "Описание курса",
            "url": "https://usercourse.com",
            "provider": "Пользователь",
            "level": "BEGINNER",
            "category_id": test_category.id,
            "grade_ids": [test_grade.id]
        }
        response = client.post("/api/courses/", json=course_data, headers=auth_headers)
        assert response.status_code == 403

    def test_update_course_as_admin(self, client: TestClient, admin_headers, test_course):
        update_data = {
            "title": "Обновленный заголовок курса",
            "description": "Обновленное описание"
        }
        response = client.patch(f"/api/courses/{test_course.id}", json=update_data, headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == update_data["title"]

    def test_update_course_not_found(self, client: TestClient, admin_headers):
        update_data = {"title": "Несуществующий курс"}
        response = client.patch("/api/courses/999", json=update_data, headers=admin_headers)
        assert response.status_code == 404

    def test_delete_course_as_admin(self, client: TestClient, admin_headers, test_course):
        response = client.delete(f"/api/courses/{test_course.id}", headers=admin_headers)
        assert response.status_code == 200
        assert response.json()["ok"] is True

    def test_delete_course_not_found(self, client: TestClient, admin_headers):
        response = client.delete("/api/courses/999", headers=admin_headers)
        assert response.status_code == 404


class TestAuthenticationEndpoints:

    def test_login_via_telegram_valid_hash(self, client: TestClient, monkeypatch):
        def mock_verify_hash(auth_data):
            return True


        monkeypatch.setattr("app.main.verify_telegram_hash", mock_verify_hash)

        auth_data = {
            "id": 123456789,
            "username": "testuser",
            "auth_date": 1640995200,
            "hash": "any_mocked_hash"
        }
        response = client.post("/auth/telegram", json=auth_data)

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"


class TestUserEndpoints:

    def test_read_current_user(self, client: TestClient, auth_headers, test_user):
        response = client.get("/api/users/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == test_user.id
        assert data["username"] == test_user.username

    def test_update_user_preferences(self, client: TestClient, auth_headers):
        preferences_data = {
            "saved_filters": {
                "category_id": 1,
                "level": CourseLevel.BEGINNER.value,
                "grade": {

                }
            },
            "notifications": "yes"
        }
        response = client.put("/api/users/me/preferences", json=preferences_data, headers=auth_headers)
        if response.status_code != 200:
            print("FastAPI Validation Error Response:", response.json())
        assert response.status_code == 200
        data = response.json()
        assert data["notifications"] == "yes"

    def test_read_all_users_as_admin(self, client: TestClient, admin_headers):
        response = client.get("/api/users/", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_delete_user_as_admin(self, client: TestClient, admin_headers, test_user):
        response = client.delete(f"/api/users/{test_user.id}", headers=admin_headers)
        assert response.status_code == 204
