from telegram.ext import Application, CommandHandler
from fastapi import FastAPI
from dotenv import load_dotenv
import os
from app.data import COURSES

load_dotenv(".env")

async def start(update, context):
    await update.message.reply_text('Welcome to Daha! Use /courses to see available courses.')

async def courses(update, context):
    course_list = "\n".join([f"{course['name']} by {course['provider']}" for course in COURSES])
    await update.message.reply_text(f"Courses:\n{course_list}")

async def webapp(update, context):
    await update.message.reply_text('Open Daha Mini App: http://localhost:3000/mini-app')

def setup_bot(app: FastAPI):
    # print("Current directory:", os.getcwd())
    # print("Files in directory:", os.listdir())
    # print("Environment variables:", dict(os.environ))
    
    token = os.getenv('BOT_TOKEN')
    print(f"Bot token in bot.py: {token}")  # Debug
    if not token:
        raise ValueError("BOT_TOKEN not set in environment variables")
    application = Application.builder().token(token).build()
    application.add_handler(CommandHandler('start', start))
    application.add_handler(CommandHandler('courses', courses))
    application.add_handler(CommandHandler('webapp', webapp))

    # Store application for access
    app.bot_application = application

    # Start polling on FastAPI startup
    @app.on_event("startup")
    async def startup_event():
        await application.initialize()
        await application.start()
        await application.updater.start_polling()

    # Stop polling on FastAPI shutdown
    @app.on_event("shutdown")
    async def shutdown_event():
        await application.updater.stop()
        await application.stop()
        await application.shutdown()