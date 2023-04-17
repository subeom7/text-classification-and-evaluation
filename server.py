from flask import Flask, request, jsonify
from flask_cors import CORS
from flask.json import JSONEncoder
from bson import ObjectId
from classifier import text_clf, classify
from database import get_classification_history
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import certifi

load_dotenv()

MONGODB_URI = os.environ["MONGODB_URI"]

client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())
db = client.User_History


class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super(CustomJSONEncoder, self).default(obj)

app = Flask(__name__)
app.json_encoder = CustomJSONEncoder
CORS(app)

@app.route('/classify', methods=['POST'])
def classify_text():
    if request.method == 'POST':
        input_text = request.json['text']
        user_id = request.json.get('user_id', None)
        output_string, important_words, document_id = classify(input_text, user_id)

        return jsonify(result=output_string, words='\n'.join(important_words), document_id=document_id)

    
@app.route('/history/<user_id>', methods=['GET'])
def get_history(user_id):
    user_history = get_classification_history(user_id)
    print("User history:", user_history)
    return jsonify(user_history)

@app.route('/history/delete/<user_id>/<document_id>', methods=['DELETE'])
def delete_history(user_id, document_id):
    history_collection = db.User_History
    history_collection.delete_one({"user_id": user_id, "_id": ObjectId(document_id)})
    return jsonify({"message": "History deleted"})


@app.route('/history/clear/<user_id>', methods=['DELETE'])
def clear_history(user_id):
    history_collection = db.User_History
    history_collection.delete_many({"user_id": user_id})
    return jsonify({"message": "History cleared"})


if __name__ == '__main__':
    app.run(debug=True, port=5002)
