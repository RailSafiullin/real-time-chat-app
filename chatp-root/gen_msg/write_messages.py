import datetime
import pymongo
import random


def date_range_iterator(start_date, end_date):
    current_date = start_date
    repeat = 150
    i = 0
    while current_date <= end_date:
        yield current_date
        i+=1
        current_date += datetime.timedelta(hours=(i//60)%24)
        current_date += datetime.timedelta(minutes=i%60)
        if i%repeat==0:
            current_date += datetime.timedelta(days=1)

def generate_messages(user_ids): #, msg_count):
    path = r"D:\Mind\master\new_master\dataset\extract_flibusta_dialogues.1.txt"
    messages_file = open(path, 'r', encoding="utf-8")
    
    while True:
    #for i in range(msg_count):
        message_text = messages_file.readline()
        while message_text=='\n': 
            message_text = messages_file.readline()
        yield message_text
        


# Пример использования

user_ids = ["e08eea84ca4b49a48f2dea71d5c54a48", "9bbecbe96a6646c3b8f4becae9acd965"]
message_generator = generate_messages(user_ids)
from bson import ObjectId
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["chat_app"]
collection = db["PrivateChat"]
for k in range(50):
    print("-----------k--------------")
    print(k)
    print("-----------i--------------")
    with open(r"msg_pack\messages"+str(k)+".txt", "w", encoding="utf-8") as messages_file:
        for i in range(100):
            print(i)
            messages=[]
            for j in range(1000):
                message = next(message_generator)
                messages_file.write(message)

    
