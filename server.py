from flask import Flask, request, jsonify, render_template, send_from_directory, abort
from flask_cors import CORS
from flask.json import JSONEncoder
from bson import ObjectId
from jwt import PyJWKClient, decode
import jwt
import requests
import os
import certifi
from classifier import text_clf, classify, save_database
from database import get_classification_history, update_classification_history, delete_classification_history, clear_classification_history
from pymongo import MongoClient
from dotenv import load_dotenv

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
# def token_required(f):
#     def decorated(*args, **kwargs):
#         token = request.headers.get('Authorization')
#         if not token:
#             return jsonify({'message': 'Token is missing!'}), 403
#         try:
#             # remove "Bearer " part from the Bearer Token
#             if token.startswith('Bearer '):
#                 token = token[7:]  # Only extract string following "Bearer "
#             jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
#         except Exception as e:
#             return jsonify({'message': 'Token is invalid or expired!', 'error': str(e)}), 403
#         return f(*args, **kwargs)
#     return decorated

@app.route('/verifyToken', methods=['POST'])
def verify_token():
    token = request.json.get('token')
    GOOGLE_DISCOVERY_URL = ('https://accounts.google.com/.well-known/openid-configuration')
    jwks_uri = requests.get(GOOGLE_DISCOVERY_URL).json().get('jwks_uri')
    
    jwk_client = PyJWKClient(jwks_uri)
    signing_key = jwk_client.get_signing_key_from_jwt(token)

    try:
        decoded_token = decode(
            token, 
            signing_key.key, 
            algorithms=["RS256"], 
            audience='845464112864-v3o86f5qj5mpbt4jf7qf8ji2p6qjj6lt.apps.googleusercontent.com', 
            issuer='https://accounts.google.com'
        )
        return jsonify({'user': decoded_token, 'message': 'Token verified successfully'}), 200
    except Exception as e:
        app.logger.error(f"Token verification failed: {str(e)}")
        return jsonify({'message': 'Token is invalid or expired!', 'error': str(e)}), 403

    
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.template_folder + "/" + path):
        return send_from_directory(app.template_folder, path)
    else:
        return send_from_directory(app.template_folder, "index.html")

@app.route('/classify', methods=['POST'])
def classify_text():
    if request.method == 'POST':
        input_text = request.json['text']
        user_result = request.json.get('user_result')
        user_highlight = request.json.get('user_highlight')
        user_id = request.json.get('user_id', None)
        output_string, important_words, document_id = classify(input_text, user_id, user_result, user_highlight) 

        return jsonify(result=output_string, words='\n'.join(important_words), document_id=document_id)
    
@app.route('/database', methods=['POST'], endpoint='database_post')
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
    delete_classification_history(user_id, document_id)
    return jsonify({"message": "History deleted"})

@app.route('/history/clear/<user_id>', methods=['DELETE'])
def clear_history(user_id):
    clear_classification_history(user_id)
    return jsonify({"message": "History cleared"})

@app.route('/history/update/<user_id>/<document_id>', methods=['PUT'])
def update_history(user_id, document_id):
    user_result = request.json.get('user_result')
    user_highlight = request.json.get('user_highlight')
    update_classification_history(document_id, user_result, user_highlight)
    return jsonify({"message": "History updated"})

if __name__ == '__main__':
    app.run(debug=True, port=5002)
