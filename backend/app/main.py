from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.bot import setup_bot
from app.data import COURSES

app = FastAPI()

# Setup Telegram bot
setup_bot(app)

# API endpoints
@app.get("/api/courses")
async def get_courses():
    return COURSES

# Serve frontend (optional for local testing)
app.mount("/static", StaticFiles(directory="../frontend/build"), name="static")