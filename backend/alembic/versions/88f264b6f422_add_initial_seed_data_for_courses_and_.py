"""Add initial seed data for courses and categories

Revision ID: 88f264b6f422
Revises: b069d274d7fd
Create Date: 2025-07-03 20:23:39.809898

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer, Text, Date, Enum


# revision identifiers, used by Alembic.
revision: str = '88f264b6f422'
down_revision: Union[str, Sequence[str], None] = 'b069d274d7fd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    category_table = table('category',
        column('id', Integer),
        column('name', String)
    )

    grade_table = table('grade',
        column('id', Integer),
        column('level', Integer)
    )

    course_table = table('course',
        column('id', Integer),
        column('title', String),
        column('description', Text),
        column('url', String),
        column('provider', String),
        column('level', Enum('BEGINNER', 'INTERMEDIATE', 'ADVANCED', name='courselevel')),
        column('category_id', Integer),
        column('start_date', Date),
        column('end_date', Date)
    )

    course_grade_link_table = table('coursegradelink',
        column('course_id', Integer),
        column('grade_id', Integer)
    )

    # ### Seed Categories ###
    op.bulk_insert(category_table,
        [
            {'id': 1, 'name': 'Искусственный интеллект'},
            {'id': 2, 'name': 'Программирование'},
            {'id': 3, 'name': 'Информационная безопасность'},
            {'id': 4, 'name': 'Робототехника'},
            {'id': 5, 'name': 'Предпринимательство'},
            {'id': 6, 'name': 'Финансовая грамотность'},
            {'id': 7, 'name': 'Наука'},
        ]
    )

    # ### Seed Grades ###
    op.bulk_insert(grade_table,
        [
            {'id': 1, 'level': 7},
            {'id': 2, 'level': 8},
            {'id': 3, 'level': 9},
            {'id': 4, 'level': 10},
            {'id': 5, 'level': 11},
        ]
    )

    # ### Seed Courses ###
    op.bulk_insert(course_table,
        [
            {'id': 52, 'title': 'Основы машинного обучения и нейронных сетей', 'description': 'Ведут специалисты из Яндекса с реальными кейсами из индустрии. Слушатели осваивают практические навыки построения нейронных сетей и работы с большими данными. Курс включает работу с реальными проектами и актуальными инструментами искусственного интеллекта.', 'url': 'https://practicum.yandex.ru/', 'provider': 'Яндекс', 'level': 'BEGINNER', 'category_id': 1, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
            {'id': 55, 'title': 'Python для искусственного интеллекта', 'description': 'Поможет подготовиться к участию в олимпиадах по программированию. Слушатели осваивают практические навыки построения нейронных сетей и работы с большими данными. Курс включает работу с реальными проектами и актуальными инструментами искусственного интеллекта.', 'url': 'https://stepik.org/', 'provider': 'Сириус', 'level': 'BEGINNER', 'category_id': 2, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
            {'id': 56, 'title': 'Робототехника для начинающих', 'description': 'Включает практические занятия со сборкой реальных роботов. Участники создадут собственные роботизированные системы с применением современных технологий. Программа включает проектирование, сборку и программирование автономных устройств.', 'url': 'https://robbo.ru/', 'provider': 'Иннополис', 'level': 'BEGINNER', 'category_id': 4, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
            {'id': 57, 'title': 'Программирование микроконтроллеров Arduino', 'description': 'После курса сможешь создавать собственные устройства умного дома. Участники создадут собственные роботизированные системы с применением современных технологий. Программа включает проектирование, сборку и программирование автономных устройств.', 'url': 'https://amperka.ru/', 'provider': 'Сколтех', 'level': 'BEGINNER', 'category_id': 4, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
            {'id': 58, 'title': 'Разработка игр на Unity', 'description': 'Возможность добавить проекты в портфолио для будущих работодателей. Обучение строится на решении практических задач с постепенным повышением сложности. Участники научатся писать оптимальный и читаемый код, работая над реальными проектами.', 'url': 'https://unity.com/learn', 'provider': 'VK', 'level': 'INTERMEDIATE', 'category_id': 2, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
            {'id': 59, 'title': 'Основы кибербезопасности', 'description': 'Преподают действующие эксперты по информационной безопасности. Изучаются методы защиты информации и противодействия современным киберугрозам. Курс дает практические навыки обнаружения уязвимостей и построения защищенных систем.', 'url': 'https://securitytrainings.ru/', 'provider': 'СберКибер', 'level': 'BEGINNER', 'category_id': 3, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
            {'id': 60, 'title': 'Этичный хакинг и тестирование на проникновение', 'description': 'Помогает развить аналитическое мышление и внимание к деталям. Изучаются методы защиты информации и противодействия современным киберугрозам. Курс дает практические навыки обнаружения уязвимостей и построения защищенных систем.', 'url': 'https://skillbox.ru/', 'provider': 'Лаборатория Касперского', 'level': 'ADVANCED', 'category_id': 3, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
            {'id': 61, 'title': 'Предпринимательство для школьников', 'description': 'Возможность запустить свой первый бизнес-проект под наставничеством. Слушатели разработают собственный бизнес-план и изучат стратегии привлечения инвестиций. В программу включены мастер-классы от успешных предпринимателей и венчурных инвесторов.', 'url': 'https://business-youth.ru/', 'provider': 'Высшая школа экономики', 'level': 'ADVANCED', 'category_id': 5, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
            {'id': 62, 'title': 'От идеи до стартапа', 'description': 'Шанс получить финансирование от инвесторов для лучших проектов. Слушатели разработают собственный бизнес-план и изучат стратегии привлечения инвестиций. В программу включены мастер-классы от успешных предпринимателей и венчурных инвесторов.', 'url': 'https://practicumglobal.ru/', 'provider': 'Сколково', 'level': 'INTERMEDIATE', 'category_id': 5, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
            {'id': 63, 'title': 'Личные финансы для подростков', 'description': 'Научит грамотно управлять своим бюджетом и планировать накопления. Участники научатся эффективно управлять личными финансами и создавать пассивный доход. Курс включает разбор реальных инвестиционных стратегий и финансовых инструментов.', 'url': 'https://fincult.info/', 'provider': 'Центральный банк РФ', 'level': 'BEGINNER', 'category_id': 6, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
            {'id': 64, 'title': 'Инвестирование для начинающих', 'description': 'Практические навыки работы с биржевыми инструментами на учебном счете. Участники научатся эффективно управлять личными финансами и создавать пассивный доход. Курс включает разбор реальных инвестиционных стратегий и финансовых инструментов.', 'url': 'https://www.tinkoff.ru/invest/education/', 'provider': 'Тинькофф', 'level': 'INTERMEDIATE', 'category_id': 6, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
            {'id': 65, 'title': 'Современная физика для школьников', 'description': 'Поможет подготовиться к олимпиадам и поступлению в технические вузы. Программа сочетает теоретическую подготовку с практическими экспериментами и исследованиями. Участники работают с современным научным оборудованием под руководством ученых-практиков.', 'url': 'https://mipt.ru/online-courses/', 'provider': 'МФТИ', 'level': 'ADVANCED', 'category_id': 7, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
            {'id': 66, 'title': 'Экспериментальная химия', 'description': 'Доступ к лабораториям с современным оборудованием. Программа сочетает теоретическую подготовку с практическими экспериментами и исследованиями. Участники работают с современным научным оборудованием под руководством ученых-практиков.', 'url': 'https://chemgood.ru/courses/', 'provider': 'МГУ им. Ломоносова', 'level': 'INTERMEDIATE', 'category_id': 7, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
            {'id': 67, 'title': 'Биология будущего', 'description': 'Включает экскурсии в исследовательские центры и работу с учеными. Программа сочетает теоретическую подготовку с практическими экспериментами и исследованиями. Участники работают с современным научным оборудованием под руководством ученых-практиков.', 'url': 'https://biomolecula.ru/', 'provider': 'Летово', 'level': 'INTERMEDIATE', 'category_id': 7, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
            {'id': 68, 'title': 'Астрономия и космические технологии', 'description': 'Возможность наблюдать за небесными телами через профессиональные телескопы. Программа сочетает теоретическую подготовку с практическими экспериментами и исследованиями. Участники работают с современным научным оборудованием под руководством ученых-практиков.', 'url': 'https://www.planetarium-moscow.ru/about/about/', 'provider': 'Сириус', 'level': 'BEGINNER', 'category_id': 7, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
            {'id': 69, 'title': 'Веб-разработка для начинающих', 'description': 'Сертификат признается IT-компаниями при приеме на стажировку. Обучение строится на решении практических задач с постепенным повышением сложности. Участники научатся писать оптимальный и читаемый код, работая над реальными проектами.', 'url': 'https://www.planetarium-moscow.ru/about/about/', 'provider': 'Яндекс', 'level': 'BEGINNER', 'category_id': 2, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
            {'id': 70, 'title': 'Криптография и защита данных', 'description': 'Разработан совместно с лабораторией Касперского. Изучаются методы защиты информации и противодействия современным киберугрозам. Курс дает практические навыки обнаружения уязвимостей и построения защищенных систем.', 'url': 'https://academy.kaspersky.ru/', 'provider': 'Высшая школа экономики', 'level': 'ADVANCED', 'category_id': 3, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
            {'id': 71, 'title': 'Компьютерное зрение и распознавание образов', 'description': 'Занятия проходят на оборудовании, используемом в реальных проектах. Слушатели осваивают практические навыки построения нейронных сетей и работы с большими данными. Курс включает работу с реальными проектами и актуальными инструментами искусственного интеллекта.', 'url': 'https://neural-university.ru/', 'provider': 'Сбер', 'level': 'ADVANCED', 'category_id': 1, 'start_date': '2025-09-15', 'end_date': '2026-01-20'},
        ]
    )

    # ### Seed Course-Grade Links ###
    op.bulk_insert(course_grade_link_table,
        [
            {'course_id': 52, 'grade_id': 3}, {'course_id': 52, 'grade_id': 4},
            {'course_id': 55, 'grade_id': 3}, {'course_id': 55, 'grade_id': 4}, {'course_id': 55, 'grade_id': 5},
            {'course_id': 56, 'grade_id': 1}, {'course_id': 56, 'grade_id': 2}, {'course_id': 56, 'grade_id': 3},
            {'course_id': 57, 'grade_id': 2}, {'course_id': 57, 'grade_id': 3}, {'course_id': 57, 'grade_id': 4},
            {'course_id': 58, 'grade_id': 2}, {'course_id': 58, 'grade_id': 3}, {'course_id': 58, 'grade_id': 4}, {'course_id': 58, 'grade_id': 5},
            {'course_id': 59, 'grade_id': 3}, {'course_id': 59, 'grade_id': 4}, {'course_id': 59, 'grade_id': 5},
            {'course_id': 60, 'grade_id': 4}, {'course_id': 60, 'grade_id': 5},
            {'course_id': 61, 'grade_id': 2}, {'course_id': 61, 'grade_id': 3}, {'course_id': 61, 'grade_id': 4}, {'course_id': 61, 'grade_id': 5},
            {'course_id': 62, 'grade_id': 3}, {'course_id': 62, 'grade_id': 4}, {'course_id': 62, 'grade_id': 5},
            {'course_id': 63, 'grade_id': 1}, {'course_id': 63, 'grade_id': 2}, {'course_id': 63, 'grade_id': 3}, {'course_id': 63, 'grade_id': 4}, {'course_id': 63, 'grade_id': 5},
            {'course_id': 64, 'grade_id': 4}, {'course_id': 64, 'grade_id': 5},
            {'course_id': 65, 'grade_id': 3}, {'course_id': 65, 'grade_id': 4}, {'course_id': 65, 'grade_id': 5},
            {'course_id': 66, 'grade_id': 2}, {'course_id': 66, 'grade_id': 3}, {'course_id': 66, 'grade_id': 4}, {'course_id': 66, 'grade_id': 5},
            {'course_id': 67, 'grade_id': 3}, {'course_id': 67, 'grade_id': 4}, {'course_id': 67, 'grade_id': 5},
            {'course_id': 68, 'grade_id': 1}, {'course_id': 68, 'grade_id': 2}, {'course_id': 68, 'grade_id': 3}, {'course_id': 68, 'grade_id': 4}, {'course_id': 68, 'grade_id': 5},
            {'course_id': 69, 'grade_id': 2}, {'course_id': 69, 'grade_id': 3}, {'course_id': 69, 'grade_id': 4}, {'course_id': 69, 'grade_id': 5},
            {'course_id': 70, 'grade_id': 4}, {'course_id': 70, 'grade_id': 5},
            {'course_id': 71, 'grade_id': 4}, {'course_id': 71, 'grade_id': 5},
        ]
    )

def downgrade() -> None:
    op.execute("DELETE FROM coursegradelink")
    op.execute("DELETE FROM course")
    op.execute("DELETE FROM grade")
    op.execute("DELETE FROM category")
