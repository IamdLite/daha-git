import os
from sqlmodel import create_engine, Session, SQLModel
from dotenv import load_dotenv

load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL")

engine = None


def init_db():
    global engine
    if not DATABASE_URL:
        print("WARNING: DATABASE_URL is not set. Skipping database initialization.")
        return

    engine = create_engine(DATABASE_URL)
    SQLModel.metadata.create_all(engine)
    print("Database initialized successfully.")


def get_session():
    if engine is None:
        raise RuntimeError("Database is not initialized. Did the app startup event run?")

    with Session(engine) as session:
        yield session
