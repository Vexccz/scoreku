"""
ScoreKu - ML Model Training Script
Trains XGBoost model for alternative credit scoring (Malaysian context)
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score, precision_score, recall_score
from sklearn.preprocessing import LabelEncoder
import xgboost as xgb
import shap
import joblib
import json
import os

# Malaysian states mapping
MALAYSIAN_STATES = [
    'Selangor', 'Johor', 'Penang', 'Perak', 'Sabah',
    'Sarawak', 'Kelantan', 'Terengganu', 'Pahang', 'Kedah',
    'Melaka', 'Negeri Sembilan', 'Perlis', 'Kuala Lumpur', 'Putrajaya'
]

INR_TO_MYR = 1 / 18  # Approximate conversion rate


def load_and_malaysianize(csv_path):
    """Load CSV and convert to Malaysian context"""
    df = pd.read_csv(csv_path)
    
    # Map states to Malaysian states
    unique_states = df['state'].unique()
    state_mapping = {s: MALAYSIAN_STATES[i % len(MALAYSIAN_STATES)] for i, s in enumerate(unique_states)}
    df['state'] = df['state'].map(state_mapping)
    
    # Convert currency columns to MYR
    currency_cols = [
        'income_month_1', 'income_month_2', 'income_month_3',
        'income_month_4', 'income_month_5', 'income_month_6',
        'upi_avg_transaction_amount', 'avg_monthly_recharge_amount',
        'loan_amount_requested'
    ]
    for col in currency_cols:
        if col in df.columns:
            df[col] = df[col] * INR_TO_MYR
    
    # Rename UPI columns to DuitNow/e-wallet
    df = df.rename(columns={
        'upi_transactions_per_month': 'duitnow_transactions_per_month',
        'upi_avg_transaction_amount': 'duitnow_avg_transaction_amount',
        'upi_months_active': 'ewallet_months_active'
    })
    
    # Rename mobile_wallet_used context
    # Keep column name but it now represents TnG/GrabPay/MAE usage
    
    return df


def feature_engineering(df):
    """Create engineered features"""
    income_cols = ['income_month_1', 'income_month_2', 'income_month_3',
                   'income_month_4', 'income_month_5', 'income_month_6']
    
    # Average monthly income
    df['avg_monthly_income'] = df[income_cols].mean(axis=1)
    
    # Income stability (lower = more stable)
    df['income_stability'] = df[income_cols].std(axis=1) / (df[income_cols].mean(axis=1) + 1e-6)
    
    # Payment consistency
    df['payment_consistency'] = df['utility_bills_paid'] / (df['utility_bills_total'] + 1e-6)
    
    # Digital activity score (normalized)
    digital_cols = ['duitnow_transactions_per_month', 'ecomm_orders_per_month']
    df['digital_activity_score'] = (
        (df['duitnow_transactions_per_month'] - df['duitnow_transactions_per_month'].min()) /
        (df['duitnow_transactions_per_month'].max() - df['duitnow_transactions_per_month'].min() + 1e-6) +
        (df['ecomm_orders_per_month'] - df['ecomm_orders_per_month'].min()) /
        (df['ecomm_orders_per_month'].max() - df['ecomm_orders_per_month'].min() + 1e-6)
    ) / 2
    
    # Account maturity (years since same number)
    current_year = 2024
    df['account_maturity'] = current_year - df['same_number_since_year']
    
    return df


def prepare_features(df):
    """Prepare feature matrix for training"""
    # Drop non-feature columns
    drop_cols = ['borrower_id', 'defaulted', 'default_probability', 'loan_purpose']
    
    # Encode categorical columns
    categorical_cols = ['borrower_type', 'state', 'employment_type']
    le_dict = {}
    
    for col in categorical_cols:
        if col in df.columns:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))
            le_dict[col] = le
    
    # Boolean columns
    if 'mobile_wallet_used' in df.columns:
        df['mobile_wallet_used'] = df['mobile_wallet_used'].fillna(0).astype(int)
    
    feature_cols = [c for c in df.columns if c not in drop_cols]
    
    # Fill remaining NaN with 0 for numeric columns
    df[feature_cols] = df[feature_cols].fillna(0)
    
    return df[feature_cols], df['defaulted'], feature_cols, le_dict


def train_model(X, y, feature_cols):
    """Train XGBoost model"""
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    model = xgb.XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        eval_metric='logloss',
        use_label_encoder=False
    )
    
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
    
    # Predictions
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    # Metrics
    metrics = {
        'accuracy': float(accuracy_score(y_test, y_pred)),
        'auc_roc': float(roc_auc_score(y_test, y_pred_proba)),
        'precision': float(precision_score(y_test, y_pred)),
        'recall': float(recall_score(y_test, y_pred))
    }
    
    return model, metrics, X_test


def generate_shap_values(model, X_test, feature_cols):
    """Generate SHAP values for explainability"""
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_test)
    
    # Feature importance from SHAP
    mean_shap = np.abs(shap_values).mean(axis=0)
    feature_importance = {
        feature_cols[i]: float(mean_shap[i])
        for i in range(len(feature_cols))
    }
    
    # Sort by importance
    feature_importance = dict(
        sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
    )
    
    return feature_importance


def main():
    print("=" * 50)
    print("ScoreKu - ML Model Training")
    print("=" * 50)
    
    # Paths
    data_path = os.path.join('..', 'data', 'alternate_credit_raw.csv')
    model_path = 'model.joblib'
    
    # Load and process data
    print("\n[1/5] Loading and Malaysianizing data...")
    df = load_and_malaysianize(data_path)
    print(f"  Loaded {len(df)} rows, {len(df.columns)} columns")
    
    # Feature engineering
    print("[2/5] Engineering features...")
    df = feature_engineering(df)
    
    # Prepare features
    print("[3/5] Preparing feature matrix...")
    X, y, feature_cols, le_dict = prepare_features(df)
    print(f"  Features: {len(feature_cols)}, Target distribution: {y.value_counts().to_dict()}")
    
    # Train model
    print("[4/5] Training XGBoost model...")
    model, metrics, X_test = train_model(X, y, feature_cols)
    print(f"  Accuracy: {metrics['accuracy']:.4f}")
    print(f"  AUC-ROC:  {metrics['auc_roc']:.4f}")
    print(f"  Precision: {metrics['precision']:.4f}")
    print(f"  Recall:    {metrics['recall']:.4f}")
    
    # SHAP values
    print("[5/5] Generating SHAP explanations...")
    feature_importance = generate_shap_values(model, X_test, feature_cols)
    top_5 = list(feature_importance.items())[:5]
    print(f"  Top 5 features: {[f[0] for f in top_5]}")
    
    # Save outputs
    print("\nSaving outputs...")
    joblib.dump({'model': model, 'feature_cols': feature_cols, 'le_dict': le_dict}, model_path)
    print(f"  [OK] {model_path}")
    
    with open('model_metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)
    print("  [OK] model_metrics.json")
    
    with open('feature_importance.json', 'w') as f:
        json.dump(feature_importance, f, indent=2)
    print("  [OK] feature_importance.json")
    
    print("\n" + "=" * 50)
    print("Training complete! Model saved.")
    print("=" * 50)


if __name__ == '__main__':
    main()
