import joblib
import re
from database import save_classification_history

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

def find_important_words(sentence, text_clf, original_class, top_n=5):
    words = sentence.split()
    original_proba = text_clf.predict_proba([sentence])[0][original_class]

    word_diffs = []
    processed_words = set()
    for i, word in enumerate(words):
        # Skip the word if it has already been processed
        if word.lower() in processed_words:
            continue

        # Remove the current word from the original sentence
        without_word = ' '.join(w for w in words if w.lower() != word.lower())
        new_proba = text_clf.predict_proba([without_word])[0][original_class]
        diff = abs(original_proba - new_proba)
        word_diffs.append((word, diff))

        # Add the word to the set of processed words
        processed_words.add(word.lower())

    # Sort words by their importance (difference in probabilities)
    sorted_words = sorted(word_diffs, key=lambda x: x[1], reverse=True)

    # Calculate the total importance (sum of diffs)
    total_importance = sum(diff for _, diff in sorted_words)

    # Return the top N important words and their importance percentage
    return [(re.sub(r'\W', '', word).capitalize()) + "(" + f"{round(diff / total_importance * 100)}%" + ")" for word, diff in sorted_words[:top_n]]

def classify(input_text, user_id=None):
    user_inputs = [input_text]

    # Calculate top_n based on the length of the input text
    num_words = len(input_text.split())
    topN = max(3, int(num_words * 0.1))  # Set top_n to 10% of the number of words, with a minimum of 1

    # Perform the classification
    predicted = text_clf.predict([input_text])
    predicted_class = int(predicted[0])  # Convert the predicted class to an integer
    important_words = find_important_words(input_text, text_clf, predicted_class, top_n=topN)
    output_string = category_map[twenty_train.target_names[predicted_class]]

    # Save the classification history for the user if user_id exists
    if user_id:
        save_classification_history(user_id, input_text, output_string)

    return output_string, important_words