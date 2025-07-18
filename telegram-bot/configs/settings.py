import logging
import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)

logger = logging.getLogger(__name__)


class Settings:
    # Bot configuration
    BOT_TOKEN = os.getenv("BOT_TOKEN")
    WEBHOOK_URL = os.getenv("WEBHOOK_URL").rstrip('/webhook')
    MINI_APP_URL = 'https://daha-git.vercel.app/'

    BASE_URL = os.getenv("BASE_URL") # or 'https://ocoqqb-ip-188-130-155-152.tunnelmole.net'
    API_KEY = os.getenv("API_KEY")
    TIMEOUT = int(os.getenv("API_TIMEOUT", "30"))
    DEFAULT_LIMIT = int(os.getenv("API_DEFAULT_LIMIT", "100"))
    MAX_LIMIT = int(os.getenv("API_MAX_LIMIT", "100"))

    # API configuration
    USER_DATA_API_ENDPOINT = f'{BASE_URL}/api/bot/user/register-or-update'
    API_TOKEN = os.getenv("API_TOKEN")

    # Admin configuration
    ADMIN_USER_IDS = [int(x) for x in os.getenv("ADMIN_USER_IDS", "").split(",") if x.strip()]

    @classmethod
    def validate(cls):
        """Проверяет обязательные настройки"""
        if not cls.BOT_TOKEN:
            raise ValueError("Ошибка: BOT_TOKEN не установлен в файле .env или в переменных окружения.")
        if not cls.WEBHOOK_URL:
            raise ValueError("Ошибка: WEBHOOK_URL не установлен в файле .env или в переменных окружения.")
        if not cls.MINI_APP_URL:
            raise ValueError("Ошибка: MINI_APP_URL не установлен в файле .env или в переменных окружения.")

settings = Settings()

SUBJECT_TO_CATEGORY = {
    "ИИ 🤖": 1,
    "Робототехника 🦾": 4,
    "Программирование 💻": 2,
    "Кибербезопасность 🛡️": 3,
    "Предпринимательство 🏢": 5,
    "Финансовая грамотность 🏦": 6,
    "Наука 🔭": 7,
    
}

DIFFICULTY_TO_LEVEL = {
    'Начальный 🟢': 'Начальный',
    'Средний 🟡': 'Средний',
    'Продвинутый 🟠': 'Продвинутый',
}

GRADE_TO_ID = {
    7: 1,
    8: 2,
    9: 3,
    10: 4,
    11: 5
}
