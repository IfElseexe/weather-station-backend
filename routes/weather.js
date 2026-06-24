const express = require('express');
const router = express.Router();
const Weather = require('../models/Weather');

router.post('/', async (req, res) => {
  try {
    const { temperature, humidity, pressure, rain, deviceId, location } = req.body;

    if (temperature === undefined || humidity === undefined)
      return res.status(400).json({ error: 'temperature and humidity are required' });

    if (temperature < -40 || temperature > 80)
      return res.status(400).json({ error: 'Temperature out of range' });
    if (humidity < 0 || humidity > 100)
      return res.status(400).json({ error: 'Humidity out of range' });

    const reading = new Weather({
      temperature,
      humidity,
      pressure:  pressure ?? null,
      rain:      rain     ?? 0,
      deviceId:  deviceId || 'BOWEN_NODE_001',
      location:  location || 'Bowen University, Iwo'
    });

    await reading.save();
    res.status(201).json({ message: 'Reading saved', data: reading });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/latest', async (req, res) => {
  try {
    const latest = await Weather.findOne().sort({ timestamp: -1 });
    if (!latest) return res.status(404).json({ error: 'No readings found' });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const { start, end, limit = 100 } = req.query;
    let query = {};
    if (start || end) {
      query.timestamp = {};
      if (start) query.timestamp.$gte = new Date(start);
      if (end)   query.timestamp.$lte = new Date(end);
    }
    const readings = await Weather.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    res.json({ count: readings.length, data: readings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await Weather.aggregate([{
      $group: {
        _id: null,
        avgTemp:       { $avg: '$temperature' },
        minTemp:       { $min: '$temperature' },
        maxTemp:       { $max: '$temperature' },
        avgHumidity:   { $avg: '$humidity' },
        minHumidity:   { $min: '$humidity' },
        maxHumidity:   { $max: '$humidity' },
        totalReadings: { $sum: 1 }
      }
    }]);
    if (!stats.length) return res.status(404).json({ error: 'No data available' });
    const s = stats[0];
    res.json({
      temperature:   { avg: +s.avgTemp.toFixed(2),     min: s.minTemp,     max: s.maxTemp },
      humidity:      { avg: +s.avgHumidity.toFixed(2), min: s.minHumidity, max: s.maxHumidity },
      totalReadings: s.totalReadings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;