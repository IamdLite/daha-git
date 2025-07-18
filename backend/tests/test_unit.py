import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta, timezone
from jose import jwt
from fastapi import HTTPException
from sqlmodel import Session

from app.main import (
    create_access_token,
    verify_telegram_hash,
    get_current_user,
    get_current_admin_user,
    SECRET_KEY,
    ALGORITHM
)
from app.models import User, Course, Grade, Category, UserRole, UserNotifications, CourseLevel
from app.schemas import TokenData


class TestTokenOperations:

    def test_create_access_token(self):
        data = {"sub": "123456"}
        token = create_access_token(data)

        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert decoded["sub"] == "123456"
        assert "exp" in decoded

    def test_create_access_token_with_expiration(self):
        data = {"sub": "123456"}
        expires_delta = timedelta(minutes=30)
        token = create_access_token(data, expires_delta)

        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert decoded["sub"] == "123456"

        exp_time = datetime.fromtimestamp(decoded["exp"], timezone.utc)
        expected_exp = datetime.now(timezone.utc) + expires_delta
        assert abs((exp_time - expected_exp).total_seconds()) < 10


class TestTelegramAuthentication:

    @patch('app.main.TELEGRAM_BOT_TOKEN', 'test_token')
    def test_verify_telegram_hash_valid(self):
        auth_data = {
            "id": 123456,
            "username": "testuser",
            "auth_date": 1640995200,
            "hash": "calculated_hash"
        }

        with patch('hmac.new') as mock_hmac:
            mock_hmac.return_value.hexdigest.return_value = "calculated_hash"
            result = verify_telegram_hash(auth_data)
            assert result is True

    @patch('app.main.TELEGRAM_BOT_TOKEN', 'test_token')
    def test_verify_telegram_hash_invalid(self):
        auth_data = {
            "id": 123456,
            "username": "testuser",
            "auth_date": 1640995200,
            "hash": "wrong_hash"
        }

        with patch('hmac.new') as mock_hmac:
            mock_hmac.return_value.hexdigest.return_value = "correct_hash"
            result = verify_telegram_hash(auth_data)
            assert result is False


class TestUserAuthentication:

    def test_get_current_user_valid_token(self, session: Session, test_user):
        from fastapi.security import HTTPAuthorizationCredentials

        token = create_access_token(data={"sub": str(test_user.id)})
        credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)

        user = get_current_user(credentials, session)
        assert user.id == test_user.id
        assert user.username == test_user.username

    def test_get_current_user_invalid_token(self, session: Session):
        from fastapi.security import HTTPAuthorizationCredentials

        credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials="invalid_token")

        with pytest.raises(HTTPException) as exc_info:
            get_current_user(credentials, session)
        assert exc_info.value.status_code == 401

    def test_get_current_admin_user_with_admin(self, test_admin):
        admin_user = get_current_admin_user(test_admin)
        assert admin_user.role == UserRole.ADMIN

    def test_get_current_admin_user_without_admin(self, test_user):
        with pytest.raises(HTTPException) as exc_info:
            get_current_admin_user(test_user)
        assert exc_info.value.status_code == 403


class TestModelBehavior:

    def test_course_model_relationships(self, session: Session, test_category, test_grade):
        course = Course(
            title="Тестовый курс для проверки связей",
            description="Описание",
            url="https://relationships.com",
            provider="Тестовый провайдер",
            level=CourseLevel.INTERMEDIATE,
            category_id=test_category.id
        )
        course.grades = [test_grade]
        session.add(course)
        session.commit()
        session.refresh(course)

        assert course.category.name == test_category.name
        assert len(course.grades) == 1
        assert course.grades[0].level == test_grade.level

    def test_user_model_defaults(self, session: Session):
        user = User(id=123456789, username="testuser")
        session.add(user)
        session.commit()
        session.refresh(user)

        assert user.role == UserRole.USER
        assert user.notifications == UserNotifications.NO
        assert user.saved_filters == {}
        assert user.created_at is not None

    def test_course_level_enum(self):
        assert CourseLevel.BEGINNER == "Начальный"
        assert CourseLevel.INTERMEDIATE == "Средний"
        assert CourseLevel.ADVANCED == "Продвинутый"

    def test_user_notifications_enum(self):
        assert UserNotifications.YES == "yes"
        assert UserNotifications.NO == "no"


class TestUtilityFunctions:

    def test_token_data_validation(self):
        token_data = TokenData(id="123456")
        assert token_data.id == "123456"

        empty_token = TokenData()
        assert empty_token.id is None
