from pymongo import MongoClient, ASCENDING
from dotenv import load_dotenv
from bson.objectid import ObjectId
import os
import certifi


load_dotenv()

MONGODB_URI = os.environ["MONGODB_URI"]

client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())
db = client.User_History

# create index
db.User_History.create_index([("user_id", ASCENDING)])

def save_classification_history(user_id, input_text, classifier_result, important_words, user_result, user_highlight):
    history_collection = db.User_History
    history_record = {
        "user_id": user_id,
        "input_text": input_text,
        "classifier_result": classifier_result,
        "important_words": important_words,
        "user_result": user_result,
        "user_highlight": user_highlight
    }
    result = history_collection.insert_one(history_record)
    return result.inserted_id

def get_classification_history(user_id):
    history_collection = db.User_History
    return list(history_collection.find({"user_id": user_id}))

def update_classification_history(document_id, user_result, user_highlight):
    history_collection = db.User_History
    history_collection.update_one(
        {"_id": ObjectId(document_id)},
        {"$set": {"user_result": user_result, "user_highlight": user_highlight}}
    )
    
def delete_classification_history(user_id, document_id):
    history_collection = db.User_History
    history_collection.delete_one({"user_id": user_id, "_id": ObjectId(document_id)})


def clear_classification_history(user_id):
    history_collection = db.User_History
    history_collection.delete_many({"user_id": user_id})

