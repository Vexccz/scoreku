"""
ScoreKu - Prediction Script
Loads trained model and scores a single user profile
Returns: score (0-100), risk_category, feature_contributions (SHAP)
"""

import numpy as np
import joblib
import shap
import json
import sys


def load_model(model_path='model.joblib'):
    """Load trained model and metadata"""
    data = joblib.load(model_path)
    return data['model'], data['feature_cols'], data['le_dict']


def score_to_credit(default_prob):
    """Convert default probability to credit score (0-100, higher = better)"""
    # Inverse relationship: low default prob = high score
    score = int((1 - default_prob) * 100)
    return max(0, min(100, score))


def get_risk_category(score):
    """Categorize risk based on score"""
    if score >= 70:
        return 'Low'
    elif score >= 40:
        return 'Medium'
    else:
        return 'High'


def get_tips(score, risk_category, contributions):
    """Generate improvement tips based on score and feature contributions"""
    tips = []
    
    if risk_category == 'High':
        tips.append("Tingkatkan pembayaran bil utiliti tepat pada masanya")
        tips.append("Gunakan DuitNow/e-wallet secara konsisten untuk bina rekod digital")
        tips.append("Kurangkan perbelanjaan tidak perlu dan tingkatkan simpanan")
    elif risk_category == 'Medium':
        tips.append("Kekalkan pembayaran sewa dan bil yang konsisten")
        tips.append("Tambah sumber pendapatan jika boleh")
        tips.append("Gunakan platform e-dagang dengan bijak - kurangkan pemulangan")
    else:
        tips.append("Teruskan tabiat kewangan yang baik!")
        tips.append("Pertimbangkan untuk memohon had kredit yang lebih tinggi")
        tips.append("Diversifikasi aktiviti kewangan digital anda")
    
    # Add specific tips based on top negative contributors
    sorted_contrib = sorted(contributions.items(), key=lambda x: x[1])
    for feature, value in sorted_contrib[:2]:
        if 'income_stability' in feature and value > 0:
            tips.append("Pendapatan anda tidak stabil - cuba cari sumber pendapatan tetap")
        if 'payment_consistency' in feature and value > 0:
            tips.append("Bayar semua bil utiliti tepat pada masanya")
        if 'digital_activity' in feature and value > 0:
            tips.append("Tingkatkan penggunaan DuitNow dan platform digital")
    
    return tips[:5]


def predict(user_profile):
    """
    Score a single user profile
    
    Args:
        user_profile: dict with user features
        
    Returns:
        dict with score, risk_category, feature_contributions, tips
    """
    model, feature_cols, le_dict = load_model()
    
    # Prepare input
    input_data = np.zeros(len(feature_cols))
    
    for i, col in enumerate(feature_cols):
        if col in user_profile:
            value = user_profile[col]
            # Handle categorical encoding
            if col in le_dict:
                try:
                    value = le_dict[col].transform([str(value)])[0]
                except ValueError:
                    value = 0  # Unknown category
            input_data[i] = float(value)
    
    input_array = input_data.reshape(1, -1)
    
    # Predict
    default_prob = model.predict_proba(input_array)[0][1]
    score = score_to_credit(default_prob)
    risk_category = get_risk_category(score)
    
    # SHAP explanations
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(input_array)[0]
    
    # Feature contributions
    contributions = {
        feature_cols[i]: float(shap_values[i])
        for i in range(len(feature_cols))
    }
    # Sort by absolute impact
    contributions = dict(
        sorted(contributions.items(), key=lambda x: abs(x[1]), reverse=True)
    )
    
    # Get tips
    tips = get_tips(score, risk_category, contributions)
    
    return {
        'score': score,
        'risk_category': risk_category,
        'default_probability': float(default_prob),
        'feature_contributions': contributions,
        'tips': tips
    }


# Example usage / CLI
if __name__ == '__main__':
    # Example Malaysian user profile
    example_profile = {
        'age': 28,
        'borrower_type': 'individual',
        'state': 'Selangor',
        'household_size': 4,
        'income_month_1': 3500,
        'income_month_2': 3200,
        'income_month_3': 3800,
        'income_month_4': 3500,
        'income_month_5': 3600,
        'income_month_6': 3400,
        'employment_type': 'salaried',
        'months_at_current_job': 24,
        'num_income_sources': 1,
        'duitnow_transactions_per_month': 15,
        'duitnow_avg_transaction_amount': 85,
        'ewallet_months_active': 18,
        'mobile_wallet_used': 1,
        'utility_bills_paid': 10,
        'utility_bills_total': 12,
        'rent_paid_on_time_months': 11,
        'total_rental_months': 12,
        'same_number_since_year': 2019,
        'avg_monthly_recharge_amount': 45,
        'recharge_frequency_per_month': 2,
        'ecomm_orders_per_month': 4,
        'ecomm_return_rate': 0.05,
        'prepaid_orders_ratio': 0.6,
        'loan_amount_requested': 15000,
        'loan_tenure_months': 24,
        'avg_monthly_income': 3500,
        'income_stability': 0.05,
        'payment_consistency': 0.83,
        'digital_activity_score': 0.6,
        'account_maturity': 5
    }
    
    if len(sys.argv) > 1:
        # Load profile from JSON file
        with open(sys.argv[1], 'r') as f:
            example_profile = json.load(f)
    
    result = predict(example_profile)
    print(json.dumps(result, indent=2, ensure_ascii=False))
