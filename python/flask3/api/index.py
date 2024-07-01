from flask import Flask, request
from flask_cors import CORS
import joblib
import numpy as np
import  yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import random
import nltk
import numpy as np
import textstat
from nltk.tokenize import word_tokenize
from collections import Counter
import math

app = Flask(__name__)
CORS(app)
import sklearn
print(sklearn.__version__)

model_popularity = joblib.load('rfc_popularity (2).sav')
model_engagement = joblib.load('rfc_engagement (2).sav')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    all_features = get_features(data['videoUrl'])
    # get all but the last two features from the dictionary
    features = all_features[:-2]
    features_array = np.array(features).reshape(1, -1)
    print(features)

    popularity = model_popularity.predict_proba(features_array)
    engagement = model_engagement.predict_proba(features_array)
    print(popularity, engagement)
    print(all_features)
    # cast int32 to int
    all_features = [int(f) for f in all_features]
    return [popularity[0].tolist(), engagement[0].tolist(), all_features]

def get_video_info(video_url):
    ydl_opts = {}
    print(video_url)
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(video_url, download=False)
        return info_dict
    
def get_words_per_sec(transcript, duration):
    # count the number of words per transcript
    return len(transcript.split()) / duration

def get_similarity_score(transcript, words_per_sec, title):
    #calculate TF-IDF for the first 30 seconds of the transcript and title
    transcript_30s = ' '.join(transcript.split()[:int(words_per_sec) * 30])
    print(transcript_30s)

    # Load the tfidf_vectorizer
    tfidf_vectorizer = joblib.load('tfidf_vectorizer.pkl')
    print(tfidf_vectorizer)
    print(title)

    # calculate TF-IDF for the title
    tfidf_matrix_title = tfidf_vectorizer.transform([title])
    tfidf_matrix_transcript = tfidf_vectorizer.transform([transcript_30s])
    # Step 3: Cosine Similarity Calculation
    cosine_similarities = cosine_similarity(tfidf_matrix_title, tfidf_matrix_transcript)
    # use the diagonal of the cosine similarity matrix to get the similarity score
    similarity_score = np.diag(cosine_similarities)
    return similarity_score * 100

def get_distinctiveness(transcript):

    nltk.download('punkt')  # Download the punkt tokenizer

    # Create a count vectorizer object
    count_vectorizer = joblib.load('count_vectorizer.pkl')
    word_counts = count_vectorizer.transform([transcript])

    # Collect the vocabulary items and their counts
    vocab = count_vectorizer.get_feature_names_out()
    count = word_counts.sum(axis=0).A1

    # Calculate probability scores for each word
    total_word_count = count.sum()
    probabilities = count / total_word_count

    # Create a DataFrame for vocabulary and probabilities
    probability_score = pd.DataFrame({'word': vocab, 'prob': probabilities})

    # Create a dictionary for faster lookups
    word_prob_dict = dict(zip(probability_score['word'], probability_score['prob']))

    # Function to calculate perplexity on a subset of words
    def calculate_perplexity_subset(transcript, word_probabilities, subset_size=5, num_samples=3):
        transcript_words = nltk.word_tokenize(transcript.lower())
        subset_words = [random.sample(transcript_words, min(subset_size, len(transcript_words))) for _ in range(num_samples)]

        mean_cross_entropy = np.mean([
            np.sum([-np.log2(word_probabilities.get(word, 1e-10)) for word in subset]) / len(subset)
            for subset in subset_words
        ])

        return mean_cross_entropy

    # Calculate distinctiveness for each transcript
    distinctiveness = calculate_perplexity_subset(transcript, word_prob_dict)

    print(distinctiveness)

    # normalize distinctiveness
    distinctiveness = (distinctiveness - 16.189491) / (33.219281 - 16.189491) * 100

    return distinctiveness


def calculate_entropy(transcript):
    words = word_tokenize(transcript.lower())
    word_counts = Counter(words)
    total_words = len(words)

    # Calculate word probabilities
    word_probabilities = {word: count / total_words for word, count in word_counts.items()}

    # Calculate entropy
    entropy = -sum(prob * math.log2(prob) for prob in word_probabilities.values())

    print(entropy)
    return entropy
    
# get transcript from youtube video
def get_features(video_url):
    print("get_video_info index.py")
    try:
        video_id = video_url.split('v=')[1]
        transcribed_video_docs_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        transcript = ' '.join(part['text'] for part in transcribed_video_docs_list)

        video_info = get_video_info(video_url)
        print(video_info)

        duration = video_info['duration']
        languages = len(video_info['automatic_captions'])
        tags = next((tag for tag in video_info['tags'] if 'TED' not in tag and 'TEDx' not in tag), None)
        # encode tags with le_tags.pkl
        le_tags = joblib.load('le_tags.pkl')
        # encode tags, if not in le_tags, then encode with 'other'
        tags = le_tags.transform([tags])[0] if tags in le_tags.classes_ else le_tags.transform(['other'])[0]

        month = int(video_info['upload_date'][4:6])
        year = int(video_info['upload_date'][:4])
        transcript = transcript
        comment_count = video_info['comment_count']
        like_count = video_info['like_count']
        words_per_sec = get_words_per_sec(transcript, video_info['duration'])
        similarity_score = get_similarity_score(transcript, words_per_sec, video_info['fulltitle'])[0]
        distinctiveness = get_distinctiveness(transcript)
        flesch_kincaid_grade_level = textstat.flesch_kincaid_grade(transcript)
        dale_chall_grade_level = textstat.dale_chall_readability_score(transcript)
        vocabulary_diversity = calculate_entropy(transcript)*100
        return [duration, languages, tags, month, year, words_per_sec, similarity_score, distinctiveness, flesch_kincaid_grade_level, dale_chall_grade_level, vocabulary_diversity, comment_count, like_count]
    
    except Exception as error:
        print('Error:', error)


if __name__ == '__main__':
    print("starting")
    app.run(port=5000)
