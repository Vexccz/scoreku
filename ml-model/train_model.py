"""
ScoreKu - Improved ML Model Training Script
Enhanced with: GridSearch, cross-validation, more features, better preprocessing
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score, GridSearchCV
from sklearn.metrics import accuracy_score, roc_auc_score, precision_score, recall_score, f1_score, classification_report
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.pipeline import Pipeline
import xgboost as xgb
import shap
import joblib
import json
import os
import warnings
warnings.filterwarnings('ignore')

# Malaysian states mapping
MALAYSIAN_STATES = [
    'Selangor', 'Johor', 'Penang', 'Perak', 'Sabah',
    'Sarawak', 'Kelantan', 'Terengganu', 'Pahang', 'Kedah',
    'Melaka', 'Negeri Sembilan', 'Perlis', 'Kuala Lumpur', 'Putrajaya'
]

INR_TO_MYR = 1 / 18

def load_and_malaysianize(csv_path):
    """Load CSV and convert to Malaysian context"""
    df = pd.read_csv(csv_path)
    
    unique_states = df['state'].unique()
    state_mapping = {s: MALAYSIAN_STATES[i % len(MALAYSIAN_STATES)] for i, s in enumerate(unique_states)}
    df['state'] = df['state'].map(state_mapping)
    
    currency_cols = [
        'income_month_1', 'income_month_2', 'income_month_3',
        'income_month_4', 'income_month_5', 'income_month_6',
        'upi_avg_transaction_amount', 'avg_monthly_recharge_amount',
        'loan_amount_requested'
    ]
    for col in currency_cols:
        if col in df.columns:
            df[col] = df[col] * INR_TO_MYR
    
    df = df.rename(columns={
        'upi_transactions_per_month': 'duitnow_transactions_per_month',
        'upi_avg_transaction_amount': 'duitnow_avg_transaction_amount',
        'upi_months_active': 'ewallet_months_active'
    })
    
    return df

def advanced_feature_engineering(df):
    """Enhanced feature engineering with more derived features"""
    income_cols = ['income_month_1', 'income_month_2', 'income_month_3',
                   'income_month_4', 'income_month_5', 'income_month_6']
    
    # Basic income features
    df['avg_monthly_income'] = df[income_cols].mean(axis=1)
    df['income_stability'] = df[income_cols].std(axis=1) / (df[income_cols].mean(axis=1) + 1e-6)
    df['income_trend'] = (df['income_month_6'] - df['income_month_1']) / (df['income_month_1'] + 1e-6)
    df['income_max'] = df[income_cols].max(axis=1)
    df['income_min'] = df[income_cols].min(axis=1)
    df['income_range'] = df['income_max'] - df['income_min']
    df['income_median'] = df[income_cols].median(axis=1)
    
    # Payment consistency
    df['payment_consistency'] = df['utility_bills_paid'] / (df['utility_bills_total'] + 1e-6)
    df['missed_bills'] = df['utility_bills_total'] - df['utility_bills_paid']
    
    # Rent reliability
    df['rent_reliability'] = df['rent_paid_on_time_months'] / (df['total_rental_months'] + 1e-6)
    
    # Digital activity
    df['digital_activity_score'] = (
        (df['duitnow_transactions_per_month'].fillna(0) / (df['duitnow_transactions_per_month'].max() + 1e-6)) +
        (df['ecomm_orders_per_month'].fillna(0) / (df['ecomm_orders_per_month'].max() + 1e-6))
    ) / 2
    
    # E-wallet engagement
    df['ewallet_engagement'] = df['duitnow_transactions_per_month'].fillna(0) * df['duitnow_avg_transaction_amount'].fillna(0)
    df['ewallet_monthly_volume'] = df['ewallet_engagement']
    
    # Account maturity
    df['account_maturity'] = 2026 - df['same_number_since_year'].fillna(2020)
    
    # E-commerce behavior
    df['ecomm_reliability'] = 1 - df['ecomm_return_rate'].fillna(0)
    df['prepaid_preference'] = df['prepaid_orders_ratio'].fillna(0.5)
    
    # Recharge behavior
    df['recharge_consistency'] = df['recharge_frequency_per_month'].fillna(0) * df['avg_monthly_recharge_amount'].fillna(0)
    
    # Loan-to-income ratio
    df['loan_to_income'] = df['loan_amount_requested'].fillna(0) / (df['avg_monthly_income'] * 12 + 1e-6)
    
    # Survey composite score (financial literacy proxy)
    survey_cols = [f'survey_q{i}' for i in range(1, 9)]
    df['survey_avg'] = df[survey_cols].mean(axis=1)
    df['survey_consistency'] = df[survey_cols].std(axis=1)
    
    # Household burden
    df['income_per_person'] = df['avg_monthly_income'] / (df['household_size'] + 1e-6)
    
    # Age-based features
    df['is_young'] = (df['age'] < 30).astype(int)
    df['is_senior'] = (df['age'] > 55).astype(int)
    
    # Job stability
    df['job_stability_score'] = df['months_at_current_job'].fillna(0) / 60  # normalize to 5 years
    df['job_stability_score'] = df['job_stability_score'].clip(0, 1)
    
    # Income diversification
    df['income_diversification'] = df['num_income_sources'].fillna(1) / 5  # normalize
    
    return df

def prepare_features(df):
    """Prepare feature matrix"""
    drop_cols = ['borrower_id', 'defaulted', 'default_probability', 'loan_purpose',
                 'income_month_1', 'income_month_2', 'income_month_3',
                 'income_month_4', 'income_month_5', 'income_month_6']
    
    # Encode categorical
    categorical_cols = ['borrower_type', 'state', 'employment_type']
    le_dict = {}
    
    for col in categorical_cols:
        if col in df.columns:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))
            le_dict[col] = le
    
    if 'mobile_wallet_used' in df.columns:
        df['mobile_wallet_used'] = df['mobile_wallet_used'].fillna(0).astype(int)
    
    feature_cols = [c for c in df.columns if c not in drop_cols and c in df.select_dtypes(include=[np.number]).columns]
    
    df[feature_cols] = df[feature_cols].fillna(0)
    
    # Remove infinite values
    df[feature_cols] = df[feature_cols].replace([np.inf, -np.inf], 0)
    
    return df[feature_cols], df['defaulted'], feature_cols, le_dict

def hyperparameter_tuning(X_train, y_train):
    """Grid search for best hyperparameters"""
    print("  Running hyperparameter search...")
    
    param_grid = {
        'n_estimators': [200, 300, 500],
        'max_depth': [4, 6, 8],
        'learning_rate': [0.05, 0.1, 0.15],
        'subsample': [0.7, 0.8, 0.9],
        'colsample_bytree': [0.7, 0.8, 0.9],
        'min_child_weight': [1, 3, 5],
        'gamma': [0, 0.1, 0.2],
    }
    
    # Use RandomizedSearch for speed (instead of full grid)
    from sklearn.model_selection import RandomizedSearchCV
    
    base_model = xgb.XGBClassifier(
        random_state=42,
        eval_metric='logloss',
        use_label_encoder=False
    )
    
    search = RandomizedSearchCV(
        base_model,
        param_grid,
        n_iter=50,
        cv=5,
        scoring='roc_auc',
        random_state=42,
        n_jobs=-1,
        verbose=0
    )
    
    search.fit(X_train, y_train)
    
    print(f"  Best AUC-ROC (CV): {search.best_score_:.4f}")
    print(f"  Best params: {search.best_params_}")
    
    return search.best_estimator_, search.best_params_

def train_and_evaluate(X, y, feature_cols):
    """Train with cross-validation and hyperparameter tuning"""
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Hyperparameter tuning
    best_model, best_params = hyperparameter_tuning(X_train, y_train)
    
    # Cross-validation on full training set
    cv_scores = cross_val_score(best_model, X_train, y_train, cv=5, scoring='roc_auc')
    print(f"\n  5-Fold CV AUC-ROC: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    
    # Final evaluation on test set
    y_pred = best_model.predict(X_test)
    y_pred_proba = best_model.predict_proba(X_test)[:, 1]
    
    metrics = {
        'accuracy': float(accuracy_score(y_test, y_pred)),
        'auc_roc': float(roc_auc_score(y_test, y_pred_proba)),
        'precision': float(precision_score(y_test, y_pred)),
        'recall': float(recall_score(y_test, y_pred)),
        'f1_score': float(f1_score(y_test, y_pred)),
        'cv_auc_mean': float(cv_scores.mean()),
        'cv_auc_std': float(cv_scores.std()),
        'best_params': best_params,
        'n_features': len(feature_cols),
        'training_samples': len(X_train),
        'test_samples': len(X_test),
    }
    
    print(f"\n  Final Test Metrics:")
    print(f"    Accuracy:  {metrics['accuracy']:.4f}")
    print(f"    AUC-ROC:   {metrics['auc_roc']:.4f}")
    print(f"    Precision: {metrics['precision']:.4f}")
    print(f"    Recall:    {metrics['recall']:.4f}")
    print(f"    F1-Score:  {metrics['f1_score']:.4f}")
    
    return best_model, metrics, X_test

def generate_shap_values(model, X_test, feature_cols):
    """Generate SHAP values"""
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_test)
    
    mean_shap = np.abs(shap_values).mean(axis=0)
    feature_importance = {
        feature_cols[i]: float(mean_shap[i])
        for i in range(len(feature_cols))
    }
    
    feature_importance = dict(
        sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
    )
    
    return feature_importance

def main():
    print("=" * 60)
    print("  ScoreKu - Enhanced ML Model Training (v2)")
    print("  XGBoost + Hyperparameter Tuning + Advanced Features")
    print("=" * 60)
    
    data_path = os.path.join('..', 'data', 'alternate_credit_raw.csv')
    model_path = 'model.joblib'
    
    print("\n[1/6] Loading and Malaysianizing data...")
    df = load_and_malaysianize(data_path)
    print(f"  Loaded {len(df)} rows, {len(df.columns)} columns")
    
    print("\n[2/6] Advanced feature engineering...")
    df = advanced_feature_engineering(df)
    print(f"  Total columns after engineering: {len(df.columns)}")
    
    print("\n[3/6] Preparing feature matrix...")
    X, y, feature_cols, le_dict = prepare_features(df)
    print(f"  Features: {len(feature_cols)}")
    print(f"  Target: {y.value_counts().to_dict()}")
    print(f"  Default rate: {y.mean():.2%}")
    
    print("\n[4/6] Training with hyperparameter tuning...")
    model, metrics, X_test = train_and_evaluate(X, y, feature_cols)
    
    print("\n[5/6] Generating SHAP explanations...")
    feature_importance = generate_shap_values(model, X_test, feature_cols)
    top_10 = list(feature_importance.items())[:10]
    print(f"  Top 10 features:")
    for name, imp in top_10:
        print(f"    {name}: {imp:.4f}")
    
    print("\n[6/6] Saving outputs...")
    joblib.dump({
        'model': model,
        'feature_cols': feature_cols,
        'le_dict': le_dict,
        'version': '2.0',
        'score_range': '300-850'
    }, model_path)
    print(f"  [OK] {model_path}")
    
    with open('model_metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)
    print("  [OK] model_metrics.json")
    
    with open('feature_importance.json', 'w') as f:
        json.dump(feature_importance, f, indent=2)
    print("  [OK] feature_importance.json")
    
    print("\n" + "=" * 60)
    print(f"  Training complete!")
    print(f"  Accuracy: {metrics['accuracy']:.2%} | AUC: {metrics['auc_roc']:.2%}")
    print(f"  Features: {len(feature_cols)} | CV AUC: {metrics['cv_auc_mean']:.4f}")
    print("=" * 60)

if __name__ == '__main__':
    main()
