require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/score');
const tipsRoutes = require('./routes/tips');
const { chatWithAI } = require('./controllers/chatController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (optional for hackathon - works without it)
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/scoreku';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.log('⚠ MongoDB not connected (running without DB):', err.message));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/score', scoreRoutes);
app.use('/api/tips', tipsRoutes);
app.post('/api/chat', chatWithAI);

// Health check
app.get('/api/health', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const localPyPath = path.join(__dirname, '../.local_python/python/bin/python3');
  const mlScriptPath = path.join(__dirname, '../ml-model/predict.py');
  
  res.json({ 
    status: 'ok', 
    service: 'ScoreKu API', 
    version: '1.0.1',
    debug: {
      hasLocalPy: fs.existsSync(localPyPath),
      localPyPath: localPyPath,
      hasMlScript: fs.existsSync(mlScriptPath),
      mlScriptPath: mlScriptPath
    }
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 ScoreKu API running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;
