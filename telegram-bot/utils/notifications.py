import asyncio
import logging
from typing import Set, Dict, Any

from telegram.ext import Application  # Import for type hinting

from api.client import CourseAPIClient, APIError
from data.courses import CourseFilter
from bot.keyboards import BotKeyboards

logger = logging.getLogger(__name__)

# In-memory store for the last seen course IDs.
last_course_ids: Set[int] = set()

def user_filters_match_course(user_filters: Dict[str, Any], course: Dict[str, Any]) -> bool:
    """
    Checks if a course matches a user's API-sourced filters.
    (This function remains functionally unchanged)
    """
    if not user_filters:
        return False

    course_category_id = course.get('category', {}).get('id')
    course_level = course.get('level')
    course_grade_levels = {str(grade.get('level')) for grade in course.get('grades', [])}

    if 'category_id' in user_filters and user_filters['category_id'] is not None:
        if user_filters['category_id'] != course_category_id:
            return False

    if 'level' in user_filters and user_filters['level'] is not None:
        if user_filters['level'] != course_level:
            return False

    if 'grade' in user_filters and user_filters['grade'] is not None:
        user_grade_level = str(user_filters['grade'].get('level'))
        if user_grade_level and user_grade_level not in course_grade_levels:
            return False
            
    return True

async def check_for_new_courses_and_notify(ptb_app: Application):
    """
    Polls for new courses and notifies users. It now receives the ptb_app instance.
    """
    global last_course_ids
    logger.info("Checking for new courses...")
    api_client = CourseAPIClient()

    try:
        # 1. Fetch all courses from the API
        all_courses = await asyncio.to_thread(api_client.get_all_courses)
        if not all_courses:
            logger.info("No courses returned from API.")
            return

        current_course_ids = {course['id'] for course in all_courses}

        if not last_course_ids:
            logger.info("First run, initializing course IDs.")
            last_course_ids = current_course_ids
            return

        # 2. Identify new courses
        new_ids = current_course_ids - last_course_ids
        if not new_ids:
            logger.info("No new courses found.")
            return

        logger.info(f"Found {len(new_ids)} new course(s): {new_ids}")
        new_courses = [course for course in all_courses if course['id'] in new_ids]

        # 3. Get all users and filters from the API
        all_users = await asyncio.to_thread(api_client.get_all_users_with_filters)
        if not all_users:
            logger.info("No users with saved filters returned from API.")
            return
            
        for course in new_courses:
            for user_data in all_users:
                user_id = user_data.get('id')
                user_filters = user_data.get('saved_filters', {})
                
                if not user_id or not user_filters:
                    continue

                if user_filters_match_course(user_filters, course):
                    logger.info(f"User {user_id} matches course {course['id']}. Sending notification.")
                    message = "      |НОВЫЙ КУРС|\n" + CourseFilter.format_course_message(course)
                    keyboard = BotKeyboards.get_course_keyboard(course.get('url'))
                    try:
                        # Use the ptb_app instance passed as an argument
                        await ptb_app.bot.send_message(chat_id=user_id, text=message, reply_markup=keyboard)
                    except Exception as e:
                        logger.error(f"Failed to send notification to user {user_id}: {e}")

        last_course_ids.update(new_ids)

    except APIError as e:
        logger.error(f"API Error when checking for new courses or users: {e}")
    except Exception as e:
        logger.error(f"An unexpected error occurred during notification check: {e}", exc_info=True)

async def send_auth_code(app: Application, user_id: int, code: int):
    """
    Sends an authentication code to a specified Telegram user.
    """
    try:
        message = f"Ваш код аутентификации: {code}"
        await app.bot.send_message(chat_id=user_id, text=message)
        logger.info(f"Successfully sent auth code to user {user_id}")
        return True
    except Exception as e:
        logger.error(f"Failed to send auth code to user {user_id}: {e}")
        return False

async def run_scheduler(app: Application):
    """
    A placeholder for the notification scheduler task that is already
    being called in your main.py.
    """
    logger.info("Scheduler is running...")
    while True:
        await asyncio.sleep(10)

async def run_scheduler(ptb_app: Application):
    """
    Sets up and runs the notification scheduler, now accepting the ptb_app instance.
    """
    logger.info("Notification scheduler started with injected dependency.")
    while True:
        try:
            # Pass the application instance to the check function
            await check_for_new_courses_and_notify(ptb_app)
        except Exception as e:
            logger.error(f"An error occurred in the notification scheduler loop: {e}", exc_info=True)
        
        await asyncio.sleep(10)
