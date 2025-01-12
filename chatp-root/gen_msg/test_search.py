from fastapi import FastAPI, Request, Form
from pymongo import MongoClient
from jinja2 import Environment, Template

app = FastAPI()

# Подключение к MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['chat_app']
collection = db['PrivateChat']

# Функция для поиска, фильтрации и сортировки сообщений
def get_filtered_messages(search_text, user_id, sort_by):
    query = {}

    if search_text:
        query['message'] = {'$regex': search_text, '$options': 'i'}

    if user_id:
        query['created_by'] = user_id

    sort_order = 1 if sort_by == 'created_at' else -1

    messages = collection.find(query).sort([(sort_by, sort_order)])
    return messages

# HTML-шаблон формы поиска
search_form_template = """
<head>
    <meta charset="UTF-8">
    <title>Поиск сообщений</title>
</head>
<body>
    <h1>Поиск сообщений</h1>

    <form action="/search" method="post">
        <label for="search_text">Текст поиска:</label>
        <input type="text" id="search_text" name="search_text">

        <label for="user_id">Автор:</label>
        <select id="user_id" name="user_id">
            <option value="">Все</option>
            {% for user_id in users %}
                <option value="{{ user_id }}">{{ user_id }}</option>
            {% endfor %}
        </select>

        <label for="sort_by">Сортировать по:</label>
        <select id="sort_by" name="sort_by">
            <option value="created_at">Дате создания</option>
            <option value="author">Автору</option>
            <option value="text">Тексту</option>
        </select>

        <button type="submit">Найти</button>
    </form>
</body>
</html>
"""

# HTML-шаблон результатов поиска
search_result_template = """
<head>
    <meta charset="UTF-8">
    <title>Результаты поиска</title>
</head>
<body>
    <h1>Результаты поиска</h1>

    {% if messages %}
        <table>
            <tr>
                <th>ID</th>
                <th>Сообщение</th>
                <th>Автор</th>
                <th>Дата создания</th>
            </tr>
            {% for message in messages %}
                <tr>
                    <td>{{ message.id }}</td>
                    <td>{{ message.message }}</td>
                    <td>{{ message.created_by }}</td>
                    <td>{{ message.created_at }}</td>
                </tr>
            {% endfor %}
        </table>
    {% else %}
        <p>Сообщений не найдено.</p>
    {% endif %}
</body>
</html>
"""

# Функция для загрузки шаблона по его имени
def get_template(template_name):
    template = Environment().from_string(template_name)
    return template

# HTML-страница с формой
@app.get('/search')
def search_form():
    users = collection.distinct('created_by')
    template = get_template(search_form_template)  # Загрузка шаблона
    context = {'users': users}  # Создание контекста для шаблона
    return template.render(context)  # Рендеринг шаблона с контекстом

# Обработка запроса из формы и отображение результата
@app.post('/search')
async def search_messages(request: Request, search_text: str = Form(), user_id: str = Form(), sort_by: str = Form()):
    messages = get_filtered_messages(search_text, user_id, sort_by)
    template = get_template(search_result_template)  # Загрузка шаблона
    context = {'messages': messages}  # Создание контекста для html шаблона
    return template.render(context)  # Рендеринг html шаблона с контекстом

