import datetime
import pymongo
import random
from datetime import datetime, timedelta

def date_range_iterator(start_date, end_date):
    current_date = start_date
    repeat = 660
    i = 0
    while current_date <= end_date:
        i+=1
        #current_date += timedelta(hours=1)#i%24)
        current_date += timedelta(minutes=2)#i%60)
        if i%repeat==0:
            current_date += timedelta(days=1)
        #yield current_date
        #print(current_date)
        if current_date <= end_date:
            yield current_date
            
start_date = datetime.fromisoformat("2021-06-01T01:01:00.086000")
#end_date = datetime.fromisoformat("2024-01-01T01:01:00.086000")  # Get today's date
start_date = datetime(year=2000, month=1, day=1, hour=0,minute=0, second=0, microsecond=0)
end_date = datetime(year=2024, month=1, day=1, hour=0,minute=0, second=0, microsecond=0)
date_iterator = date_range_iterator(start_date, end_date)

def generate_messages(path, user_ids): #, msg_count):
    #id_counter = 0
    #id_counter_start = 54000
    user_index = 0
    
    #path = r"D:\Mind\master\new_master\dataset\extract_flibusta_dialogues.1.txt"
    
    messages_file = open(path, 'r', encoding="utf-8")

    global date_iterator

    while True:
    #for i in range(msg_count):
        message_text = messages_file.readline()
        while message_text=='\n': 
            message_text = messages_file.readline()

        created_at = next(date_iterator).isoformat()
        #print(created_at)
        yield {
            #"id": str(id_counter+id_counter_start),
            "chat_id": '94993bceecd04a509e4687c883fdc726',
            "message": message_text.replace('\n',''),
            "created_by": user_ids[user_index],
            "created_at": datetime.fromisoformat(created_at) #created_at #
        }
        #id_counter+=1
        user_index = (user_index + 1) % len(user_ids)

# Пример использования

user_ids = ["9554c3bf667247c9a0b4fcd3c930ba82", "c3e84d2107bc48dbb9e5068854cc297a"]

from bson import ObjectId
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["chat_app"]
collection = db["Message"]

i_c = 1000
j_c = 100
file_count = 40

#path = None
for file_number in range(file_count): 
    path = r"msg_pack\messages"+str(file_number)+".txt"
    message_generator = generate_messages(path, user_ids)
    print(file_number)
    for i in range(i_c):
        #print(i)
        messages=[]
        for j in range(j_c):
            message = next(message_generator)
            messages.append(message)  
            #print(message)
        collection.insert_many(messages)
        #update_result = collection.update_one(
        #    {"_id": ObjectId(str(i*100+j))},
        #    {"$push": {"messages": {"$each": messages}}}
        #)
        

    
#print(f"Обновлено документов: {update_result.modified_count}")
#document = collection.find_one({"_id": ObjectId("6638aeba8d14a60c7b35a036")})
#messages_count = len(document["messages"])
#print(f"Количество messages: {messages_count}")