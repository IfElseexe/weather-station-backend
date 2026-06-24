const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  temperature: { type: Number, required: true,  min: -40, max: 80 },
  humidity:    { type: Number, required: true,  min: 0,   max: 100 },
  pressure:    { type: Number, required: false, min: 300, max: 1100, default: null },
  rain:        { type: Number, required: false, min: 0,   max: 100,  default: 0 },
  deviceId:    { type: String, required: true,  default: 'BOWEN_NODE_001' },
  location:    { type: String, required: true,  default: 'Bowen University, Iwo' },
  timestamp:   { type: Date, default: Date.now }
});

weatherSchema.index({ timestamp: -1, deviceId: 1 });

module.exports = mongoose.model('WeatherReading', weatherSchema);