import requests
from flask import Flask, request
from sklearn.pipeline import Pipeline
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.datasets import fetch_20newsgroups

response = requests.get('http://localhost:5001/api/getText')
result = response.text
# result = json_data['value']
user_inputs = [result]

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

# Define a dictionary that maps category names to output strings
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


predicted = text_clf.predict(user_inputs)

for doc, category in zip(user_inputs, predicted):
    output_string = category_map[twenty_train.target_names[category]]
    print('%s' % output_string)
    #  print('%r => %s' % (doc, twenty_train.target_names[category]))