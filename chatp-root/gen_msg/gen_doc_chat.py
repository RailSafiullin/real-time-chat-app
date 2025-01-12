import datetime
import pymongo
import random
# ///////////////////
def generate_mongodb_document(messages):
    """
    Генерирует документ MongoDB из массива сообщений.

    Args:
        messages (list): Список сообщений, где каждый элемент - словарь с полями:
            id: Уникальный идентификатор сообщения
            message: Текст сообщения
            created_by: ID пользователя, отправившего сообщение
            created_at: Дата и время отправки сообщения

    Returns:
        dict: Документ MongoDB с полями:
            _id: ObjectId
            chat_id: ID чата
            member_ids: Список ID участников чата
            messages: Список сообщений
            type: Тип чата (private)
    """

    chat_id = "e3c9652868424faabc5ded70b6bfb68a"
    member_ids = ["e08eea84ca4b49a48f2dea71d5c54a48", "9bbecbe96a6646c3b8f4becae9acd965"]
    document_id ="6638aeba8d14a60c7b35a036"
    mongodb_document = {
        #"_id": {"$oid": str(pymongo.ObjectId())},
        "_id": {"$oid": document_id},
        "chat_id": chat_id,
        "member_ids": member_ids,
        "messages": [],
        "type": "private"
    }

    for message in messages:
        mongodb_document["messages"].append({
            "id": message["id"],
            "message": message["message"],
            "created_by": message["created_by"],
            "created_at": {
                "$date": datetime.datetime.fromisoformat(message["created_at"]).isoformat()
            }
        })

    return mongodb_document
# Пример использования
messages = [
    {
        "id": "1",
        "message": "Привет! Как дела?",
        "created_by": "e08eea84ca4b49a48f2dea71d5c54a48",
        "created_at": "2024-05-07T13:45:00.000Z"
    },
    {
        "id": "2",
        "message": "Привет! У меня все хорошо, спасибо. А как у тебя дела?",
        "created_by": "9bbecbe96a6646c3b8f4becae9acd965",
        "created_at": "2024-05-07T13:45:30.000Z"
    },
    # ... больше сообщений
]

mongodb_document = generate_mongodb_document(messages)
print(mongodb_document)
'''