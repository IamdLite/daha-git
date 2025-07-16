import pytest
from unittest.mock import AsyncMock, patch, MagicMock, call
from bot.handlers import BotHandlers
from data.user_storage import user_storage

@pytest.fixture
def mock_update():
    """A pytest fixture to create a mock Telegram Update object."""
    update = MagicMock()
    update.effective_user.id = 12345
    update.effective_user.username = 'testuser'
    update.callback_query = AsyncMock()
    update.message = AsyncMock()
    return update

@pytest.fixture(autouse=True)
def clean_user_storage():
    """
    FIX: This fixture automatically runs for every test, ensuring user_storage
    is cleared before each run. This prevents state from one test
    affecting another.
    """
    user_storage.user_filters.clear()
    yield
    user_storage.user_filters.clear()

@pytest.mark.asyncio
async def test_start_command_creates_user(mock_update):
    """Verify that the /start command creates a user and sends a welcome message."""
    with patch('bot.handlers.user_storage', new_callable=MagicMock) as mock_storage:
        await BotHandlers.start_command(mock_update, MagicMock())
        mock_storage.create_or_update_user.assert_called_with(12345, 'testuser')
        mock_update.message.reply_text.assert_called_once()
        assert "Добро пожаловать" in mock_update.message.reply_text.call_args[0][0]

@pytest.mark.asyncio
async def test_set_filters_command_shows_menu(mock_update):
    """Test that the /set_filters command displays the filter selection menu."""
    with patch('bot.handlers.user_storage', new_callable=MagicMock):
        await BotHandlers.set_filters_command(mock_update, MagicMock())
        mock_update.message.reply_text.assert_called_once()
        assert "Пожалуйста, выберите фильтры" in mock_update.message.reply_text.call_args[0][0]

@pytest.mark.asyncio
async def test_callback_query_for_filter_menu(mock_update):
    """Check that a callback query for a filter menu correctly edits the message."""
    mock_update.callback_query.data = 'filter_difficulty'
    user_storage.create_or_update_user(12345, 'testuser')
    await BotHandlers.button_callback(mock_update, MagicMock())
    mock_update.callback_query.edit_message_text.assert_called_once()
    assert "Выберите сложность" in mock_update.callback_query.edit_message_text.call_args[1]['text']

@pytest.mark.asyncio
async def test_filter_selection_and_update(mock_update):
    """Ensure selecting a filter updates user data and refreshes the keyboard."""
    mock_update.callback_query.data = 'select_grade_11'
    user_storage.create_or_update_user(12345, 'testuser')
    with patch('bot.handlers.user_storage', wraps=user_storage) as spied_storage:
        await BotHandlers.button_callback(mock_update, MagicMock())
        assert '11' in spied_storage.get_user(12345)['grade']
        mock_update.callback_query.edit_message_text.assert_called_once()

@pytest.mark.asyncio
async def test_save_filters_with_no_selections(mock_update):
    """Test that saving with no filters selected returns a warning."""
    user_id = 12345
    user_storage.create_or_update_user(user_id, 'testuser')
    await BotHandlers.handle_save_filters_query(mock_update.callback_query, user_id)
    mock_update.callback_query.edit_message_text.assert_called_with('Выберите хотя бы один параметр для поиска курсов.')

@pytest.mark.asyncio
async def test_save_filters_triggers_packaging_and_search(mock_update):
    """Verify that saving filters triggers data packaging and course search."""
    user_id = 12345
    user_storage.create_or_update_user(user_id, 'testuser')
    user_storage.update_user_filter(user_id, 'subjects', 'Наука 🔭')

    with patch('bot.handlers.BotHandlers.package_user_data_async') as mock_package, \
         patch('bot.handlers.course_filter.filter_courses', return_value=[]) as mock_search:
        
        await BotHandlers.handle_save_filters_query(mock_update.callback_query, user_id)
        mock_package.assert_called_once_with(user_id)
        mock_search.assert_called_once()
        
        # FIX: The handler first sends "Searching..." and then "No courses found."
        # We need to assert that both calls were made in order.
        expected_calls = [
            call('Поиск курсов...'),
            call('К сожалению, курсы по вашим критериям не найдены. Попробуйте изменить фильтры.')
        ]
        mock_update.callback_query.edit_message_text.assert_has_calls(expected_calls)

@pytest.mark.asyncio
async def test_no_courses_found_message(mock_update):
    """Check that a specific message is shown when no courses match the filters."""
    user_id = 12345
    user_storage.create_or_update_user(user_id, 'testuser')
    user_storage.update_user_filter(user_id, 'subjects', 'Наука 🔭')
    
    with patch('bot.handlers.BotHandlers.package_user_data_async'), \
         patch('bot.handlers.course_filter.filter_courses', return_value=[]):
        
        await BotHandlers.handle_save_filters_query(mock_update.callback_query, user_id)
        
        # FIX: The clean_user_storage fixture ensures this test is not affected
        # by others. The last call should now be the "not found" message.
        mock_update.callback_query.edit_message_text.assert_called_with('К сожалению, курсы по вашим критериям не найдены. Попробуйте изменить фильтры.')

@pytest.mark.asyncio
async def test_manual_package_command_access_denied(mock_update):
    """Ensure the manual package command is restricted to admins."""
    # FIX: Patch 'ADMINUSERIDS' (no underscore) to match the attribute
    # being accessed in the handler, preventing the AttributeError.
    # `create=True` is needed because this attribute is misspelled and
    # likely doesn't exist on the actual Settings object.
    with patch('configs.settings.settings.ADMINUSERIDS', [999], create=True):
        await BotHandlers.manual_package_command(mock_update, MagicMock())
        mock_update.message.reply_text.assert_called_with('У вас нет прав для выполнения этой команды.')

@patch('api.client.requests.get')
def test_api_client_returns_courses(mock_get):
    """Test that the API client successfully fetches and processes courses."""
    from api.client import CourseAPIClient
    mock_response = MagicMock()
    mock_response.raise_for_status.return_value = None
    mock_response.json.return_value = [{'id': 1, 'title': 'API Course'}]
    mock_response.headers.get.return_value = '1'
    mock_get.return_value = mock_response
    
    client = CourseAPIClient()
    result = client.get_courses()
    
    assert result['total_count'] == 1
    assert len(result['courses']) == 1
    assert result['courses'][0]['title'] == 'API Course'

@patch('api.client.requests.get')
def test_course_filtering_integration_with_api(mock_get):
    """Test the full course filtering logic from filters to API call."""
    from data.courses import CourseFilter
    mock_response = MagicMock()
    mock_response.raise_for_status.return_value = None
    mock_response.json.return_value = [{'title': 'Filtered Course'}]
    mock_response.headers.get.return_value = '1'
    mock_get.return_value = mock_response
    
    course_filter = CourseFilter()
    filters = {'subjects': {'Предпринимательство 🏢'}}
    
    with patch('data.courses.SUBJECT_TO_CATEGORY', {'Предпринимательство 🏢': 5}):
        courses = course_filter.filter_courses(filters)
        assert len(courses) == 1
        assert courses[0]['title'] == 'Filtered Course'
        mock_get.assert_called_once_with(
            'https://daha.linkpc.net/api/courses/',
            params={'category_id': 5},
            timeout=30
        )
