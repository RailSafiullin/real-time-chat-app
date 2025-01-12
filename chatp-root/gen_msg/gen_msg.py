import datetime
import pymongo
import random


def date_range_iterator(start_date, end_date):
    current_date = start_date
    repeat = 5
    i = 0
    while current_date <= end_date:
        yield current_date
        i+=1
        if i%repeat==0:
            current_date += datetime.timedelta(days=1)

def generate_messages(messages_list, user_ids): #, msg_count):
    id_counter = 0
    id_counter_start = 2000
    user_index = 0
    start_date = datetime.date(2022, 4, 1)  # Set start date to 2020-01-01
    end_date = datetime.date.today()  # Get today's date
    date_iterator = date_range_iterator(start_date, end_date)

    while True:
    #for i in range(msg_count):
        #message_text = messages_list[random.randint(0, len(messages_list) - 1)]
        message_text = messages_list[id_counter]
        created_at = next(date_iterator).isoformat()
        yield {
            "id": str(id_counter+id_counter_start),
            "message": message_text,
            "created_by": user_ids[user_index],
            "created_at": datetime.datetime.fromisoformat(created_at)
        }
        id_counter+=1
        user_index = (user_index + 1) % len(user_ids)

# Пример использования
from messages_list import messages_list
user_ids = ["e08eea84ca4b49a48f2dea71d5c54a48", "9bbecbe96a6646c3b8f4becae9acd965"]
message_generator = generate_messages(messages_list, user_ids)

#for i in range(10):
#    message = next(message_generator)
#    print(message)
messages = []
for i in range(len(messages_list)):
    messages.append(next(message_generator))
#print(generate_messages(messages_list, user_ids, 5))
print(len(messages))


from bson import ObjectId

fl_bd_update = True
#fl_bd_update = False

if fl_bd_update:
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["chat_app"]
    collection = db["PrivateChat"]

    update_result = collection.update_one(
        {"_id": ObjectId("6638aeba8d14a60c7b35a036")},
        {"$push": {"messages": {"$each": messages}}}
    )

    print(f"Обновлено документов: {update_result.modified_count}")
    document = collection.find_one({"_id": ObjectId("6638aeba8d14a60c7b35a036")})

    messages_count = len(document["messages"])

    # Печать результата
    print(f"Количество messages: {messages_count}")