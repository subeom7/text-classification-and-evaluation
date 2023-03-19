import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# allows requests from different origins (e.g. different domains or ports) to access resources on the server
CORS(app)

# Load the saved model and the twenty_train object
text_clf = joblib.load('text_classifier.joblib')
twenty_train = joblib.load('twenty_train.joblib')

category_map = {
    'soc.religion.christian': 'Religion/Christian',
    'comp.graphics': 'Computer/Graphics',
    'sci.med': 'Science/Medicine',
    'sci.electronics': 'Science/Electronics',
    'sci.space': 'Science/Space',
    'sci.crypt': 'Science/Cryptocurrency',
    'rec.sport.baseball': 'Sports/Baseball',
    'rec.sport.hockey': 'Sports/Hockey',
    'rec.autos': 'Automobile',
    'talk.politics.guns': 'Politics/Guns',
}

@app.route('/classify', methods=['POST'])
def classify_text():
    if request.method == 'POST':
        # Get the text from the request
        input_text = request.json['text']
        user_inputs = [input_text]

        # Perform the classification
        predicted = text_clf.predict(user_inputs)
        for category in predicted:
            output_string = category_map[twenty_train.target_names[category]]
            return jsonify(result=output_string)

if __name__ == '__main__':
    app.run(debug=True, port=5002)
