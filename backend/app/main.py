from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import List, Optional

from .database import get_session, create_db_and_tables
from .models import Course, User, Grade
from . import schemas

import logging
from typing import List, Optional

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.post("/api/courses/", response_model=schemas.CourseRead)
def create_course(course: schemas.CourseCreate, session: Session = Depends(get_session)):
    db_course = Course(
        title=course.title,
        description=course.description,
        url=course.url,
        provider=course.provider,
        category_id=course.category_id,
        level=course.level
    )
    grades = session.exec(select(Grade).where(Grade.id.in_(course.grade_ids))).all()
    if len(grades) != len(course.grade_ids):
        raise HTTPException(status_code=404, detail="One or more grade IDs not found")
    db_course.grades.extend(grades)
    session.add(db_course)
    session.commit()
    session.refresh(db_course)
    return db_course

@app.get("/api/courses/", response_model=List[schemas.CourseReadWithCategory])
def read_courses(
        session: Session = Depends(get_session),
        category_id: Optional[int] = None,
        level: Optional[schemas.CourseLevel] = None,
        grade_id: Optional[int] = None,
        skip: int = 0,
        limit: int = Query(default=10, le=100)
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

@app.get("/api/courses/{course_id}", response_model=schemas.CourseReadWithCategory)
def read_course(course_id: int, session: Session = Depends(get_session)):
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@app.delete("/api/courses/{course_id}")
def delete_course(course_id: int, session: Session = Depends(get_session)):
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    session.delete(course)
    session.commit()
    return {"ok": True, "detail": "Course deleted successfully"}

@app.get("/api/users/me", response_model=schemas.UserRead)
def get_current_user(session: Session = Depends(get_session)):
    #
    user_id = 1
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/api/users/me/filters", response_model=schemas.UserRead)
def update_user_filters(filters: schemas.SavedFilters, session: Session = Depends(get_session)):
    #

    user_id = 1
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.saved_filters = filters.dict(exclude_unset=True)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
