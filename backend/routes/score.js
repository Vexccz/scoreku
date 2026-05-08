const express = require('express');
const router = express.Router();
const { submitScore, getScoreById } = require('../controllers/scoreController');

// POST /api/score - Submit user profile, get credit score
router.post('/', submitScore);

// GET /api/score/:id - Get saved score by ID
router.get('/:id', getScoreById);

module.exports = router;
