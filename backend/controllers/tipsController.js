// GET /api/tips/:score - Get improvement tips based on score
const getTips = (req, res) => {
  const score = parseInt(req.params.score) || 50;

  const allTips = [
    { threshold: 0, tip: 'Start by paying all utility bills on time consistently' },
    { threshold: 0, tip: 'Register for DuitNow and make at least 10 transactions per month' },
    { threshold: 0, tip: 'Keep your phone number active - stability matters' },
    { threshold: 30, tip: 'Set up auto-debit for recurring bills to never miss a payment' },
    { threshold: 30, tip: 'Use e-wallets (TnG, GrabPay) for daily purchases' },
    { threshold: 50, tip: 'Maintain consistent monthly income for 6+ months' },
    { threshold: 50, tip: 'Reduce e-commerce return rate by being selective with purchases' },
    { threshold: 60, tip: 'Diversify digital payment methods across platforms' },
    { threshold: 70, tip: 'Consider formal employment for additional stability points' },
    { threshold: 80, tip: 'You are doing great! Maintain current habits for continued excellence' },
  ];

  const applicable = allTips
    .filter(t => t.threshold <= score)
    .map(t => t.tip)
    .slice(-5);

  res.json({ score, tips: applicable });
};

module.exports = { getTips };
