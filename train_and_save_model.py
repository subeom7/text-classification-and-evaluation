import joblib
from sklearn.pipeline import Pipeline
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score
from sklearn.datasets import fetch_20newsgroups


categories = ['soc.religion.christian','comp.graphics', 'sci.med', 
              'sci.electronics','sci.space', 'sci.crypt','rec.sport.baseball', 
              'rec.sport.hockey', 'rec.autos','talk.politics.guns']

twenty_train = fetch_20newsgroups(subset='train', categories=categories, shuffle=True, random_state=42)
twenty_test = fetch_20newsgroups(subset='test', categories=categories, shuffle=True, random_state=42)

text_clf = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words='english')),
    ('clf', MultinomialNB())
])

text_clf.fit(twenty_train.data, twenty_train.target)

# Testing the model on the test dataset
predicted_test = text_clf.predict(twenty_test.data)
test_accuracy = accuracy_score(twenty_test.target, predicted_test)
print(f'Test accuracy: {test_accuracy:.2f}')

# Save the trained model and the twenty_train object to files
joblib.dump(text_clf, 'text_classifier.joblib')
joblib.dump(twenty_train, 'twenty_train.joblib')
