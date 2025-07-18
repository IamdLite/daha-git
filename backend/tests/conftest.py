import pytest
import os
from datetime import date
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, SQLModel

from app.models import User, Course, Grade, Category, UserRole, UserNotifications, CourseLevel

DATABASE_URL = "postgresql://my_user:a-very-strong-password@db:5432/my_courses_db"

@pytest.fixture(autouse=True)
def override_db_url_env(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", DATABASE_URL)

@pytest.fixture(name="session", scope="function")
def session_fixture():
    db_url = os.getenv("DATABASE_URL")
    engine = create_engine(db_url)
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        yield session

    SQLModel.metadata.drop_all(engine)
    engine.dispose()



@pytest.fixture(name="client", scope="function")
def client_fixture(session: Session):
    from app.main import app
    from app.database import get_session

    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override

    client = TestClient(app)
    yield client

    app.dependency_overrides.clear()


@pytest.fixture(name="test_user", scope="function")
def test_user_fixture(session: Session):
    user = User(
        id=123456789,
        username="testuser",
        role=UserRole.USER,
        notifications=UserNotifications.YES
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture(name="test_admin", scope="function")
def test_admin_fixture(session: Session):
    admin = User(
        id=987654321,
        username="adminuser",
        role=UserRole.ADMIN,
        notifications=UserNotifications.YES
    )
    session.add(admin)
    session.commit()
    session.refresh(admin)
    return admin


@pytest.fixture(name="test_category", scope="function")
def test_category_fixture(session: Session):
    category = Category(name="Тестовая категория")
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


@pytest.fixture(name="test_grade", scope="function")
def test_grade_fixture(session: Session):
    grade = Grade(level=13)
    session.add(grade)
    session.commit()
    session.refresh(grade)
    return grade


@pytest.fixture(name="test_course", scope="function")
def test_course_fixture(session: Session, test_category, test_grade):
    course = Course(
        title="Тестовый курс",
        description="Описание тестового курса",
        url="https://example.com",
        provider="Тестовый провайдер",
        level=CourseLevel.BEGINNER,
        category_id=test_category.id,
        start_date=date(2025, 9, 1),
        end_date=date(2025, 12, 31)
    )
    course.grades = [test_grade]
    session.add(course)
    session.commit()
    session.refresh(course)
    return course


@pytest.fixture(name="auth_headers", scope="function")
def auth_headers_fixture(test_user):
    from app.main import create_access_token
    token = create_access_token(data={"sub": str(test_user.id)})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(name="admin_headers", scope="function")
def admin_headers_fixture(test_admin):
    from app.main import create_access_token
    token = create_access_token(data={"sub": str(test_admin.id)})
    return {"Authorization": f"Bearer {token}"}
