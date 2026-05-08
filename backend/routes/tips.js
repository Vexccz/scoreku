const express = require('express');
const router = express.Router();
const { getTips } = require('../controllers/tipsController');

// GET /api/tips/:score - Get improvement tips based on score
router.get('/:score', getTips);

module.exports = router;
