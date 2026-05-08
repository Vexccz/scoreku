const mongoose = require('mongoose');

const scoreResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous scoring for demo
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  riskCategory: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  features: {
    type: Object,
    required: true
  },
  featureContributions: {
    type: Object,
    default: {}
  },
  tips: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ScoreResult', scoreResultSchema);
