const mongoose = require('mongoose');

const SoilReportSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false, // For now, we might not have full auth
  },
  n: { type: Number, required: true },
  p: { type: Number, required: true },
  k: { type: Number, required: true },
  ph: { type: Number, required: true },
  ec: { type: Number },
  organicCarbon: { type: Number },
  soilType: { type: String },
  location: {
    state: String,
    district: String
  },
  recommendations: [{
    cropName: String,
    suitability: Number,
    season: String,
    sowWindow: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SoilReport', SoilReportSchema);
