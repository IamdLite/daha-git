import requests
import json
import os
from typing import Dict, Any, List, Optional, Union
from datetime import datetime
import logging
from configs.settings import settings

logger = logging.getLogger(__name__)


class CourseAPIClient:
    """
    Клиент для работы с API курсов
    """
    session = requests.Session()
    session.headers.update({ 
            'Authorization': f'DREAM apikey="{settings.API_KEY}"',
            'Content-Type': 'application/json',
            'User-Agent': 'DAHA-Bot/1.0'
    }) # TODO look into upon update


    def get_courses(self,
                    category_id: Optional[int] = None,
                    level: Optional[str] = None,
                    grade_id: Optional[dict] = None,
                    skip: int = 0,
                    limit: int = 100) -> Dict[str, Any]:
        """
        Получение курсов с фильтрацией

        Args:
            category_id: ID категории
            level: Уровень сложности
            grade_id: ID класса
            skip: Количество пропускаемых записей
            limit: Максимальное количество записей

        Returns:
            Словарь с данными курсов
        """
        endpoint = f"{settings.BASE_URL}/api/courses/"
        logger.info(f"base url + course search is : {endpoint}")

        # Формируем параметры запроса
        params = {}
        
        if category_id is not None:
            params['category_id'] = category_id
        else:
            params['category_id'] = {}

        if level is not None:
            params['level'] = level
        else:
            params['level'] = {}
            
        if grade_id is not None:
            params['grade'] = grade
        else:
            params['grade'] = {
                "id":0,
                "level":0
                }

        if skip > 0:
            params['skip'] = skip
        if limit != 100:
            params['limit'] = min(limit, 100)

        try:
            response = requests.get(endpoint, params=params, timeout=30)
            response.raise_for_status()

            # Получаем общее количество из заголовка
            total_count = response.headers.get('X-Count', '0')
            courses_data = response.json()

            return {
                'courses': courses_data,
                'total_count': int(total_count),
                'returned_count': len(courses_data) if isinstance(courses_data, list) else 0,
                'skip': skip,
                'limit': limit
            }

        except requests.exceptions.RequestException as e:
            logger.error(f"Ошибка API запроса: {e}")
            raise APIError(f"Не удалось получить курсы: {e}")
        except json.JSONDecodeError as e:
            logger.error(f"Ошибка парсинга JSON: {e}")
            raise APIError(f"Неверный формат ответа API: {e}")

    def get_all_courses(self,
                        category_id: Optional[int] = None,
                        level: Optional[str] = None,
                        grade_id: Optional[int] = None,
                        batch_size: int = 100) -> List[Dict[str, Any]]:
        """
        Получение всех курсов с пагинацией

        Args:
            category_id: ID категории
            level: Уровень сложности
            grade_id: ID класса
            batch_size: Размер пакета для запроса

        Returns:
            Список всех курсов
        """
        all_courses = []
        skip = 0

        while True:
            try:
                result = self.get_courses(
                    category_id=category_id,
                    level=level,
                    grade_id=grade_id,
                    skip=skip,
                    limit=batch_size
                )

                courses = result['courses']
                if not courses:
                    break

                all_courses.extend(courses)

                # Проверяем, есть ли еще данные
                if len(courses) < batch_size:
                    break

                skip += batch_size

            except Exception as e:
                logger.error(f"Ошибка при получении пакета курсов: {e}")
                break

        return all_courses

    def register_or_update_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sends user data and their saved filters to the API.
        """
        endpoint = f"{settings.BASE_URL}/api/bot/user/register-or-update"
        try:
            response = self.session.post(endpoint, json=user_data)
            response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
            logger.info(f"Successfully registered/updated user {user_data.get('id')}. Response: {response.json()}")
            return response.json()
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP Error registering/updating user: {e.response.text}")
            raise APIError(f"Failed to register or update user. Status code: {e.response.status_code}")
        except requests.exceptions.RequestException as e:
            logger.error(f"Request Error registering/updating user: {e}")
            raise APIError("A network error occurred while communicating with the API.")
    
    def get_all_users_with_filters(self) -> list:
        """
        Retrieves all users and their saved filters from the API.
        NOTE: This assumes a new backend endpoint GET /api/users exists.
        """
        endpoint = f"{settings.BASE_URL}/api/users/?skip=0&limit=100"  # TODO change
        try:
            response = self.session.get(endpoint)
            response.raise_for_status()
            # Expecting a list of users, e.g., [{'id': 123, 'saved_filters': {...}}, ...]
            return response.json()
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP Error fetching users: {e.response.text}")
            raise APIError(f"Failed to fetch users. Status code: {e.response.status_code}")
        except requests.exceptions.RequestException as e:
            logger.error(f"Request Error fetching users: {e}")
            raise APIError("A network error occurred while fetching users.")


class APIError(Exception):
    """Кастомное исключение для ошибок API"""

    def __init__(self, message: str, status_code: Optional[int] = None):
        super().__init__(message)
        self.status_code = status_code
