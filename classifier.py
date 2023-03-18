from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.pipeline import Pipeline
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.datasets import fetch_20newsgroups

app = Flask(__name__)

# allows requests from different origins (e.g. different domains or ports) to access resources on the server
CORS(app)
# Load dataset and train the model
categories = ['soc.religion.christian','comp.graphics', 'sci.med', 
              'sci.electronics','sci.space', 'sci.electronics', 
              'sci.crypt','rec.sport.baseball', 'rec.sport.hockey', 
              'rec.autos','talk.politics.guns']

twenty_train = fetch_20newsgroups(subset='train', categories=categories, shuffle=True, random_state=42)

text_clf = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', MultinomialNB())
])

text_clf.fit(twenty_train.data, twenty_train.target)

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
        for doc, category in zip(user_inputs, predicted):
            output_string = category_map[twenty_train.target_names[category]]
            return jsonify(result=output_string)

if __name__ == '__main__':
    app.run(debug=True, port=5002)