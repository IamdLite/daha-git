# packager.py

import asyncio
import logging
from typing import Dict, Any, Set

from telegram import Update
from telegram.ext import ContextTypes

from api.client import CourseAPIClient, APIError
from data.courses import course_filter, SUBJECT_TO_CATEGORY, DIFFICULTY_TO_LEVEL, GRADE_TO_ID
from bot.keyboards import BotKeyboards

logger = logging.getLogger(__name__)

def _format_user_payload(user_id: int, username: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Formats the user filter data into the required API payload.
    
    Note: The specified API format accepts only a single value for category,
    level, and grade. This function will use the first selected item for each.
    """
    selected_subjects: Set[str] = user_data.get('subjects', set())
    selected_difficulty: Set[str] = user_data.get('difficulty', set())
    selected_grades: Set[str] = user_data.get('grade', set())
    
    saved_filters = {}

    # Format category_id
    if selected_subjects:
        first_subject = next(iter(selected_subjects), None)
        if first_subject in SUBJECT_TO_CATEGORY:
            saved_filters['category_id'] = SUBJECT_TO_CATEGORY[first_subject]

    # Format level
    if selected_difficulty:
        first_difficulty = next(iter(selected_difficulty), None)
        if first_difficulty in DIFFICULTY_TO_LEVEL:
            saved_filters['level'] = DIFFICULTY_TO_LEVEL[first_difficulty]
    
    # Format grade object
    if selected_grades:
        first_grade_name = next(iter(selected_grades), None) # e.g., '7 класс'
        if first_grade_name in GRADE_TO_ID:
            grade_id = GRADE_TO_ID[first_grade_name]
            # Extract numeric level from string (e.g., '7' from '7 класс')
            grade_level = int(first_grade_name.split(' ')[0])
            saved_filters['grade'] = {"id": grade_id, "level": grade_level}

    payload = {
        "id": user_id,
        "username": username or "N/A",
        "saved_filters": saved_filters,
        "notifications": "yes"  # Set to "yes" by default as requested
    }
    
    return payload


async def browse_courses(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()
    
    user = update.effective_user
    logger.info(f"User {user.id} ({user.username}) is attempting to browse courses.")

    try:
        api_client = CourseAPIClient()
        configure_filters = {}
        if context.user_data.get('subjects'):
            context.user_data['subjects'] = context.user_data.get('subjects')
        if context.user_data.get('difficulty'):
            context.user_data['difficulty'] = context.user_data.get('difficulty')
        if context.user_data.get('grade'):
            context.user_data['grade'] = context.user_data.get('grade')

        courses = course_filter.filter_courses(configure_filters)
        
        logger.info(f"Successfully found courses for user {user.id} via API.")
        await query.edit_message_text(text=f"Найдено {len(courses)} курсов по вашему запросу")

        if courses:
            for course in courses:
                message = course_filter.format_course_message(course)
                keyboard = BotKeyboards.get_course_keyboard(course.get("url"))
                await query.message.reply_text(message, reply_markup=keyboard)

    except APIError as e:
        logger.error(f"Failed to save filters for user {user.id}: {e}")
        await query.edit_message_text(text="🚫 Произошла ошибка при сохранении фильтров. Пожалуйста, попробуйте еще раз позже.")
        # await query.edit_message_text(text="DB IS DOWN, COURSE PULLING IS OFF FOR NOW") # TODO remove
    except Exception as e:
        logger.error(f"An unexpected error occurred in save_and_show_filters for user {user.id}: {e}", exc_info=True)
        await query.edit_message_text(text="🚫 Произошла непредвиденная ошибка.")


async def save_and_show_filters(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Saves the user's filters by sending them to the backend API
    and displays the selected filters back to the user.
    """
    query = update.callback_query
    await query.answer()
    
    user = update.effective_user
    logger.info(f"User {user.id} ({user.username}) is saving filters to the API.")

    try:
        # 1. Format the payload for the API
        payload = _format_user_payload(user.id, user.username, context.user_data)
        
        # 2. Send data to the API in a non-blocking way
        api_client = CourseAPIClient()
        await asyncio.to_thread(api_client.register_or_update_user, payload)
        
        logger.info(f"Successfully saved filters for user {user.id} via API.")

        # 3. Create a confirmation message for the user
        message_parts = ["✅ *Ваши фильтры сохранены!*\n"]
        if context.user_data.get('subjects'):
            message_parts.append(f"Предметы: {', '.join(context.user_data['subjects'])}")
        if context.user_data.get('difficulty'):
            message_parts.append(f"Сложность: {', '.join(context.user_data['difficulty'])}")
        if context.user_data.get('grade'):
            message_parts.append(f"Класс: {', '.join(context.user_data['grade'])}")
        
        if len(message_parts) == 1:
            message_parts.append("У вас не выбрано ни одного фильтра.")
            
        message = "\n".join(message_parts)
        await query.edit_message_text(text=message, parse_mode='Markdown')

    except APIError as e:
        logger.error(f"Failed to save filters for user {user.id}: {e}")
        # await query.edit_message_text(text="🚫 Произошла ошибка при сохранении фильтров. Пожалуйста, попробуйте еще раз позже.")
        await query.edit_message_text(text="DB IS DOWN, COURSE PULLING IS OFF FOR NOW") # TODO remove
    except Exception as e:
        logger.error(f"An unexpected error occurred in save_and_show_filters for user {user.id}: {e}", exc_info=True)
        await query.edit_message_text(text="🚫 Произошла непредвиденная ошибка.")
