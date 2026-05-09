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
    # Use absolute path to ensure gunicorn finds it
    model_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'model.joblib')
    logging.info(f"Attempting to load model from: {model_path}")
    model, feature_cols, le_dict = load_model(model_path)
    logging.info("Model loaded successfully!")
except Exception as e:
    err_trace = traceback.format_exc()
    logging.error(f"Error loading model: {e}\n{err_trace}")
    model, feature_cols, le_dict = None, None, None

@app.route('/health', methods=['GET'])
def health():
    status = "healthy" if model is not None else "model_missing"
    return jsonify({
        "status": status, 
        "service": "ScoreKu ML API",
        "model_path_checked": os.path.join(os.path.abspath(os.path.dirname(__file__)), 'model.joblib')
    })

@app.route('/debug-load', methods=['GET'])
def debug_load():
    try:
        model_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'model.joblib')
        model_exists = os.path.exists(model_path)
        
        # Test imports locally within function
        import numpy
        import xgboost
        import shap
        
        # Try loading directly
        from predict import load_model
        model, feature_cols, le_dict = load_model(model_path)
        
        return jsonify({
            "status": "success",
            "model_path": model_path,
            "model_exists": model_exists,
            "feature_cols_count": len(feature_cols) if feature_cols else 0
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error_message": str(e),
            "traceback": traceback.format_exc(),
            "model_path": model_path,
            "model_exists": model_exists
        }), 500

@app.route('/predict', methods=['POST'])
def api_predict():
    try:
        # Check if the global model loaded successfully
        if model is None:
            return jsonify({"error": "ML Model failed to load on startup"}), 500
            
        profile_data = request.json
        if not profile_data:
            return jsonify({"error": "No JSON payload provided"}), 400
            
        # Call the imported 'predict' function from predict.py
        result = predict(profile_data)
        return jsonify(result)
        
    except Exception as e:
        logging.error(f"Prediction error: {traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)