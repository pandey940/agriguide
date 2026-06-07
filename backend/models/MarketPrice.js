const mongoose = require('mongoose');

const MarketPriceSchema = new mongoose.Schema({
  commodity: { type: String, required: true },
  mandi: { type: String, required: true },
  state: { type: String },
  district: { type: String },
  price: { type: Number, required: true },
  unit: { type: String, default: 'Quintal' },
  date: { type: Date, default: Date.now },
  trend: { type: String, enum: ['up', 'down', 'stable'] } // simple trend indication
});

module.exports = mongoose.model('MarketPrice', MarketPriceSchema);
