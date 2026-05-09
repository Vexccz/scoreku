const ScoreResult = require('../models/ScoreResult');
const axios = require('axios'); // Add this at the top

// Helper to call Python ML microservice
const runMLPrediction = async (profileData) => {
  try {
    // We map the input directly to the microservice payload
    const mlInput = {
      age: profileData.age || 25,
      borrower_type: 'individual',
      state: 'Selangor',
      household_size: 4,
      income_month_1: profileData.monthly_income || 2500,
      income_month_2: profileData.monthly_income || 2500,
      income_month_3: profileData.monthly_income || 2500,
      income_month_4: profileData.monthly_income || 2500,
      income_month_5: profileData.monthly_income || 2500,
      income_month_6: profileData.monthly_income || 2500,
      employment_type: profileData.employment_type === 'salaried' ? 'salaried' : 'freelance',
      months_at_current_job: 24,
      num_income_sources: 1,
      duitnow_transactions_per_month: profileData.duitnow_transactions || 5,
      duitnow_avg_transaction_amount: 50,
      ewallet_months_active: 12,
      mobile_wallet_used: profileData.ewallet_transactions > 0 ? 1 : 0,
      utility_bills_paid: profileData.bills_paid || 0,
      utility_bills_total: profileData.bills_total || 0,
      rent_paid_on_time_months: profileData.rent_on_time_months || 0,
      total_rental_months: 12,
      same_number_since_year: 2020,
      avg_monthly_recharge_amount: 30,
      recharge_frequency_per_month: profileData.mobile_recharges || 0,
      ecomm_orders_per_month: profileData.ecommerce_orders || 0,
      ecomm_return_rate: 0.0,
      prepaid_orders_ratio: 0.5,
      loan_amount_requested: 5000,
      loan_tenure_months: 12,
      avg_monthly_income: profileData.monthly_income || 2500,
      income_stability: 0.1,
      payment_consistency: profileData.bills_total > 0 ? (profileData.bills_paid / profileData.bills_total) : 0,
      digital_activity_score: 0.5,
      account_maturity: 3
    };

    const ML_URL = process.env.ML_API_URL || 'https://scoreku-ml.onrender.com/predict';
    const response = await axios.post(ML_URL, mlInput, { timeout: 10000 });
    return response.data;
  } catch (error) {
    throw new Error(`ML Microservice Error: ${error.message}`);
  }
};

// POST /api/score - Calculate credit score from user input
const submitScore = async (req, res) => {
  try {
    const {
      monthly_income,
      employment_type,
      ewallet_transactions,
      duitnow_transactions,
      bills_paid,
      bills_total,
      rent_on_time_months,
      ecommerce_orders,
      mobile_recharges,
    } = req.body;

    let scoreData;
    let mlUsed = false;

    try {
      // 1. Try to use Python ML model
      const mlResult = await runMLPrediction(req.body);
      
      // Parse ML SHAP feature contributions into frontend breakdown format
      const feature_breakdown = [];
      if (mlResult.feature_contributions) {
        const topFeatures = Object.keys(mlResult.feature_contributions).slice(0, 5);
        for (const feature of topFeatures) {
          const val = mlResult.feature_contributions[feature];
          feature_breakdown.push({
            name: feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            value: Math.min(Math.abs(val) * 10, 1), // Normalize for frontend bar chart (0-1)
            impact: val > 0 ? 'positive' : 'negative'
          });
        }
      }

      scoreData = {
        score: mlResult.score,
        risk_category: mlResult.risk_category,
        feature_breakdown: feature_breakdown.length > 0 ? feature_breakdown : [
          { name: 'Payment Consistency', value: 0.9 },
          { name: 'Income Level', value: 0.8 }
        ],
        tips: mlResult.tips || generateTips(mlResult.score, 0.9, 0.8, 12),
        is_ai_powered: true
      };
      mlUsed = true;
      console.log("o\" ML prediction successful!");

    } catch (mlErr) {
      console.log('s ML Model failed or unavailable, falling back to heuristic algorithm:', mlErr.message);
      
      // 2. Fallback heuristic scoring algorithm
      let score = 50; 
      if (monthly_income >= 5000) score += 15;
      else if (monthly_income >= 3000) score += 10;
      else if (monthly_income >= 1500) score += 5;

      const paymentRatio = bills_total > 0 ? bills_paid / bills_total : 0;
      score += Math.round(paymentRatio * 20);
      score += Math.min(rent_on_time_months, 12) / 12 * 10;

      const digitalScore = Math.min((ewallet_transactions + duitnow_transactions) / 50, 1);
      score += Math.round(digitalScore * 15);
      score += Math.min(ecommerce_orders / 10, 1) * 5;

      if (['salaried'].includes(employment_type)) score += 5;
      else if (['self-employed'].includes(employment_type)) score += 3;

      score = Math.max(0, Math.min(100, Math.round(score)));

      let risk_category;
      if (score >= 76) risk_category = 'Excellent';
      else if (score >= 56) risk_category = 'Fair';
      else if (score >= 31) risk_category = 'Moderate Risk';
      else risk_category = 'High Risk';

      const feature_breakdown = [
        { name: 'Payment Consistency', value: paymentRatio },
        { name: 'Rent History', value: Math.min(rent_on_time_months, 12) / 12 },
        { name: 'Digital Payments', value: digitalScore },
        { name: 'Income Level', value: Math.min(monthly_income / 5000, 1) },
        { name: 'E-commerce Activity', value: Math.min(ecommerce_orders / 10, 1) },
      ];

      scoreData = {
        score,
        risk_category,
        feature_breakdown,
        tips: generateTips(score, paymentRatio, digitalScore, rent_on_time_months),
        is_ai_powered: false
      };
    }

    // Try to save to DB (non-blocking)
    try {
      const saved = await ScoreResult.create({
        ...req.body,
        score: scoreData.score,
        risk_category: scoreData.risk_category,
        user: req.user?.id,
      });
      scoreData.id = saved._id;
    } catch (dbErr) {
      scoreData.id = null;
    }

    res.json(scoreData);
  } catch (err) {
    res.status(500).json({ message: 'Score calculation failed', error: err.message });
  }
};

// GET /api/score/:id
const getScoreById = async (req, res) => {
  try {
    const result = await ScoreResult.findById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Score not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch score', error: err.message });
  }
};

function generateTips(score, paymentRatio, digitalScore, rentMonths) {
  const tips = [];
  if (paymentRatio < 0.9) tips.push('Pay all utility bills on time to boost your consistency score');
  if (digitalScore < 0.5) tips.push('Use DuitNow and e-wallets more frequently for daily transactions');
  if (rentMonths < 10) tips.push('Maintain consistent rent payments to build your history');
  if (score < 60) tips.push('Consider diversifying income sources for better stability');
  tips.push('Keep your phone number active for longer periods to show stability');
  return tips.slice(0, 5);
}

module.exports = { submitScore, getScoreById };
