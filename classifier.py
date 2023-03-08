import requests
from flask import Flask, request
from sklearn.pipeline import Pipeline
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.datasets import fetch_20newsgroups

response = requests.get('http://localhost:5000/api/getText')
result = response.text
# result = json_data['value']
user_inputs = [result]

categories = ['alt.atheism', 'soc.religion.christian',
              'comp.graphics', 'sci.med', 'sci.electronics', 
              'sci.space', 'sci.electronics', 'sci.crypt',
              'rec.sport.baseball', 'rec.sport.hockey', 'rec.autos']

twenty_train = fetch_20newsgroups(subset='train', categories=categories, shuffle=True, random_state=42)

text_clf = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', MultinomialNB())
])

text_clf.fit(twenty_train.data, twenty_train.target)


predicted = text_clf.predict(user_inputs)

for doc, category in zip(user_inputs, predicted):
     print('%r => %s' % (doc, twenty_train.target_names[category]))