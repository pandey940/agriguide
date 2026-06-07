const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch community posts' });
  }
});

// Create a post
router.post('/', async (req, res) => {
  try {
    const { author, title, content, category, tags, language } = req.body;
    const post = new CommunityPost({ author, title, content, category, tags, language });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Add a reply
router.post('/:id/reply', async (req, res) => {
  try {
    const { author, content, isExpert } = req.body;
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    post.replies.push({ author, content, isExpert });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add reply' });
  }
});

// Upvote post
router.put('/:id/upvote', async (req, res) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(req.params.id, { $inc: { upvotes: 1 } }, { new: true });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upvote' });
  }
});

module.exports = router;
