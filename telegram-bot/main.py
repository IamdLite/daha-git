import asyncio
import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime

import uvicorn
from fastapi import FastAPI, Request, HTTPException, status
from telegram import Update, InputFile
from pydantic import BaseModel
from telegram.ext import Application, CommandHandler, CallbackQueryHandler

from configs.settings import settings
from bot.handlers import BotHandlers
from utils.notifications import run_scheduler, send_auth_code

# Assuming you have a validate method in your settings
if hasattr(settings, 'validate'):
    settings.validate()

# Настройка логирования для Docker
def setup_file_handler():
    logs_dir = "/logs"
    log_file = os.path.join(logs_dir, "bot.log")
    try:
        os.makedirs(logs_dir, exist_ok=True)
        with open(log_file, 'a') as test_file:
            test_file.write("")
        return logging.FileHandler(log_file)
    except (PermissionError, OSError) as e:
        print(f"Cannot write to log file {log_file}: {e}. Falling back to console logging.")
        return logging.StreamHandler()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[setup_file_handler(), logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

ptb_app = Application.builder().token(settings.BOT_TOKEN).build()

# Регистрируем обработчики команд
ptb_app.add_handler(CommandHandler("start", BotHandlers.start_command))
ptb_app.add_handler(CommandHandler("set_filters", BotHandlers.set_filters_command))
ptb_app.add_handler(CommandHandler("website", BotHandlers.website_command))
ptb_app.add_handler(CallbackQueryHandler(BotHandlers.button_callback))


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Управление жизненным циклом приложения"""
    await ptb_app.initialize()
    logger.info("PTB приложение инициализировано.")
    
    # --- KEY CHANGE: PASS THE PTB_APP INSTANCE TO THE SCHEDULER ---
    # This "injects" the dependency and breaks the circular import.
    asyncio.create_task(run_scheduler(ptb_app))
    logger.info("Notification scheduler task created.")

    webhook_url = f"{settings.WEBHOOK_URL}/webhook"
    certificate_path = "/app/certificate.crt"
    
    try:
        with open(certificate_path, 'rb') as cert_file:
            certificate = InputFile(cert_file.read(), filename="cert.pem")
        await ptb_app.bot.set_webhook(
            url=webhook_url,
            certificate=certificate,
            allowed_updates=Update.ALL_TYPES
        )
        logger.info(f"Webhook установлен на: {webhook_url} с пользовательским сертификатом")
    except FileNotFoundError:
        logger.warning(f"Сертификат не найден: {certificate_path}. Устанавливаю webhook без сертификата.")
        await ptb_app.bot.set_webhook(url=webhook_url, allowed_updates=Update.ALL_TYPES)
    except Exception as e:
        logger.error(f"Ошибка установки webhook с сертификатом: {e}. Устанавливаю webhook без сертификата.")
        await ptb_app.bot.set_webhook(url=webhook_url, allowed_updates=Update.ALL_TYPES)

    await ptb_app.start()
    logger.info("PTB приложение запущено.")
    yield
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
    try:
        update_data = await request.json()
        update = Update.de_json(update_data, ptb_app.bot)
        if update:
            await ptb_app.process_update(update)
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Webhook processing error: {e}")
        return {"status": "error", "message": str(e)}

class AuthPayload(BaseModel):
    code: int
    user_id: int
    api_token: str

@app.post('/auth/send-code')
async def send_verification_code(payload: AuthPayload):
    """
    Receives a verification code and user_id, validates the API token,
    and sends the code to the user via Telegram.
    """
    if payload.api_token != settings.API_TOKEN:
        logger.warning("Unauthorized attempt to use /auth/send-code.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Token",
        )

    success = await send_auth_code(
        app=ptb_app,
        user_id=payload.user_id,
        code=payload.code
    )

    if success:
        return {'status': 'ok', 'message': 'Authentication code sent successfully.'}
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send authentication code.",
        )

@app.get("/health")
async def health_check():
    """Проверка здоровья приложения"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "bot_status": "running"
    }

if __name__ == '__main__':
    uvicorn.run(
        app,
        host='0.0.0.0',
        port=8080,
        proxy_headers=True,
        forwarded_allow_ips='*'
    )
