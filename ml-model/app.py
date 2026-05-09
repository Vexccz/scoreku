from flask import Flask, request, jsonify
import os
import json
import logging
import joblib
import traceback

# Import functions from your existing predict.py
from predict import load_model, predict

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# Load model globally on startup to make requests fast
try:
    model_path = os.path.join(os.path.dirname(__file__), 'model.joblib')
    model, feature_cols, le_dict = load_model(model_path)
    logging.info("Model loaded successfully!")
except Exception as e:
    logging.error(f"Error loading model: {e}")
    model, feature_cols, le_dict = None, None, None

@app.route('/health', methods=['GET'])
def health():
    status = "healthy" if model is not None else "model_missing"
    return jsonify({"status": status, "service": "ScoreKu ML API"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None:
            return jsonify({"error": "ML Model failed to load on startup"}), 500
            
        profile_data = request.json
        if not profile_data:
            return jsonify({"error": "No JSON payload provided"}), 400
            
        result = predict(profile_data)
        return jsonify(result)
        
    except Exception as e:
        logging.error(f"Prediction error: {traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)