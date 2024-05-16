import joblib
from sklearn.pipeline import Pipeline
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.datasets import fetch_20newsgroups

# Load data
categories = ['soc.religion.christian', 'comp.graphics', 'sci.med',
              'sci.electronics', 'sci.space', 'sci.crypt', 'rec.sport.baseball',
              'rec.sport.hockey', 'rec.autos', 'talk.politics.guns']

twenty_train = fetch_20newsgroups(subset='train', categories=categories, shuffle=True, random_state=42)
twenty_test = fetch_20newsgroups(subset='test', categories=categories, shuffle=True, random_state=42)

# Define a pipeline
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words='english')),
    ('clf', LogisticRegression(solver='liblinear', max_iter=1000))
])

# Define the parameter grid
param_grid = {
    'tfidf__max_df': [0.5, 0.75, 1.0],
    'tfidf__ngram_range': [(1, 1), (1, 2)],
    'clf__C': [0.1, 1, 10]
}

# Perform grid search
grid_search = GridSearchCV(pipeline, param_grid, cv=5, n_jobs=-1, verbose=10)
grid_search.fit(twenty_train.data, twenty_train.target)

# Print the best parameters and the best score
print(f'Best parameters: {grid_search.best_params_}')
print(f'Best cross-validation score: {grid_search.best_score_:.2f}')

# Testing the model on the test dataset with the best estimator
predicted_test = grid_search.best_estimator_.predict(twenty_test.data)
test_accuracy = accuracy_score(twenty_test.target, predicted_test)
print(f'Test accuracy: {test_accuracy:.2f}')

# Detailed evaluation
print(classification_report(twenty_test.target, predicted_test))
print(confusion_matrix(twenty_test.target, predicted_test))

# Save the trained model and the twenty_train object to files
joblib.dump(grid_search.best_estimator_, 'text_classifier.joblib')
joblib.dump(twenty_train, 'twenty_train.joblib')
