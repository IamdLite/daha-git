from telegram import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from configs.settings import settings
from bot.messages import FILTER_MENUS


class BotKeyboards:
    """Класс для создания клавиатур бота"""

    @staticmethod
    def get_main_menu_keyboard() -> InlineKeyboardMarkup:
        """Главное меню с мини-приложением"""
        return InlineKeyboardMarkup([
            [InlineKeyboardButton("мини-приложение", web_app=WebAppInfo(url=settings.MINI_APP_URL))]
        ])

    @staticmethod
    def get_filter_selection_keyboard() -> InlineKeyboardMarkup:
        """Клавиатура выбора фильтров"""
        keyboard = [
            [InlineKeyboardButton("Предметы", callback_data="filter_subjects")],
            [InlineKeyboardButton("Сложность", callback_data="filter_difficulty")],
            [InlineKeyboardButton("Класс", callback_data="filter_grade")],
            [InlineKeyboardButton("✅ Найти курсы", callback_data="browse")],
            [InlineKeyboardButton("💾 Сохранить Фильтры", callback_data="save_all_filters")],
        ]
        return InlineKeyboardMarkup(keyboard)


    @staticmethod
    def get_filter_options_keyboard(filter_type: str, user_filters: set) -> InlineKeyboardMarkup:
        """
        Клавиатура с опциями конкретного фильтра

        Args:
            filter_type: Тип фильтра (subjects, difficulty, grade)
            user_filters: Текущие фильтры пользователя

        Returns:
            Клавиатура с опциями
        """
        filter_key = f"filter_{filter_type}"
        if filter_key not in FILTER_MENUS:
            return InlineKeyboardMarkup([])

        _, options = FILTER_MENUS[filter_key]
        keyboard = []

        for option in options:
            text = f"✅ {option}" if option in user_filters else option
            keyboard.append([
                InlineKeyboardButton(text, callback_data=f"select_{filter_type}_{option}")
            ])

        keyboard.append([
            InlineKeyboardButton("⬅️ Назад", callback_data="back_to_main_filters")
        ])

        return InlineKeyboardMarkup(keyboard)

    @staticmethod
    def get_course_keyboard(course_link: str) -> InlineKeyboardMarkup:
        """
        Клавиатура для курса

        Args:
            course_link: Ссылка на курс

        Returns:
            Клавиатура с кнопками курса
        """
        return InlineKeyboardMarkup([[InlineKeyboardButton("Ссылка на курс", url=course_link)]])

    @staticmethod
    def get_website_keyboard() -> InlineKeyboardMarkup:
        """Клавиатура для сайта"""
        return InlineKeyboardMarkup([
            [InlineKeyboardButton("мини-приложение", web_app=WebAppInfo(url=settings.MINI_APP_URL))]
        ])
