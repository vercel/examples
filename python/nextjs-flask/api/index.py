from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/api/python")
def python_route():
    return jsonify(message="Hello from Flask!")
