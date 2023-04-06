from flask import Flask, request, jsonify
from flask_cors import CORS
from classifier import text_clf, classify

app = Flask(__name__)
CORS(app)

@app.route('/classify', methods=['POST'])
def classify_text():
    if request.method == 'POST':
        input_text = request.json['text']
        user_id = request.json.get('user_id', None)
        output_string, important_words = classify(input_text, user_id)

        return jsonify(result=output_string, words='\n'.join(important_words))

if __name__ == '__main__':
    app.run(debug=True, port=5002)
