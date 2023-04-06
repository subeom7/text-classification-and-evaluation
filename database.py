from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.environ["MONGODB_URI"]

client = MongoClient(MONGODB_URI)
db = client.User_History

def save_classification_history(user_id, input_text, output):
    history_collection = db.User_History
    history_collection.create_index("user_id")
    history_record = {
        "user_id": user_id,
        "input_text": input_text,
        "output": output
    }
    history_collection.insert_one(history_record)

def get_classification_history(user_id):
    history_collection = db.User_History
    return list(history_collection.find({"user_id": user_id}))
