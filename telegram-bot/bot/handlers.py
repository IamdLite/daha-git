# bot/handlers.py

import logging
from telegram import Update
from telegram.ext import ContextTypes

# Your existing imports
from bot.keyboards import BotKeyboards
from bot.messages import (
    WELCOME_MESSAGE,
    FILTER_SELECTION_MESSAGE,
    WEBSITE_MESSAGE,
    ERROR_INVALID_FILTER_MESSAGE,
    ERROR_FILTER_UPDATE_MESSAGE,
    ERROR_GENERAL_MESSAGE,
    FILTER_MENUS
)
from utils.packager import save_and_show_filters, browse_courses

logger = logging.getLogger(__name__)

class BotHandlers:
    """
    Handles all interactions for the Telegram bot.
    """

    @staticmethod
    async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handles the /start command and initializes user session data."""
        try:
            context.user_data.setdefault('subjects', set())
            context.user_data.setdefault('difficulty', set())
            context.user_data.setdefault('grade', set())

            keyboard = BotKeyboards.get_main_menu_keyboard()
            await update.message.reply_text(WELCOME_MESSAGE, reply_markup=keyboard)
        except Exception as e:
            logger.error(f"Error in /start command: {e}", exc_info=True)
            await update.message.reply_text(ERROR_GENERAL_MESSAGE)

    @staticmethod
    async def set_filters_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handles the /set_filters command."""
        try:
            keyboard = BotKeyboards.get_filter_selection_keyboard()
            await update.message.reply_text(FILTER_SELECTION_MESSAGE, reply_markup=keyboard)
        except Exception as e:
            logger.error(f"Error in /set_filters command: {e}", exc_info=True)
            await update.message.reply_text(ERROR_GENERAL_MESSAGE)

    @staticmethod
    async def website_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handles the /website command."""
        try:
            keyboard = BotKeyboards.get_website_keyboard()
            await update.message.reply_text(WEBSITE_MESSAGE, reply_markup=keyboard)
        except Exception as e:
            logger.error(f"Error in /website command: {e}", exc_info=True)
            await update.message.reply_text(ERROR_GENERAL_MESSAGE)

    @staticmethod
    async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handles all button callbacks, routing them to the correct logic."""
        query = update.callback_query
        try:
            await query.answer()
            data = query.data

            if data == "save_all_filters":
                await save_and_show_filters(update, context)
            elif data == "browse":
                await browse_courses(update, context)
            elif data in FILTER_MENUS:
                await BotHandlers.handle_filter_menu_query(query, data, context.user_data)
            elif data.startswith("select_"):
                await BotHandlers.handle_filter_selection_query(query, data, context)
            elif data == "back_to_main_filters":
                keyboard = BotKeyboards.get_filter_selection_keyboard()
                await query.edit_message_text(FILTER_SELECTION_MESSAGE, reply_markup=keyboard)
            else:
                await query.edit_message_text(ERROR_INVALID_FILTER_MESSAGE)

        except Exception as e:
            logger.error(f"Error in button_callback: {e}", exc_info=True)
            try:
                await query.edit_message_text(ERROR_GENERAL_MESSAGE)
            except Exception:
                if query.message:
                    await query.message.reply_text(ERROR_GENERAL_MESSAGE)

    @staticmethod
    async def handle_filter_menu_query(query, data: str, user_data: dict):
        """Displays options for a specific filter category using context.user_data."""
        try:
            menu_title, _ = FILTER_MENUS.get(data)
            current_filter_key = data.split('_')[1]
            current_filters = user_data.get(current_filter_key, set())
            keyboard = BotKeyboards.get_filter_options_keyboard(current_filter_key, current_filters)
            await query.edit_message_text(text=menu_title, reply_markup=keyboard)
        except Exception as e:
            logger.error(f"Error updating filter menu: {e}", exc_info=True)
            await query.edit_message_text(ERROR_FILTER_UPDATE_MESSAGE)

    @staticmethod
    async def handle_filter_selection_query(query, data: str, context: ContextTypes.DEFAULT_TYPE):
        """
        Updates the user's filter choices within context.user_data for the current session.
        This version safely initializes the filter set if it doesn't exist.
        """
        try:
            _, filter_key, value = data.split('_', 2)

            filters_set = context.user_data.setdefault(filter_key, set())

            if value in filters_set:
                filters_set.remove(value)
            else:
                filters_set.add(value)

            # Rebuild and show the updated keyboard
            current_filters = context.user_data.get(filter_key, set())
            menu_key = f"filter_{filter_key}"
            menu_title, _ = FILTER_MENUS[menu_key]
            keyboard = BotKeyboards.get_filter_options_keyboard(filter_key, current_filters)
            await query.edit_message_text(text=menu_title, reply_markup=keyboard)
        except Exception as e:
            # Added exc_info=True for more detailed error logging
            logger.error(f"Error handling filter selection: {e}", exc_info=True)
            await query.edit_message_text(ERROR_FILTER_UPDATE_MESSAGE)

