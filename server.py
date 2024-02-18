from flask import Flask, request, jsonify, render_template, send_from_directory, abort
from flask_cors import CORS
from flask.json import JSONEncoder
from bson import ObjectId
import jwt
import os
import certifi
from classifier import text_clf, classify, save_database
from database import get_classification_history, update_classification_history
from pymongo import MongoClient
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

MONGODB_URI = os.environ["MONGODB_URI"]
SECRET_KEY = os.environ["SECRET_KEY"]

client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())
db = client.User_History

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super(CustomJSONEncoder, self).default(obj)

app = Flask(__name__, template_folder="client/build", static_folder="client/build/static")
app.json_encoder = CustomJSONEncoder
CORS(app)

# Decorator that verifies JWT Token
def token_required(f):
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        try:
            # remove "Bearer " part from the Bearer Token
            if token.startswith('Bearer '):
                token = token[7:]  # Only extract string following "Bearer "
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except Exception as e:
            return jsonify({'message': 'Token is invalid or expired!', 'error': str(e)}), 403
        return f(*args, **kwargs)
    return decorated

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.template_folder + "/" + path):
        return send_from_directory(app.template_folder, path)
    else:
        return send_from_directory(app.template_folder, "index.html")

@app.route('/classify', methods=['POST'])
@token_required
def classify_text():
    if request.method == 'POST':
        input_text = request.json['text']
        user_result = request.json.get('user_result')
        user_highlight = request.json.get('user_highlight')
        user_id = request.json.get('user_id', None)
        output_string, important_words, document_id = classify(input_text, user_id, user_result, user_highlight) 

        return jsonify(result=output_string, words='\n'.join(important_words), document_id=document_id)
    
@app.route('/database', methods=['POST'], endpoint='database_post')
@token_required
def save_to_database():
    if request.method == 'POST':
        input_text = request.json['text']
        user_result = request.json.get('user_result')
        user_highlight = request.json.get('user_highlight')
        user_id = request.json.get('user_id', None)
        output_string, important_words, document_id = save_database(input_text, user_id, user_result, user_highlight) 

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

@app.route('/history/update/<user_id>/<document_id>', methods=['PUT'])
def update_history(user_id, document_id):
    user_result = request.json.get('user_result')
    user_highlight = request.json.get('user_highlight')
    update_classification_history(document_id, user_result, user_highlight)
    return jsonify({"message": "History updated"})

if __name__ == '__main__':
    app.run(debug=True, port=5002)
