from typing import Dict, Set, List, Any, Optional
import logging
from api.client import CourseAPIClient, APIError
from configs.settings import settings, SUBJECT_TO_CATEGORY, DIFFICULTY_TO_LEVEL, GRADE_TO_ID



logger = logging.getLogger(__name__)


def _convert_filters_to_api_params(filters: Dict[str, Set]) -> Dict[str, Any]:
    """
    Конвертирует фильтры бота в параметры API

    Args:
        filters: Фильтры пользователя из бота

    Returns:
        Параметры для API запроса
    """
    api_params = {}

    # Конвертируем предметы в category_id
    if filters.get("subjects"):
        subjects = filters["subjects"]
        # Берем первый предмет для простоты (можно расширить логику)
        for subject in subjects:
            if subject in SUBJECT_TO_CATEGORY:
                api_params['category_id'] = SUBJECT_TO_CATEGORY[subject]
                break

    # Конвертируем сложность в level
    if filters.get("difficulty"):
        difficulties = filters["difficulty"]
        # Берем первую сложность
        for difficulty in difficulties:
            if difficulty in DIFFICULTY_TO_LEVEL:
                api_params['level'] = DIFFICULTY_TO_LEVEL[difficulty]
                break

    # Конвертируем класс в grade_id
    if filters.get("grade"):
        grades = filters["grade"]
        # Берем первый класс
        for grade in grades:
            if isinstance(grade, str) and grade.isdigit():
                grade = int(grade)
            if grade in GRADE_TO_ID:
                api_params['grade'] = {
                    "id": GRADE_TO_ID[grade],
                    "level": grade
                    }
                break

    return api_params


class CourseFilter:

    def __init__(self):
        """Инициализация сервиса"""
        try:
            #config.validate()
            logger.info(self, "API client инициализирован")
            self.api_client = CourseAPIClient()

        except Exception as e:
            logger.error(f"Ошибка инициализации CourseFilter: {e}")
            raise

    def filter_courses(self, filters: Dict[str, Set]) -> List[Dict[str, Any]]:
        """
        Фильтрует курсы по заданным критериям через API

        Args:
            filters: Словарь с фильтрами пользователя

        Returns:
            Список отфильтрованных курсов
        """
        try:
            # Конвертируем фильтры в параметры API
            logger.info(filters)
            api_params = _convert_filters_to_api_params(filters)

            logger.info(f"Запрос курсов с параметрами: {api_params}")

            # Получаем курсы через API
            if api_params:
                # Если есть параметры для API, используем их
                result = self.api_client.get_courses(**api_params)
                courses = result['courses']
            else:
                # Если нет параметров API, получаем все курсы
                courses = self.api_client.get_all_courses()



            logger.info(f"Найдено {len(courses)} курсов после фильтрации")

            return courses

        except APIError as e:
            logger.error(f"Ошибка API при фильтрации курсов: {e}")
            # Возвращаем пустой список в случае ошибки API
            return []
        except Exception as e:
            logger.error(f"Неожиданная ошибка при фильтрации курсов: {e}")
            return []

    def get_course_by_id(self, course_id: int) -> Optional[Dict[str, Any]]:
        """
        Получение курса по ID

        Args:
            course_id: ID курса

        Returns:
            Данные курса или None
        """
        try:
            # Для получения конкретного курса нужно будет расширить API клиент
            # Пока получаем все курсы и ищем нужный
            all_courses = self.api_client.get_all_courses()
            for course in all_courses:
                if course.get('id') == course_id:
                    return course
            return None
        except Exception as e:
            logger.error(f"Ошибка при получении курса {course_id}: {e}")
            return None

    @staticmethod
    def format_course_message(course: Dict[str, Any]) -> str:
        """
        Форматирует информацию о курсе для отправки пользователю

        Args:
            course: Словарь с данными курса

        Returns:
            Отформатированное сообщение
        """
        grade_list = ""
        for grade in course['grades']:
            grade_list += (str(({grade['level']}).pop())) + ", "
        

        return (
            f"{course.get('title')}\n"
            f"Предмет(-ы) 📚: {course['category']['name']}\n"
            f"Провайдер 🧭: {course['provider']}\n"
            f"Класс(-ы) 🏫:" + grade_list + "\n"
            f"Сложность 🎚️: {course['level']}\n"
            f"Даты 🗓️: {course['start_date']} - {course['end_date']}\n"
            f"Описание 📜:\n\n{course['description']}\n\n"
            f"Ссылка ↘️\n"
        )

# Глобальный экземпляр сервиса
course_filter = CourseFilter()


