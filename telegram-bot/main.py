import asyncio
import logging
import os
import ssl
from contextlib import asynccontextmanager
from datetime import datetime

import uvicorn
from fastapi import FastAPI, Request
from telegram import Update, InputFile
from telegram.ext import Application, CommandHandler, CallbackQueryHandler

from configs.settings import settings
from bot.handlers import BotHandlers
from data.user_storage import user_storage

# Проверяем настройки
settings.validate()

# Настройка логирования для Docker
def setup_file_handler():
    logs_dir = "/logs"
    log_file = os.path.join(logs_dir, "bot.log")
    
    try:
        # Ensure directory exists
        os.makedirs(logs_dir, exist_ok=True)
        
        # Test write permissions by attempting to create/write to the log file
        with open(log_file, 'a') as test_file:
            test_file.write("")  # Test write access
            
        return logging.FileHandler(log_file)
        
    except (PermissionError, OSError) as e:
        print(f"Cannot write to log file {log_file}: {e}")
        print("Falling back to console logging")
        return logging.StreamHandler()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        setup_file_handler(),  # This will handle the file vs console decision
        logging.StreamHandler()  # Console output
    ]
)

logger = logging.getLogger(__name__)

# Создаем приложение Telegram бота
ptb_app = Application.builder().token(settings.BOT_TOKEN).build()

# Регистрируем обработчики команд
ptb_app.add_handler(CommandHandler("start", BotHandlers.start_command))
ptb_app.add_handler(CommandHandler("set_filters", BotHandlers.set_filters_command))
ptb_app.add_handler(CommandHandler("register", BotHandlers.set_filters_command))
ptb_app.add_handler(CommandHandler("website", BotHandlers.website_command))
ptb_app.add_handler(CommandHandler("package", BotHandlers.manual_package_command))
ptb_app.add_handler(CallbackQueryHandler(BotHandlers.button_callback))


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Управление жизненным циклом приложения"""
    # Запуск
    await ptb_app.initialize()
    logger.info("PTB приложение инициализировано.")

    webhook_url = f"{settings.WEBHOOK_URL}/webhook"
    certificate_path = "/app/certificate.crt"
    
    try:
        # Read certificate file content
        with open(certificate_path, 'rb') as cert_file:
            certificate_data = cert_file.read()
        
        # Create InputFile from bytes
        certificate = InputFile(certificate_data, filename="cert.pem")
        
        await ptb_app.bot.set_webhook(
            url=webhook_url,
            certificate=certificate,
            allowed_updates=Update.ALL_TYPES,
            drop_pending_updates=False
        )
        
        logger.info(f"Webhook установлен на: {webhook_url} с пользовательским сертификатом и сбросом ожидающих обновлений")
        
    except FileNotFoundError:
        logger.error(f"Сертификат не найден: {certificate_path}")
        # Fallback to webhook without certificate
        await ptb_app.bot.set_webhook(url=webhook_url, allowed_updates=Update.ALL_TYPES)
        logger.info(f"Webhook установлен на: {webhook_url} без сертификата")
    except Exception as e:
        logger.error(f"Ошибка чтения сертификата: {e}")
        # Fallback to webhook without certificate
        await ptb_app.bot.set_webhook(url=webhook_url, allowed_updates=Update.ALL_TYPES)
        logger.info(f"Webhook установлен на: {webhook_url} без сертификата")

    await ptb_app.start()
    logger.info("PTB приложение запущено в Docker контейнере.")
    logger.info("Упаковщик настроен для работы по требованию (при сохранении фильтров)")

    yield

    # Остановка
    logger.info("Остановка PTB приложения...")
    await ptb_app.stop()
    await ptb_app.bot.delete_webhook()
    await ptb_app.shutdown()
    logger.info("PTB приложение остановлено.")


# Создаем FastAPI приложение
app = FastAPI(lifespan=lifespan, title="DAHA Telegram Bot")


@app.post("/webhook")
async def process_update(request: Request):
    """Обработка обновлений от Telegram"""
    # Add this line to log ALL incoming requests
    logger.info(f"Webhook endpoint hit from IP: {request.client.host}")
    
    try:
        update_data = await request.json()
        
        # Validate that this looks like a Telegram update
        if not isinstance(update_data, dict) or 'update_id' not in update_data:
            logger.warning("Invalid webhook data format")
            return {"status": "error", "message": "Invalid update format"}
        
        update = Update.de_json(update_data, ptb_app.bot)
        if update:
            await ptb_app.process_update(update)
        else:
            logger.warning("Failed to create Update object from data")
        
        return {"status": "ok"}
        
    except Exception as e:
        logger.error(f"Webhook processing error: {e}")
        return {"status": "error", "message": str(e)}


@app.get("/package_status")
async def package_status():
    """Эндпоинт для проверки статуса упаковщика"""
    return {
        "total_users": user_storage.get_user_count(),
        "packager_mode": "on_demand",
        "container": "docker",
        "last_check": datetime.now().isoformat()
    }


@app.get("/health")
async def health_check():
    """Проверка здоровья приложения"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "users_count": user_storage.get_user_count(),
        "environment": "docker"
    }

if __name__ == '__main__':
    uvicorn.run(
        app,
        host='0.0.0.0',
        port=8080,
        proxy_headers=True,
        forwarded_allow_ips='*'
    )
