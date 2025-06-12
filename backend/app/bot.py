from telegram.ext import Application, CommandHandler
from fastapi import FastAPI
import os
from app.data import COURSES

async def start(update, context):
    await update.message.reply_text('Welcome to Daha! Use /courses to see available courses.')

async def courses(update, context):
    course_list = "\n".join([f"{course['name']} by {course['provider']}" for course in COURSES])
    await update.message.reply_text(f"Courses:\n{course_list}")

async def webapp(update, context):
    await update.message.reply_text('Open Daha Mini App: https://daha-git-cx3u.vercel.app/')

def setup_bot(app: FastAPI):
    token = os.getenv('BOT_TOKEN')
    application = Application.builder().token(token).build()
    application.add_handler(CommandHandler('start', start))
    application.add_handler(CommandHandler('courses', courses))
    application.add_handler(CommandHandler('webapp', webapp))

    # Webhook endpoint
    @app.post("/webhook")
    async def webhook(update: dict):
        await application.update_queue.put(update)
        return {"ok": True}

    # Store application for shutdown
    app.bot_application = application 
