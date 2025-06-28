import datetime
from typing import Optional, List
from sqlmodel import SQLModel
from .models import UserRole, CourseLevel, Grade, Category, Course, User

class GradeRead(SQLModel):
    id: int
    level: int

class SavedFilters(SQLModel):
    category_id: Optional[int] = None
    level: Optional[CourseLevel] = None
    grade: Optional[Grade] = None


class CategoryCreate(SQLModel):
    name: str

class CategoryRead(CategoryCreate):
    id: int

class CategoryReadWithCourses(CategoryRead):
    courses: list["CourseRead"] = []


class CourseBase(SQLModel):
    title: str
    description: str
    url: str
    provider: str
    category_id: int
    level: CourseLevel
    grade_ids: List[int]

class CourseCreate(CourseBase):
    pass

class CourseRead(SQLModel):
    id: int
    title: str
    description: str
    url: str
    provider: str
    level: CourseLevel
    created_at: datetime.datetime
    updated_at: datetime.datetime
    category: "CategoryRead"
    grades: List[GradeRead] = []

class CourseReadWithCategory(CourseRead):
    category: CategoryRead
    grades: List[GradeRead] = []

class CourseUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    provider: Optional[str] = None
    category_id: Optional[int] = None
    level: Optional[CourseLevel] = None
    grade: Optional[Grade] = None


class UserBase(SQLModel):
    id: int
    username: Optional[str] = None
    first_name: str

class UserRead(UserBase):
    role: UserRole
    saved_filters: SavedFilters
    created_at: datetime.datetime



CourseRead.model_rebuild()
CategoryReadWithCourses.model_rebuild()
CourseReadWithCategory.model_rebuild()
