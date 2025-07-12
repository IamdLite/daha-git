import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # Bot configuration
    BOT_TOKEN = os.getenv("BOT_TOKEN")
    WEBHOOK_URL = os.getenv("WEBHOOK_URL")
    MINI_APP_URL = 'https://daha-git.vercel.app/'

    # API configuration
    USER_DATA_API_ENDPOINT = os.getenv("USER_DATA_API_ENDPOINT")
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
