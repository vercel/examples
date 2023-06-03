from flask import Flask, jsonify
from app.main import bp as main_bp


app = Flask(__name__)
app.register_blueprint(main_bp, url_prefix='/main')


@app.route('/')
def index():
    return jsonify({'message': 'Hey from flask API, index route'})
