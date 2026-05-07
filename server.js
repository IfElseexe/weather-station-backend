const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

app.use('/api/weather', require('./routes/weather'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Weather API is running' });
});

app.get('/', (req, res) => {
  res.json({
    message: 'IoT Weather Monitoring API',
    author: 'Ajibade Emmanuel Tioluwaniemi - BU22SEN1034',
    endpoints: {
      health: 'GET /api/health',
      postReading: 'POST /api/weather',
      getLatest: 'GET /api/weather/latest',
      getHistory: 'GET /api/weather/history',
      getStats: 'GET /api/weather/stats'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));