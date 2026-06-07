const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  isExpert: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  upvotes: { type: Number, default: 0 }
});

const CommunityPostSchema = new mongoose.Schema({
  author: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String }, // e.g., 'Disease', 'Market', 'General'
  tags: [String], // e.g., ['Tomato', 'Late Blight']
  language: { type: String, default: 'en' },
  upvotes: { type: Number, default: 0 },
  replies: [ReplySchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CommunityPost', CommunityPostSchema);
