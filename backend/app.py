from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app, origins="https://google-mini-search-1.onrender.com")



API_KEY = os.environ.get('API_KEY')
CX = os.environ.get('CX')


# Root route
@app.route('/')
def home():
    return "Welcome to the Google Mini Search Engine! Use the /search endpoint to perform searches."

# Search route
@app.route('/search')
def search():
    query = request.args.get('query')
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    url = f'https://www.googleapis.com/customsearch/v1?q={query}&key={API_KEY}&cx={CX}'
    response = requests.get(url)
    data = response.json()

    results = []
    if 'items' in data:
        for item in data['items']:
            results.append({
                'title': item['title'],
                'link': item['link'],
                'snippet': item['snippet']
            })

    return jsonify(results)

@app.route('/search-images')
def search_images():
    query = request.args.get('query')
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    url = f'https://www.googleapis.com/customsearch/v1?q={query}&key={API_KEY}&cx={CX}&searchType=image'
    response = requests.get(url)
    data = response.json()

    results = []
    if 'items' in data:
        for item in data['items']:
            # Check if the link is a Wikipedia URL
            wikipedia_url = None
            if 'link' in item:
                link = item['link']
                if 'wikipedia.org' in link:
                    wikipedia_url = link
                    print(f"Found Wikipedia URL: {wikipedia_url}")
                else:
                    print("No Wikipedia URL found in link")



            results.append({
                'title': item['title'],
                'link': item['link'],
                'image': item['image']['thumbnailLink'],
                'short_description': item.get('snippet', 'No description available')[:100] + '...',
                'full_description': item.get('snippet', 'No description available'),
                'wikipedia_url': wikipedia_url
            })





    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)
