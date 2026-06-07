const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Profile Setup fields
  state: { type: String, default: '' },
  district: { type: String, default: '' },
  language: { type: String, default: 'en' },
  crops: [{ type: String }],
  farmSize: { type: Number, default: null } // in acres/hectares depending on preference
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
