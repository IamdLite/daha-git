import asyncio
import logging
import os
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, Request
from dotenv import load_dotenv

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes


load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN")
WEBHOOK_URL = os.getenv("WEBHOOK_URL")

if not BOT_TOKEN:
    raise ValueError("Error: BOT_TOKEN is not set in the .env file or environment.")
if not WEBHOOK_URL:
    raise ValueError("Error: WEBHOOK_URL is not set in the .env file or environment.")

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)


COURSES = [
    {"id": 1, "name": "AI for Beginners", "subjects": ["Artificial Intelligence"], "difficulty": "Simple",
     "grade": ["8", "9"]},
    {"id": 2, "name": "Advanced Robotics", "subjects": ["Robotics", "Programming"], "difficulty": "Advanced",
     "grade": ["10", "11"]},
    {"id": 3, "name": "Intro to Python", "subjects": ["Programming"], "difficulty": "Simple", "grade": ["7", "8", "9"]},
    {"id": 4, "name": "Cybersecurity Essentials", "subjects": ["Cybersecurity"], "difficulty": "Advanced",
     "grade": ["10", "11"]},
    {"id": 5, "name": "Startup 101", "subjects": ["Entrepreneurship"], "difficulty": "Simple",
     "grade": ["9", "10", "11"]},
    {"id": 6, "name": "Robotics and Programming", "subjects": ["Robotics", "Programming"], "difficulty": "Simple",
     "grade": ["9", "10"]},
]

user_filters = {}

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    welcome_text = (
        "Welcome to the Course Bot!\n\n"
        "Available commands:\n"
        "/start - Show this message\n"
        "/set_filters - Set your course preferences\n"
        "/website - Get a link to our website"
    )
    await update.message.reply_text(welcome_text)

async def set_filters(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.effective_user.id
    if user_id not in user_filters:
        user_filters[user_id] = {"subjects": set(), "difficulty": set(), "grade": set()}
    keyboard = [
        [InlineKeyboardButton("Subjects", callback_data="filter_subjects")],
        [InlineKeyboardButton("Difficulty", callback_data="filter_difficulty")],
        [InlineKeyboardButton("Grade", callback_data="filter_grade")],
        [InlineKeyboardButton("✅ Find Courses", callback_data="save_all_filters")],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("Please choose filters:", reply_markup=reply_markup)

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()
    user_id = update.effective_user.id
    data = query.data
    filter_menus = {
        "filter_subjects": ("Choose Subjects",
                            {"Artificial Intelligence", "Robotics", "Programming", "Cybersecurity", "Entrepreneurship",
                             "Financial Literacy", "Science"}),
        "filter_difficulty": ("Choose Difficulty", ["Simple", "Advanced", "Expert"]),
        "filter_grade": ("Choose Grade", ["7", "8", "9", "10", "11"]),
    }
    if data in filter_menus:
        menu_title, options = filter_menus[data]
        current_filter_key = data.split('_')[1]
        keyboard = []
        for option in options:
            text = f"✅ {option}" if option in user_filters[user_id][current_filter_key] else option
            keyboard.append([InlineKeyboardButton(text, callback_data=f"select_{current_filter_key}_{option}")])
        keyboard.append([InlineKeyboardButton("⬅️ Back", callback_data="back_to_main_filters")])
        reply_markup = InlineKeyboardMarkup(keyboard)
        await query.edit_message_text(text=menu_title, reply_markup=reply_markup)
    elif data.startswith("select_"):
        _, filter_key, value = data.split("_", 2)
        if value in user_filters[user_id][filter_key]:
            user_filters[user_id][filter_key].remove(value)
        else:
            user_filters[user_id][filter_key].add(value)
        menu_title, options = filter_menus[f"filter_{filter_key}"]
        keyboard = []
        for option in options:
            text = f"✅ {option}" if option in user_filters[user_id][filter_key] else option
            keyboard.append([InlineKeyboardButton(text, callback_data=f"select_{filter_key}_{option}")])
        keyboard.append([InlineKeyboardButton("⬅️ Back", callback_data="back_to_main_filters")])
        reply_markup = InlineKeyboardMarkup(keyboard)
        await query.edit_message_text(text=menu_title, reply_markup=reply_markup)
    elif data == "back_to_main_filters":
        keyboard = [
            [InlineKeyboardButton("Subjects", callback_data="filter_subjects")],
            [InlineKeyboardButton("Difficulty", callback_data="filter_difficulty")],
            [InlineKeyboardButton("Grade", callback_data="filter_grade")],
            [InlineKeyboardButton("✅ Find Courses", callback_data="save_all_filters")],
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await query.edit_message_text("Please choose filters:", reply_markup=reply_markup)
    elif data == "save_all_filters":
        filters = user_filters.get(user_id)
        if not filters or (not filters["subjects"] and not filters["difficulty"] and not filters["grade"]):
            await query.edit_message_text("You haven't selected any filters.")
            return
        results = []
        for course in COURSES:
            match_subject = not filters["subjects"] or any(s in course["subjects"] for s in filters["subjects"])
            match_difficulty = not filters["difficulty"] or course["difficulty"] in filters["difficulty"]
            match_grade = not filters["grade"] or any(g in course["grade"] for g in filters["grade"])
            if match_subject and match_difficulty and match_grade:
                results.append(course)
        if results:
            message = "Found courses matching your criteria:\n\n"
            for course in results:
                message += f"- *{course['name']}*\n  Subjects: {', '.join(course['subjects'])}\n  Difficulty: {course['difficulty']}\n  Grades: {', '.join(course['grade'])}\n\n"
            await query.edit_message_text(message, parse_mode='Markdown')
        else:
            await query.edit_message_text("No courses found matching your filters.")

async def show_website(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text("Visit our website: daha-git.vercel.app/")

ptb_app = Application.builder().token(BOT_TOKEN).build()
ptb_app.add_handler(CommandHandler("start", start))
ptb_app.add_handler(CommandHandler("set_filters", set_filters))
ptb_app.add_handler(CommandHandler("website", show_website))
ptb_app.add_handler(CallbackQueryHandler(button_callback))

@asynccontextmanager
async def lifespan(app: FastAPI):
    await ptb_app.initialize()
    logger.info("PTB Application initialized.")

    webhook_url = f"{WEBHOOK_URL}/webhook"
    await ptb_app.bot.set_webhook(url=webhook_url, allowed_updates=Update.ALL_TYPES)
    logger.info(f"Webhook set to: {webhook_url}")

    await ptb_app.start()
    logger.info("PTB Application started.")

    yield

    logger.info("Stopping PTB Application...")
    await ptb_app.stop()
    await ptb_app.bot.delete_webhook()
    await ptb_app.shutdown()
    logger.info("PTB Application shut down.")

app = FastAPI(lifespan=lifespan)

@app.post("/webhook")
async def process_update(request: Request):
    update_data = await request.json()
    update = Update.de_json(update_data, ptb_app.bot)
    await ptb_app.process_update(update)
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)