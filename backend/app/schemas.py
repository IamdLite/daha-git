import datetime
from datetime import date
from typing import Optional, List
from pydantic import BaseModel, Field as PydanticField
from sqlmodel import SQLModel
from .models import UserRole, CourseLevel, Grade, Category, Course, User, UserNotifications

class BotUserUpdate(BaseModel):
    id: int
    username: Optional[str] = None
    saved_filters: "SavedFilters"
    notifications: UserNotifications

class LoginRequest(SQLModel):
    username: str

class VerifyCodeRequest(SQLModel):
    username: str
    verification_code: str

class Token(SQLModel):
    access_token: str
    token_type: str

class CourseCount(SQLModel):
    total: int

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
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime

class CourseCreate(CourseBase):
    pass

class CourseRead(SQLModel):
    id: int
    title: str
    description: str
    url: str
    provider: str
    level: CourseLevel
    start_date: Optional[date] = None
    end_date: Optional[date] = None
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
    level: Optional[CourseLevel] = None
    category_id: Optional[int] = None
    start_date: Optional[datetime.date] = None
    end_date: Optional[datetime.date] = None
    grade_ids: Optional[List[int]] = None


class UserBase(SQLModel):
    id: int
    username: Optional[str] = None
    notifications: str

class UserRead(UserBase):
    role: UserRole
    saved_filters: SavedFilters
    created_at: datetime.datetime
    notifications: UserNotifications

class TelegramAuthData(BaseModel):
    id: int
    username: Optional[str] = None
    photo_url: Optional[str] = PydanticField(None, alias='photo_url')
    auth_date: int
    hash: str

class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(SQLModel):
    id: Optional[str] = None

class UserPreferencesUpdate(SQLModel):
    saved_filters: SavedFilters
    notifications: UserNotifications

class AdminSetRequest(BaseModel):
    user_id: Optional[int] = None
    username: Optional[str] = None
    code: str = PydanticField(..., description="Secret code required to grant admin privileges")

CourseRead.model_rebuild()
CategoryReadWithCourses.model_rebuild()
CourseReadWithCategory.model_rebuild()
