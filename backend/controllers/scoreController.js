const ScoreResult = require('../models/ScoreResult');

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

    // Simple scoring algorithm (in production, call Python ML model)
    let score = 50; // base score

    // Income factor (0-15 points)
    if (monthly_income >= 5000) score += 15;
    else if (monthly_income >= 3000) score += 10;
    else if (monthly_income >= 1500) score += 5;

    // Payment consistency (0-20 points)
    const paymentRatio = bills_total > 0 ? bills_paid / bills_total : 0;
    score += Math.round(paymentRatio * 20);

    // Rent history (0-10 points)
    score += Math.min(rent_on_time_months, 12) / 12 * 10;

    // Digital activity (0-15 points)
    const digitalScore = Math.min((ewallet_transactions + duitnow_transactions) / 50, 1);
    score += Math.round(digitalScore * 15);

    // E-commerce (0-5 points)
    score += Math.min(ecommerce_orders / 10, 1) * 5;

    // Employment stability bonus
    if (['salaried'].includes(employment_type)) score += 5;
    else if (['self-employed'].includes(employment_type)) score += 3;

    // Clamp to 0-100
    score = Math.max(0, Math.min(100, Math.round(score)));

    // Risk category
    let risk_category;
    if (score >= 76) risk_category = 'Excellent';
    else if (score >= 56) risk_category = 'Fair';
    else if (score >= 31) risk_category = 'Moderate Risk';
    else risk_category = 'High Risk';

    // Feature breakdown
    const feature_breakdown = [
      { name: 'Payment Consistency', value: paymentRatio },
      { name: 'Rent History', value: Math.min(rent_on_time_months, 12) / 12 },
      { name: 'Digital Payments', value: digitalScore },
      { name: 'Income Level', value: Math.min(monthly_income / 5000, 1) },
      { name: 'E-commerce Activity', value: Math.min(ecommerce_orders / 10, 1) },
    ];

    const result = {
      score,
      risk_category,
      feature_breakdown,
      tips: generateTips(score, paymentRatio, digitalScore, rent_on_time_months),
    };

    // Try to save to DB (non-blocking)
    try {
      const saved = await ScoreResult.create({
        ...req.body,
        score,
        risk_category,
        user: req.user?.id,
      });
      result.id = saved._id;
    } catch (dbErr) {
      // DB might not be connected, that's ok
      result.id = null;
    }

    res.json(result);
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
