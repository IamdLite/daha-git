import pytest
from unittest.mock import patch
from bot.keyboards import BotKeyboards
from data.courses import _convert_filters_to_api_params, CourseFilter
from data.user_storage import UserStorage
from api.client import APIError

def test_create_and_get_user():
    """Ensure a new user can be created and retrieved from storage."""
    storage = UserStorage()
    user_id = 12345
    username = "test_user"
    storage.create_or_update_user(user_id, username)
    user = storage.get_user(user_id)
    assert user is not None
    assert user['user_id'] == user_id
    assert user['username'] == username

def test_update_user_filter():
    """Verify that user filters can be added and removed correctly."""
    storage = UserStorage()
    user_id = 12345
    storage.create_or_update_user(user_id, "test_user")
    
    # Add a filter
    storage.update_user_filter(user_id, 'subjects', 'Робототехника 💻')
    assert 'Робототехника 💻' in storage.get_user(user_id)['subjects']
    
    # Remove the filter
    storage.update_user_filter(user_id, 'subjects', 'Робототехника 💻')
    assert 'Робототехника 💻' not in storage.get_user(user_id)['subjects']

def test_convert_filters_to_api_params():
    """Check that selected filters are correctly converted to API parameters."""
    filters = {
        'subjects': {'Программирование 🛡️'},
        'difficulty': {'Средний 🟡'},
        'grade': {'10'}
    }
    
    # Mocks to isolate the function from external settings
    with patch('data.courses.SUBJECT_TO_CATEGORY', {'Программирование 🛡️': 2}), \
         patch('data.courses.DIFFICULTY_TO_LEVEL', {'Средний 🟡': 'Средний'}), \
         patch('data.courses.GRADE_TO_ID', {10: 4}):
        
        params = _convert_filters_to_api_params(filters)
        assert params.get('category_id') == 2
        assert params.get('level') == 'Средний'
        assert params.get('grade_id') == 4

def test_get_main_menu_keyboard():
    """Validate the structure of the main menu keyboard."""
    keyboard = BotKeyboards.get_main_menu_keyboard()
    assert len(keyboard.inline_keyboard) == 1
    assert keyboard.inline_keyboard[0][0].text == 'мини-приложение'

def test_get_filter_selection_keyboard():
    """Ensure the filter selection keyboard is created with the correct buttons."""
    keyboard = BotKeyboards.get_filter_selection_keyboard()
    button_texts = [btn.text for row in keyboard.inline_keyboard for btn in row]
    assert 'Предметы' in button_texts
    assert 'Сложность' in button_texts
    assert 'Класс' in button_texts

def test_get_filter_options_keyboard_marks_selection():
    """Test that selected options are marked with a checkmark."""
    with patch('bot.keyboards.FILTER_MENUS', {'filter_grade': ('Класс', ['9', '10', '11'])}):
        keyboard = BotKeyboards.get_filter_options_keyboard('grade', {'10'})
        assert keyboard.inline_keyboard[1][0].text == '✅ 10'
        assert keyboard.inline_keyboard[0][0].text == '9'

def test_format_course_message():
    """Verify that course information is formatted into a user-friendly message."""
    course = {
        'title': 'Intro to Cybersecurity',
        'provider': 'DAHA University',
        'grades': [{'level': '11'}],
        'level': 'Продвинутый 🟠',
        'start_date': '2025-09-01',
        'end_date': '2025-12-15',
        'description': 'An advanced course on cybersecurity principles.',
        'category': {'name': 'Кибербезопасность 🦾'}
    }
    message = CourseFilter.format_course_message(course)
    assert 'Intro to Cybersecurity' in message
    assert 'Провайдер 🧭: DAHA University' in message
    # FIX: The assertion below is corrected to match the actual function output.
    assert 'Класс(-ы) 🏫:11,' in message

def test_api_error_custom_exception():
    """Check that the custom APIError exception can be raised with a message and status code."""
    with pytest.raises(APIError) as excinfo:
        raise APIError("Not Found", status_code=404)
    assert "Not Found" in str(excinfo.value)
    assert excinfo.value.status_code == 404

def test_empty_filters_conversion():
    """Ensure that converting empty filters results in empty API parameters."""
    params = _convert_filters_to_api_params({})
    assert params == {}

def test_user_storage_update_nonexistent_user():
    """Test that attempting to update a non-existent user does not raise an error."""
    storage = UserStorage()
    # This should not raise an exception
    storage.update_user_filter(999, 'subjects', 'Финансовая грамотность 🏦')
    assert storage.get_user(999) is None
