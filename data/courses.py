from typing import List, Dict, Any, Set

COURSES = [
    {
        "id": 63,
        "name": "Личные финансы для подростков",
        "subjects": ["Финансовая грамотность"],
        "difficulty": "Начальный",
        "grade": ["9", "10", "11"],
        "dates": "01.09.2025 - 30.11.2025",
        "provider": "Центральный банк РФ",
        "link": "https://fincult.info/"
    },
    {
        "id": 64,
        "name": "Инвестирование для начинающих",
        "subjects": ["Финансовая грамотность", "Предпринимательство"],
        "difficulty": "Средний",
        "grade": ["9", "10", "11"],
        "dates": "15.09.2025 - 15.12.2025",
        "provider": "Тинькофф",
        "link": "https://www.tinkoff.ru/invest/education/"
    },
    {
        "id": 65,
        "name": "Современная физика для школьников",
        "subjects": ["Наука"],
        "difficulty": "Продвинутый",
        "grade": ["10", "11"],
        "dates": "01.10.2025 - 31.03.2026",
        "provider": "МФТИ",
        "link": "https://mipt.ru/online-courses/"
    },
    {
        "id": 66,
        "name": "Экспериментальная химия",
        "subjects": ["Наука"],
        "difficulty": "Средний",
        "grade": ["9", "10", "11"],
        "dates": "10.09.2025 - 20.12.2025",
        "provider": "МГУ им. Ломоносова",
        "link": "https://chemgood.ru/courses/"
    },
    {
        "id": 67,
        "name": "Биология будущего",
        "subjects": ["Наука"],
        "difficulty": "Средний",
        "grade": ["9", "10", "11"],
        "dates": "05.10.2025 - 25.01.2026",
        "provider": "Летово",
        "link": "https://biomolecula.ru/"
    },
    {
        "id": 68,
        "name": "Астрономия и космические технологии",
        "subjects": ["Наука"],
        "difficulty": "Начальный",
        "grade": ["8", "9", "10"],
        "dates": "01.11.2025 - 28.02.2026",
        "provider": "Сириус",
        "link": "https://www.planetarium-moscow.ru/about/about/"
    },
    {
        "id": 69,
        "name": "Веб-разработка для начинающих",
        "subjects": ["Программирование"],
        "difficulty": "Начальный",
        "grade": ["8", "9"],
        "dates": "15.08.2025 - 30.11.2025",
        "provider": "Яндекс",
        "link": "https://www.planetarium-moscow.ru/about/about/"
    },
    {
        "id": 70,
        "name": "Криптография и защита данных",
        "subjects": ["Кибербезопасность", "Программирование"],
        "difficulty": "Продвинутый",
        "grade": ["10", "11"],
        "dates": "20.09.2025 - 15.03.2026",
        "provider": "Высшая школа экономики",
        "link": "https://academy.kaspersky.ru/"
    },
    {
        "id": 71,
        "name": "Компьютерное зрение и распознавание образов",
        "subjects": ["Искусственный интеллект", "Программирование"],
        "difficulty": "Продвинутый",
        "grade": ["10", "11"],
        "dates": "01.02.2026 - 30.06.2026",
        "provider": "Сбер",
        "link": "https://neural-university.ru/"
    }
]


class CourseFilter:
    """Класс для фильтрации курсов"""

    @staticmethod
    def filter_courses(filters: Dict[str, Set]) -> List[Dict[str, Any]]:
        """
        Фильтрует курсы по заданным критериям

        Args:
            filters: Словарь с фильтрами пользователя

        Returns:
            Список отфильтрованных курсов
        """
        results = []

        for course in COURSES:
            # Проверяем предметы
            subjects_match = (
                    not filters.get("subjects") or
                    any(s in course["subjects"] for s in filters["subjects"])
            )

            # Проверяем сложность
            difficulty_match = (
                    not filters.get("difficulty") or
                    course["difficulty"] in filters["difficulty"]
            )

            # Проверяем класс
            grade_match = (
                    not filters.get("grade") or
                    any(g in course["grade"] for g in filters["grade"])
            )

            if subjects_match and difficulty_match and grade_match:
                results.append(course)

        return results

    @staticmethod
    def format_course_message(course: Dict[str, Any]) -> str:
        """
        Форматирует информацию о курсе для отправки пользователю

        Args:
            course: Словарь с данными курса

        Returns:
            Отформатированное сообщение
        """
        return (
            f"{course['name']}\n"
            f"Провайдер: {course['provider']}\n"
            f"{course['dates']}\n"
            f"Класс(-ы): {', '.join(course['grade'])}\n"
            f"Сложность: {course['difficulty']}\n"
            f"Описание: Описание недоступно.\n"
            f"{', '.join(course['subjects'])}"
        )
