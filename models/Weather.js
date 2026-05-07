const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  temperature: { type: Number, required: true, min: -40, max: 80 },
  humidity: { type: Number, required: true, min: 0, max: 100 },
  pressure: { type: Number, required: true, min: 300, max: 1100 },
  deviceId: { type: String, required: true, default: 'ESP32_001' },
  location: { type: String, required: true, default: 'Bowen University, Iwo' },
  timestamp: { type: Date, default: Date.now }
});

weatherSchema.index({ timestamp: -1, deviceId: 1 });

module.exports = mongoose.model('WeatherReading', weatherSchema);