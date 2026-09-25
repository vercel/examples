from flask import Flask, request, Response, jsonify
import requests

app = Flask(__name__)

# Base route for proxying
@app.route('/<path:target_url>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def proxy(target_url):
    try:
    
        full_url = target_url

        # Extract headers from the incoming request
        headers = {"User-Agent":"	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"}

    

        # Forward the request to the target URL
        response = requests.request(
            method=request.method,
            url=full_url,
            headers=headers
        )

        return Response(response.content, response.status_code, response_headers)

    except Exception as e:
        # Handle errors gracefully
        return jsonify({"error": "Failed to proxy the request", "details": str(e)}), 500


