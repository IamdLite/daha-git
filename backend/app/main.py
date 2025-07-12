from fastapi import FastAPI, Depends, HTTPException, Query, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlmodel import Session, select, func

from .database import get_session, create_db_and_tables
from .models import Course, User, Grade, UserRole, UserNotifications
from . import schemas

import logging
from typing import List, Optional

import os
import hmac
import hashlib
from datetime import datetime, timedelta, timezone

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

APP_ENV = os.getenv("APP_ENV", "production")
SECRET_KEY = os.getenv("SECRET_KEY", "a_super_secret_key_for_development_only")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "YOUR_TELEGRAM_BOT_TOKEN")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    #passss

@app.get("/api/courses/", response_model=List[schemas.CourseReadWithCategory])
def read_courses(
    session: Session = Depends(get_session),
    category_id: Optional[int] = None,
    level: Optional[schemas.CourseLevel] = None,
    grade_id: Optional[int] = None,

    skip: int = Query(
        default=0,
        ge=0,
        description="Number of items to skip from the start (offset)."
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Maximum number of items to return per page."
    )
):
    try:
        query = select(Course)
        if category_id:
            query = query.where(Course.category_id == category_id)
        if level:
            query = query.where(Course.level == level)
        if grade_id:
            query = query.join(Course.grades).where(Grade.id == grade_id)
        courses = session.exec(query.offset(skip).limit(limit)).all()
        return courses
    except Exception as e:
        logger.exception(f"An unexpected error occurred while reading courses: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@app.get("/api/courses/count", response_model=schemas.CourseCount)
def read_courses(
    session: Session = Depends(get_session),
    category_id: Optional[int] = None,
    level: Optional[schemas.CourseLevel] = None,
    grade_id: Optional[int] = None,

    skip: int = Query(
        default=0,
        ge=0,
        description="Number of items to skip from the start (offset)."
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Maximum number of items to return per page."
    )
):
    try:
        query = select(Course)
        if category_id:
            query = query.where(Course.category_id == category_id)
        if level:
            query = query.where(Course.level == level)
        if grade_id:
            query = query.join(Course.grades).where(Grade.id == grade_id)
        courses = session.exec(query.offset(skip).limit(limit)).all()
        total_count = len(courses)
        return schemas.CourseCount(total=total_count)
    except Exception as e:
        logger.exception(f"An unexpected error occurred while reading courses: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")


@app.get("/api/courses/{course_id}", response_model=schemas.CourseReadWithCategory)
def read_course(course_id: int, session: Session = Depends(get_session)):
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course




security = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_telegram_hash(auth_data: dict) -> bool:
    data_check_string_parts = []
    for key, value in sorted(auth_data.items()):
        if key != 'hash' and value is not None:
            data_check_string_parts.append(f"{key}={value}")

    data_check_string = "\n".join(data_check_string_parts)
    secret_key = hashlib.sha256(TELEGRAM_BOT_TOKEN.encode()).digest()
    calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    return calculated_hash == auth_data['hash']


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), session: Session = Depends(get_session)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: Optional[str] = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
        token_data = schemas.TokenData(id=user_id_str)
    except JWTError:
        raise credentials_exception

    user = session.get(User, int(token_data.id))

    if user is None:
        raise credentials_exception

    return user

def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges for this action."
        )
    return current_user



auth_router = APIRouter(prefix="/auth", tags=["Authentication"])
user_router = APIRouter(prefix="/api/users", tags=["Users"])

@app.post("/api/courses/", response_model=schemas.CourseRead)
def create_course(course: schemas.CourseCreate, session: Session = Depends(get_session), admin_user: User = Depends(get_current_admin_user)):
    db_course = Course(
        title=course.title,
        description=course.description,
        url=course.url,
        provider=course.provider,
        category_id=course.category_id,
        level=course.level,
        start_date = course.start_date,
        end_date = course.end_date
    )

    grades = session.exec(select(Grade).where(Grade.id.in_(course.grade_ids))).all()
    if len(grades) != len(course.grade_ids):
        raise HTTPException(status_code=404, detail="One or more grade IDs not found")
    db_course.grades.extend(grades)
    session.add(db_course)
    session.commit()
    session.refresh(db_course)
    return db_course

@app.patch("/api/courses/{course_id}", response_model=schemas.CourseReadWithCategory)
def update_course(
        course_id: int,
        course_update: schemas.CourseUpdate,
        session: Session = Depends(get_session),
        admin_user: User = Depends(get_current_admin_user)
):
    db_course = session.get(Course, course_id)
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    update_data = course_update.model_dump(exclude_unset=True)
    if "grade_ids" in update_data:
        grade_ids = update_data.pop("grade_ids")
        grades = session.exec(select(Grade).where(Grade.id.in_(grade_ids))).all()
        if len(grades) != len(grade_ids):
            raise HTTPException(status_code=404, detail="One or more grade IDs not found")

        db_course.grades = grades

    for key, value in update_data.items():
        setattr(db_course, key, value)

    session.add(db_course)
    session.commit()
    session.refresh(db_course)

    return db_course

@app.delete("/api/courses/{course_id}")
def delete_course(course_id: int, session: Session = Depends(get_session), admin_user: User = Depends(get_current_admin_user)):
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    session.delete(course)
    session.commit()
    return {"ok": True, "detail": "Course deleted successfully"}

@auth_router.post("/telegram", response_model=schemas.Token)
def login_via_telegram(auth_data: schemas.TelegramAuthData, session: Session = Depends(get_session)):
    is_production = APP_ENV == "production"
    if is_production and not verify_telegram_hash(auth_data.model_dump()):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Telegram hash")

    user = session.get(User, auth_data.id)
    if not user:
        user = User(
            id=auth_data.id,
            username=auth_data.username,
            role=UserRole.USER,
            notifications=UserNotifications.YES
        )
        session.add(user)
        session.commit()
        session.refresh(user)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": str(user.id)}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@user_router.get("/me", response_model=schemas.UserRead)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@user_router.put("/me/preferences", response_model=schemas.UserRead)
def update_user_preferences(
        preferences: schemas.UserPreferencesUpdate,
        current_user: User = Depends(get_current_user),
        session: Session = Depends(get_session)
):
    current_user.saved_filters = preferences.saved_filters.model_dump()
    current_user.notifications = preferences.notifications
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user


@user_router.get("/", response_model=List[schemas.UserRead], dependencies=[Depends(get_current_admin_user)])
def read_all_users(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    users = session.exec(select(User).offset(skip).limit(limit)).all()
    return users


@user_router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT,
                    dependencies=[Depends(get_current_admin_user)])
def delete_user_by_admin(user_id: int, session: Session = Depends(get_session)):
    user_to_delete = session.get(User, user_id)
    if not user_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    session.delete(user_to_delete)
    session.commit()
    return

app.include_router(auth_router)
app.include_router(user_router)