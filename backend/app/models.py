import enum
from datetime import datetime, date
from typing import List, Optional

from sqlalchemy.dialects.postgresql import JSON
from sqlmodel import Column, Field, Relationship, SQLModel, func


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"


class CourseLevel(str, enum.Enum):
    BEGINNER = "Начальный"
    INTERMEDIATE = "Средний"
    ADVANCED = "Продвинутый"
    ALL_LEVELS = "all_levels"



class CourseGradeLink(SQLModel, table=True):
    course_id: Optional[int] = Field(
        default=None, foreign_key="course.id", primary_key=True
    )
    grade_id: Optional[int] = Field(
        default=None, foreign_key="grade.id", primary_key=True
    )


class Grade(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    level: int = Field(unique=True, nullable=False)

    courses: List["Course"] = Relationship(back_populates="grades", link_model=CourseGradeLink)


class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True, nullable=False)

    courses: List["Course"] = Relationship(back_populates="category")


class User(SQLModel, table=True):
    id: int = Field(primary_key=True, description="Telegram User ID")
    username: Optional[str] = Field(default=None, index=True)
    first_name: str

    role: UserRole = Field(default=UserRole.USER, nullable=False)

    saved_filters: Optional[dict] = Field(default={}, sa_column=Column(JSON))

    created_at: datetime = Field(
        default=None,
        sa_column_kwargs={"server_default": func.now()},
        nullable=False
    )


class Course(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    title: str = Field(unique=True, index=True)
    description: str
    url: str
    provider: str

    level: CourseLevel
    category_id: int = Field(foreign_key="category.id")

    start_date: Optional[date] = Field(default=None, index=True)
    end_date: Optional[date] = Field(default=None, index=True)

    created_at: datetime = Field(
        default=None,
        sa_column_kwargs={"server_default": func.now()},
        nullable=False
    )
    updated_at: datetime = Field(
        default=None,
        sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()},
        nullable=False
    )

    category: Category = Relationship(back_populates="courses")

    grades: List[Grade] = Relationship(back_populates="courses", link_model=CourseGradeLink)

